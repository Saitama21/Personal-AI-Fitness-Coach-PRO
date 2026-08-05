const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const xInput = document.getElementById('xInput');
const zInput = document.getElementById('zInput');
const yInput = document.getElementById('yInput');
const hud = document.getElementById('hud');
const logEl = document.getElementById('log');
const titleEl = document.getElementById('workspaceTitle');
const lessonCard = document.getElementById('lessonCard');

const state = {
  mode:'turning', x:60, z:10, y:0, cutting:false, activeTool:1,
  stock:{diameter:80,length:140}, cuts:[], drillDepth:0, pockets:[]
};

function addLog(text){
  const div=document.createElement('div'); div.className='log-entry';
  div.innerHTML=`<time>${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</time>${text}`;
  logEl.prepend(div);
}

function machineToCanvas(x,z){
  const originX=canvas.width*0.71, centerY=canvas.height*0.5;
  const zScale=4.2, xScale=3.2;
  return {cx:originX+z*zScale, cy:centerY-x*xScale/2};
}

function drawGrid(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='rgba(255,255,255,.045)'; ctx.lineWidth=1;
  for(let x=0;x<canvas.width;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
  for(let y=0;y<canvas.height;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}
}

function drawTurning(){
  const originX=canvas.width*0.71, cy=canvas.height*.5;
  // axes
  ctx.lineWidth=2; ctx.strokeStyle='#58a6ff'; ctx.beginPath();ctx.moveTo(originX,cy);ctx.lineTo(180,cy);ctx.stroke();
  ctx.strokeStyle='#ff7b72';ctx.beginPath();ctx.moveTo(originX,cy+150);ctx.lineTo(originX,cy-170);ctx.stroke();
  ctx.fillStyle='#8fa3b8';ctx.font='16px sans-serif';ctx.fillText('Z−',190,cy-10);ctx.fillText('X+',originX+10,cy-155);
  // chuck right
  ctx.fillStyle='#3a4654';ctx.fillRect(originX+12,cy-105,120,210);
  ctx.fillStyle='#657487';ctx.fillRect(originX+12,cy-72,42,46);ctx.fillRect(originX+12,cy+26,42,46);
  // stock left
  const len=state.stock.length*4.2, h=state.stock.diameter*3.2/2;
  const grad=ctx.createLinearGradient(originX-len,cy-h/2,originX,cy+h/2);grad.addColorStop(0,'#aeb8c4');grad.addColorStop(.5,'#e7edf4');grad.addColorStop(1,'#7f8a96');
  ctx.fillStyle=grad;ctx.fillRect(originX-len,cy-h/2,len,h);
  // cuts overlay
  ctx.fillStyle='#0a1625';
  state.cuts.forEach(c=>{
    const p=machineToCanvas(c.x,c.z); const cutTop=cy-c.x*3.2/2;
    ctx.fillRect(p.cx-4,cy-h/2,10,Math.max(0,cutTop-(cy-h/2)));
    ctx.fillRect(p.cx-4,cy+c.x*3.2/2,10,Math.max(0,(cy+h/2)-(cy+c.x*3.2/2)));
  });
  // tool
  const p=machineToCanvas(state.x,state.z);
  ctx.fillStyle='#ffd866';ctx.beginPath();ctx.moveTo(p.cx,p.cy);ctx.lineTo(p.cx+38,p.cy-18);ctx.lineTo(p.cx+46,p.cy+12);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,216,102,.4)';ctx.strokeRect(p.cx+42,p.cy-38,110,58);
  ctx.fillStyle='#d9e7f5';ctx.font='14px sans-serif';ctx.fillText(`T${state.activeTool}`,p.cx+60,p.cy-5);
}

function drawDrilling(){
  drawTurning();
  const originX=canvas.width*.71,cy=canvas.height*.5;
  ctx.strokeStyle='#0a1625';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(originX-state.drillDepth*4.2,cy);ctx.lineTo(originX,cy);ctx.stroke();
}

function drawMilling(){
  const cx=canvas.width*.5,cy=canvas.height*.5;
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.strokeRect(cx-260,cy-170,520,340);
  ctx.fillStyle='#b4bec9';ctx.fillRect(cx-245,cy-155,490,310);
  ctx.fillStyle='#0a1625';state.pockets.forEach(p=>ctx.fillRect(cx+p.z*3-25,cy+p.y*3-25,50,50));
  const tx=cx+state.z*3,ty=cy+state.y*3;
  ctx.fillStyle='#ffd866';ctx.beginPath();ctx.arc(tx,ty,18,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#58a6ff';ctx.beginPath();ctx.moveTo(cx-280,cy);ctx.lineTo(cx+290,cy);ctx.stroke();
  ctx.strokeStyle='#7ee787';ctx.beginPath();ctx.moveTo(cx,cy-200);ctx.lineTo(cx,cy+200);ctx.stroke();
}

function render(){
  drawGrid();
  if(state.mode==='turning') drawTurning();
  if(state.mode==='drilling') drawDrilling();
  if(state.mode==='milling') drawMilling();
  hud.textContent=`X${state.x.toFixed(1)} · Z${state.z.toFixed(1)}${state.mode==='milling'?` · Y${state.y.toFixed(1)}`:''} · ${state.cutting?'рабочая подача':'безопасный ход'}`;
}

function syncInputs(){xInput.value=state.x;yInput.value=state.y;zInput.value=state.z}

function move(cut=false){
  state.x=Number(xInput.value);state.z=Number(zInput.value);state.y=Number(yInput.value);
  state.cutting=cut;
  if(cut){
    if(state.mode==='turning') state.cuts.push({x:Math.max(0,state.x),z:Math.min(0,state.z)});
    if(state.mode==='drilling') state.drillDepth=Math.max(0,-state.z);
    if(state.mode==='milling') state.pockets.push({z:state.z,y:state.y});
  }
  addLog(`${cut?'Рабочее перемещение':'Быстрый ход'}: X${state.x} Z${state.z}${state.mode==='milling'?` Y${state.y}`:''}`);
  render();
}

document.getElementById('moveBtn').onclick=()=>move(false);
document.getElementById('cutBtn').onclick=()=>move(true);
document.getElementById('homeBtn').onclick=()=>{state.x=90;state.z=20;state.y=0;state.cutting=false;syncInputs();addLog('Инструмент отведён в безопасную позицию');render()};
document.getElementById('resetBtn').onclick=()=>{state.x=60;state.z=10;state.y=0;state.cuts=[];state.drillDepth=0;state.pockets=[];syncInputs();addLog('Симуляция сброшена');render()};
document.getElementById('checkBtn').onclick=()=>{
  const ok=Math.abs(state.x-50)<.11 && Math.abs(state.z-0)<.11;
  lessonCard.innerHTML=ok?'<strong>✅ Верно</strong><p>Ты поставил инструмент в X50 Z0. X — диаметр, Z0 — торец детали.</p>':'<strong>Пока не совпало</strong><p>Для задания нужны X50 и Z0. Введи координаты и нажми «Переместить».</p>';
};

document.querySelectorAll('#modeTabs button').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('#modeTabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  state.mode=btn.dataset.mode;state.cutting=false;
  document.querySelector('.y-field').classList.toggle('hidden',state.mode!=='milling');
  titleEl.textContent=state.mode==='turning'?'Токарная симуляция':state.mode==='drilling'?'Симуляция сверления':'Симуляция фрезерования';
  addLog(`Режим: ${btn.textContent}`);render();
});

const toolGrid=document.getElementById('toolGrid');
for(let i=1;i<=15;i++){
  const b=document.createElement('button');b.className='tool-btn'+(i===1?' active':'');b.textContent=`T${i}`;
  b.onclick=()=>{document.querySelectorAll('.tool-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.activeTool=i;addLog(`Выбран инструмент T${i}`);render()};
  toolGrid.appendChild(b);
}
addLog('CNC Trainer запущен');render();
