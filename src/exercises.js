export const exercises = {
  goblet_squat: {
    id: "goblet_squat",
    name: "Гоблет-присед",
    muscle: "Ноги и ягодицы",
    muscleGroups: ["Квадрицепсы", "Ягодичные", "Приводящие"],
    equipment: ["dumbbells", "home", "gym"],
    pattern: "squat",
    unit: "кг",
    defaultReps: "8–12",
    rest: 90,
    cues: [
      "Стой прямо, стопы чуть шире плеч, носки слегка развёрнуты.",
      "Держи гантель у груди, локти направлены вниз.",
      "На вдохе опускайся, одновременно отводя таз назад и сгибая колени.",
      "Сохраняй опору на всей стопе и веди колени по линии носков.",
      "На выдохе поднимись, сохраняя нейтральную спину."
    ],
    avoid: ["Не заваливай колени внутрь.", "Не отрывай пятки.", "Не округляй поясницу в нижней точке."],
    contraindication: "При острой боли в колене или пояснице остановись и выбери безболезненную альтернативу.",
    alternative: "Присед к скамье без веса"
  },
  romanian_deadlift: {
    id: "romanian_deadlift",
    name: "Румынская тяга",
    muscle: "Задняя поверхность бедра",
    muscleGroups: ["Бицепс бедра", "Ягодичные", "Разгибатели спины"],
    equipment: ["dumbbells", "barbell", "home", "gym"],
    pattern: "hinge",
    unit: "кг",
    defaultReps: "8–10",
    rest: 105,
    cues: [
      "Встань устойчиво, вес держи близко к бёдрам.",
      "Слегка согни колени и зафиксируй нейтральную спину.",
      "Отводи таз назад, сохраняя вес близко к ногам.",
      "Опускайся до уверенного натяжения задней поверхности бедра.",
      "Вернись вверх за счёт ягодиц, без переразгибания поясницы."
    ],
    avoid: ["Не превращай движение в присед.", "Не тяни вес поясницей.", "Не запрокидывай корпус назад вверху."],
    contraindication: "Не выполняй через простреливающую боль в пояснице.",
    alternative: "Ягодичный мост"
  },
  incline_pushup: {
    id: "incline_pushup",
    name: "Отжимания от опоры",
    muscle: "Грудь, плечи, трицепс",
    muscleGroups: ["Грудные", "Передняя дельта", "Трицепс"],
    equipment: ["bodyweight", "home", "gym"],
    pattern: "push",
    unit: "повт.",
    defaultReps: "8–15",
    rest: 75,
    cues: [
      "Поставь ладони на устойчивую опору чуть шире плеч.",
      "Собери корпус в одну линию от головы до пяток.",
      "Опускай грудь к опоре, ведя локти примерно под 30–45°.",
      "Сохраняй лопатки контролируемыми и не проваливай поясницу.",
      "На выдохе оттолкнись до исходного положения."
    ],
    avoid: ["Не проваливай поясницу.", "Не поднимай плечи к ушам.", "Не сокращай амплитуду без причины."],
    contraindication: "При боли в запястье используй нейтральные рукояти или более высокую опору.",
    alternative: "Жим в тренажёре"
  },
  lat_pulldown: {
    id: "lat_pulldown",
    name: "Тяга верхнего блока",
    muscle: "Широчайшие и верх спины",
    muscleGroups: ["Широчайшие", "Ромбовидные", "Бицепс"],
    equipment: ["machine", "gym"],
    pattern: "pull",
    unit: "кг",
    defaultReps: "8–12",
    rest: 90,
    cues: [
      "Сядь устойчиво и зафиксируй бёдра под валиками.",
      "Возьми рукоять и сначала опусти лопатки вниз.",
      "Тяни локти к бокам, сохраняя лёгкий наклон корпуса.",
      "Остановись, когда рукоять приблизится к верхней части груди.",
      "Верни вес плавно, не теряя контроля лопаток."
    ],
    avoid: ["Не тяни блок за голову.", "Не раскачивай корпус.", "Не сгибай запястья."],
    contraindication: "При боли в плече уменьши амплитуду и выбери нейтральный хват.",
    alternative: "Тяга резинки сверху"
  },
  glute_bridge: {
    id: "glute_bridge",
    name: "Ягодичный мост",
    muscle: "Ягодицы и задняя цепь",
    muscleGroups: ["Ягодичные", "Бицепс бедра", "Кор"],
    equipment: ["bodyweight", "home", "gym"],
    pattern: "hinge",
    unit: "кг",
    defaultReps: "10–15",
    rest: 75,
    cues: [
      "Ляг на спину, поставь стопы устойчиво ближе к тазу.",
      "Слегка подкрути таз и собери рёбра.",
      "Поднимай таз за счёт ягодиц.",
      "В верхней точке удержи сокращение около секунды.",
      "Опустись контролируемо, сохраняя положение коленей."
    ],
    avoid: ["Не переразгибай поясницу.", "Не толкайся только носками.", "Не разводи колени бесконтрольно."],
    contraindication: "При дискомфорте в пояснице уменьши высоту подъёма.",
    alternative: "Разгибание бедра стоя с резинкой"
  },
  hip_thrust: {
    id: "hip_thrust",
    name: "Хип-траст",
    muscle: "Ягодичные мышцы",
    muscleGroups: ["Ягодичные", "Бицепс бедра", "Кор"],
    equipment: ["barbell", "dumbbells", "gym"],
    pattern: "hinge",
    unit: "кг",
    defaultReps: "8–12",
    rest: 105,
    cues: [
      "Упрись верхом спины в устойчивую скамью.",
      "Поставь стопы так, чтобы вверху голени были близки к вертикали.",
      "Подними таз и сохрани подбородок слегка опущенным.",
      "Сожми ягодицы в верхней точке без прогиба поясницы.",
      "Опускай таз контролируемо."
    ],
    avoid: ["Не переразгибай поясницу.", "Не ставь стопы слишком далеко.", "Не отрывай пятки."],
    contraindication: "При боли в пояснице уменьши амплитуду и нагрузку.",
    alternative: "Ягодичный мост"
  },
  reverse_lunge: {
    id: "reverse_lunge",
    name: "Обратные выпады",
    muscle: "Ноги и ягодицы",
    muscleGroups: ["Квадрицепсы", "Ягодичные", "Приводящие"],
    equipment: ["bodyweight", "dumbbells", "home", "gym"],
    pattern: "lunge",
    unit: "кг",
    defaultReps: "8–10/нога",
    rest: 90,
    cues: [
      "Встань устойчиво и собери корпус.",
      "Сделай контролируемый шаг назад.",
      "Опускайся вниз, сохраняя переднюю стопу полностью на полу.",
      "Переднее колено веди по линии стопы.",
      "Вернись вверх за счёт передней ноги."
    ],
    avoid: ["Не падай на заднее колено.", "Не заваливай таз в сторону.", "Не отталкивайся только задней ногой."],
    contraindication: "При боли в колене сократи глубину или замени упражнение.",
    alternative: "Шаг на невысокую платформу"
  },
  split_squat: {
    id: "split_squat",
    name: "Сплит-присед",
    muscle: "Ноги и ягодицы",
    muscleGroups: ["Квадрицепсы", "Ягодичные", "Приводящие"],
    equipment: ["bodyweight", "dumbbells", "home", "gym"],
    pattern: "lunge",
    unit: "кг",
    defaultReps: "8–12/нога",
    rest: 90,
    cues: [
      "Поставь ноги в устойчивую разножку.",
      "Сохраняй большую часть веса на передней стопе.",
      "Опускай таз почти вертикально вниз.",
      "Колено передней ноги веди по линии носка.",
      "Поднимайся без толчка задней ногой."
    ],
    avoid: ["Не ставь стопы на одной линии.", "Не заваливай колено внутрь.", "Не теряй опору передней пяткой."],
    contraindication: "При боли в колене уменьши глубину или используй опору рукой.",
    alternative: "Обратный выпад"
  },
  step_up: {
    id: "step_up",
    name: "Шаг на платформу",
    muscle: "Ноги и ягодицы",
    muscleGroups: ["Квадрицепсы", "Ягодичные", "Икроножные"],
    equipment: ["bodyweight", "dumbbells", "home", "gym"],
    pattern: "lunge",
    unit: "кг",
    defaultReps: "10–12/нога",
    rest: 75,
    cues: [
      "Выбери устойчивую платформу умеренной высоты.",
      "Полностью поставь рабочую стопу на платформу.",
      "Перенеси вес на рабочую ногу.",
      "Поднимись без сильного толчка нижней ногой.",
      "Спускайся мягко и контролируемо."
    ],
    avoid: ["Не ставь на платформу только носок.", "Не отталкивайся второй ногой.", "Не заваливай колено внутрь."],
    contraindication: "При боли в колене используй более низкую платформу.",
    alternative: "Обратные выпады"
  },
  calf_raise: {
    id: "calf_raise",
    name: "Подъёмы на носки",
    muscle: "Икроножные мышцы",
    muscleGroups: ["Икроножные", "Камбаловидная"],
    equipment: ["bodyweight", "dumbbells", "home", "gym"],
    pattern: "calf",
    unit: "кг",
    defaultReps: "12–20",
    rest: 60,
    cues: [
      "Встань устойчиво и держи стопы параллельно.",
      "Поднимись на носки максимально высоко без раскачки.",
      "Задержись в верхней точке.",
      "Опускай пятки медленно.",
      "Сохраняй колени и таз стабильными."
    ],
    avoid: ["Не пружинь внизу.", "Не заваливай стопы наружу.", "Не раскачивай корпус."],
    contraindication: "При боли в ахилле уменьши амплитуду и нагрузку.",
    alternative: "Подъёмы на носки сидя"
  },
  leg_abduction: {
    id: "leg_abduction",
    name: "Отведение ноги",
    muscle: "Средняя ягодичная",
    muscleGroups: ["Средняя ягодичная", "Малая ягодичная"],
    equipment: ["machine", "gym"],
    pattern: "abduction",
    unit: "кг",
    defaultReps: "12–15/нога",
    rest: 60,
    cues: [
      "Зафиксируй корпус и таз.",
      "Начни движение из тазобедренного сустава.",
      "Отводи ногу без разворота таза.",
      "Задержись в конечной точке на короткую паузу.",
      "Верни ногу плавно, сохраняя натяжение."
    ],
    avoid: ["Не раскачивай корпус.", "Не разворачивай носок чрезмерно наружу.", "Не используй инерцию."],
    contraindication: "При боли сбоку тазобедренного сустава уменьши нагрузку и амплитуду.",
    alternative: "Отведение ноги лёжа на боку"
  },
  back_extension: {
    id: "back_extension",
    name: "Гиперэкстензия",
    muscle: "Ягодицы и задняя цепь",
    muscleGroups: ["Ягодичные", "Бицепс бедра", "Разгибатели спины"],
    equipment: ["machine", "gym"],
    pattern: "hinge",
    unit: "кг",
    defaultReps: "10–15",
    rest: 75,
    cues: [
      "Настрой упор так, чтобы таз свободно сгибался.",
      "Сохраняй нейтральную спину.",
      "Опускай корпус за счёт сгибания в тазобедренном суставе.",
      "Поднимайся ягодицами и задней поверхностью бедра.",
      "Остановись в линии тела, не переразгибаясь."
    ],
    avoid: ["Не округляй поясницу.", "Не запрокидывай корпус вверх.", "Не используй рывок."],
    contraindication: "При боли в пояснице сократи амплитуду или замени упражнение.",
    alternative: "Румынская тяга с лёгким весом"
  },
  dumbbell_row: {
    id: "dumbbell_row",
    name: "Тяга гантели в наклоне",
    muscle: "Спина и задняя дельта",
    muscleGroups: ["Широчайшие", "Ромбовидные", "Задняя дельта"],
    equipment: ["dumbbells", "home", "gym"],
    pattern: "pull",
    unit: "кг",
    defaultReps: "8–12",
    rest: 75,
    cues: [
      "Зафиксируй корпус и нейтральную спину.",
      "Слегка опусти плечо и вытягивай лопатку внизу.",
      "Тяни локоть к тазу.",
      "Не разворачивай грудную клетку вслед за весом.",
      "Опускай гантель под полным контролем."
    ],
    avoid: ["Не дёргай вес.", "Не округляй поясницу.", "Не поднимай плечо к уху."],
    contraindication: "При нагрузке на поясницу выполняй с опорой грудью.",
    alternative: "Тяга сидя в тренажёре"
  },
  face_pull: {
    id: "face_pull",
    name: "Тяга каната к лицу",
    muscle: "Задняя дельта и верх спины",
    muscleGroups: ["Задняя дельта", "Трапеции", "Ромбовидные"],
    equipment: ["machine", "gym"],
    pattern: "pull",
    unit: "кг",
    defaultReps: "12–15",
    rest: 60,
    cues: [
      "Установи канат примерно на уровне лица.",
      "Сделай шаг назад и натяни трос.",
      "Тяни концы каната к лицу, разводя кисти в стороны.",
      "Своди лопатки и держи локти высоко.",
      "Вернись медленно, не теряя контроля плеч."
    ],
    avoid: ["Не раскачивай корпус.", "Не тяни только руками.", "Не опускай локти слишком низко."],
    contraindication: "При боли в плече уменьши вес и амплитуду наружной ротации.",
    alternative: "Разведение гантелей в наклоне"
  },
  rear_delt_fly: {
    id: "rear_delt_fly",
    name: "Разведение в наклоне",
    muscle: "Задняя дельта",
    muscleGroups: ["Задняя дельта", "Ромбовидные", "Трапеции"],
    equipment: ["dumbbells", "home", "gym"],
    pattern: "pull",
    unit: "кг",
    defaultReps: "12–15",
    rest: 60,
    cues: [
      "Наклони корпус и сохрани нейтральную спину.",
      "Слегка согни локти.",
      "Разводи руки в стороны без рывка.",
      "Остановись примерно на линии плеч.",
      "Опускай гантели медленно."
    ],
    avoid: ["Не поднимай плечи к ушам.", "Не раскачивай корпус.", "Не бери слишком тяжёлый вес."],
    contraindication: "При боли в плече сократи амплитуду.",
    alternative: "Face pull с лёгким весом"
  },
  shoulder_press: {
    id: "shoulder_press",
    name: "Жим гантелей сидя",
    muscle: "Плечи и трицепс",
    muscleGroups: ["Передняя дельта", "Средняя дельта", "Трицепс"],
    equipment: ["dumbbells", "gym"],
    pattern: "push",
    unit: "кг",
    defaultReps: "8–12",
    rest: 90,
    cues: [
      "Прижми стопы к полу и собери корпус.",
      "Начни с предплечьями близко к вертикали.",
      "Выжимай гантели вверх без столкновения.",
      "Сохраняй рёбра собранными.",
      "Опускай до комфортной глубины."
    ],
    avoid: ["Не прогибайся в пояснице.", "Не опускай локти слишком далеко назад.", "Не выполняй через резкую боль в плече."],
    contraindication: "При импинджмент-подобной боли замени на жим под углом или лэндмайн-жим.",
    alternative: "Жим одной рукой в тренажёре"
  },
  lateral_raise: {
    id: "lateral_raise",
    name: "Разведение гантелей в стороны",
    muscle: "Средняя дельта",
    muscleGroups: ["Средняя дельта", "Передняя дельта", "Трапеции"],
    equipment: ["dumbbells", "home", "gym"],
    pattern: "push",
    unit: "кг",
    defaultReps: "12–15",
    rest: 60,
    cues: [
      "Встань устойчиво, гантели держи перед бёдрами.",
      "Слегка согни локти и зафиксируй корпус.",
      "Поднимай руки в стороны до уровня плеч.",
      "Сохраняй локти немного выше кистей.",
      "Опускай вес медленно без раскачки."
    ],
    avoid: ["Не поднимай руки сильно выше плеч.", "Не раскачивай корпус.", "Не используй слишком тяжёлый вес."],
    contraindication: "При боли в плече сократи амплитуду или замени упражнение.",
    alternative: "Разведение в тренажёре"
  },
  dead_bug: {
    id: "dead_bug",
    name: "Dead bug",
    muscle: "Кор и контроль таза",
    muscleGroups: ["Прямая мышца живота", "Поперечная мышца живота", "Стабилизаторы таза"],
    equipment: ["bodyweight", "home", "gym"],
    pattern: "core",
    unit: "повт.",
    defaultReps: "6–10/сторона",
    rest: 60,
    cues: [
      "Ляг на спину и подними руки и ноги в исходное положение.",
      "Слегка прижми поясницу к полу.",
      "Медленно разгибай противоположные руку и ногу.",
      "Выдыхай в самой длинной позиции.",
      "Вернись и повтори на другую сторону."
    ],
    avoid: ["Не ускоряй движение.", "Не задерживай дыхание.", "Не теряй положение таза."],
    contraindication: "При боли в пояснице оставь только движения руками или ногами.",
    alternative: "Планка на высокой опоре"
  },
  plank: {
    id: "plank",
    name: "Планка",
    muscle: "Кор и стабилизация",
    muscleGroups: ["Кор", "Ягодичные", "Плечевой пояс"],
    equipment: ["bodyweight", "home", "gym"],
    pattern: "core",
    unit: "сек.",
    defaultReps: "20–45 сек.",
    rest: 60,
    cues: [
      "Поставь предплечья под плечами.",
      "Вытяни тело в одну линию.",
      "Напряги ягодицы и живот.",
      "Толкай пол предплечьями.",
      "Дыши спокойно и закончи подход до потери формы."
    ],
    avoid: ["Не проваливай поясницу.", "Не поднимай таз слишком высоко.", "Не продолжай после потери формы."],
    contraindication: "При боли в плече выполняй на высокой опоре.",
    alternative: "Планка от скамьи"
  }
};


const exerciseMetadata = {
  goblet_squat: { movementPattern: "squat", primaryMuscle: "Квадрицепсы", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"]], progression: "Увеличивай повторения до верхней границы, затем вес.", regression: "Присед к опоре без веса" },
  romanian_deadlift: { movementPattern: "hip_hinge", primaryMuscle: "Бицепс бедра", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"], ["barbell"]], progression: "Сначала доведи все подходы до верхней границы повторений, затем добавь небольшой вес.", regression: "Ягодичный мост" },
  incline_pushup: { movementPattern: "horizontal_push", primaryMuscle: "Грудные", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"]], progression: "Снижай высоту опоры или добавляй повторения при стабильной технике.", regression: "Более высокая опора" },
  lat_pulldown: { movementPattern: "vertical_pull", primaryMuscle: "Широчайшие", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["cable"], ["machine"]], progression: "Доведи подходы до верхней границы повторений без раскачки, затем добавь вес.", regression: "Тяга резинки сверху", visualReady: false },
  glute_bridge: { movementPattern: "hip_extension", primaryMuscle: "Ягодичные", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"]], progression: "Добавляй повторения, паузу вверху или внешний вес.", regression: "Мост с меньшей амплитудой" },
  hip_thrust: { movementPattern: "hip_extension", primaryMuscle: "Ягодичные", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"], ["barbell"]], progression: "Доведи все подходы до верхней границы повторений при RPE ≤ 8, затем добавь вес.", regression: "Ягодичный мост" },
  reverse_lunge: { movementPattern: "unilateral_knee_dominant", primaryMuscle: "Ягодичные", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Сначала повторения и контроль, затем гантели.", regression: "Сплит-присед с опорой" },
  split_squat: { movementPattern: "unilateral_knee_dominant", primaryMuscle: "Квадрицепсы", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Увеличивай повторения, затем нагрузку или амплитуду.", regression: "Сплит-присед с опорой рукой" },
  step_up: { movementPattern: "unilateral_knee_dominant", primaryMuscle: "Квадрицепсы", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Добавляй повторения, затем небольшой вес без увеличения высоты ценой техники.", regression: "Низкая платформа" },
  calf_raise: { movementPattern: "plantar_flexion", primaryMuscle: "Икроножные", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Сначала полная амплитуда и повторения, затем нагрузка.", regression: "Двусторонние подъёмы с опорой" },
  leg_abduction: { movementPattern: "hip_abduction", primaryMuscle: "Средняя ягодичная", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["machine"]], progression: "Добавляй повторения без раскачки, затем минимальный шаг веса.", regression: "Отведение ноги лёжа на боку", visualReady: false },
  back_extension: { movementPattern: "hip_hinge", primaryMuscle: "Ягодичные", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["machine"]], progression: "Сначала амплитуда и контроль таза, затем внешний вес.", regression: "Ягодичный мост", visualReady: false },
  dumbbell_row: { movementPattern: "horizontal_pull", primaryMuscle: "Широчайшие", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"]], progression: "Добавляй повторения при неподвижном корпусе, затем вес.", regression: "Тяга одной рукой с дополнительной опорой" },
  face_pull: { movementPattern: "scapular_pull", primaryMuscle: "Задняя дельта", difficulty: "beginner", laterality: "bilateral", exerciseType: "accessory", requiredEquipmentOptions: [["cable"]], progression: "Увеличивай повторения и контроль лопаток до добавления веса.", regression: "Лёгкая тяга к лицу" },
  rear_delt_fly: { movementPattern: "horizontal_abduction", primaryMuscle: "Задняя дельта", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["dumbbells"]], progression: "Добавляй повторения без инерции, затем минимальный шаг веса.", regression: "Меньший вес и амплитуда" },
  shoulder_press: { movementPattern: "vertical_push", primaryMuscle: "Передняя дельта", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"]], progression: "Доведи все подходы до верхней границы повторений без прогиба, затем вес.", regression: "Жим одной рукой с лёгким весом", visualReady: false },
  lateral_raise: { movementPattern: "shoulder_abduction", primaryMuscle: "Средняя дельта", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["dumbbells"]], progression: "Добавляй повторения до верхней границы, затем самый малый шаг веса.", regression: "Меньший вес и частичная амплитуда без боли" },
  dead_bug: { movementPattern: "anti_extension", primaryMuscle: "Кор", difficulty: "beginner", laterality: "contralateral", exerciseType: "core", requiredEquipmentOptions: [["bodyweight"]], progression: "Удлиняй рычаг и паузу только пока поясница остаётся стабильной.", regression: "Двигай только руками или только ногами" },
  plank: { movementPattern: "anti_extension", primaryMuscle: "Кор", difficulty: "beginner", laterality: "bilateral", exerciseType: "core", requiredEquipmentOptions: [["bodyweight"]], progression: "Увеличивай время до верхней границы, затем усложняй вариант.", regression: "Планка от высокой опоры" }
};

for (const exercise of Object.values(exercises)) {
  const metadata = exerciseMetadata[exercise.id] || {};
  Object.assign(exercise, {
    movementPattern: metadata.movementPattern || exercise.pattern,
    primaryMuscle: metadata.primaryMuscle || exercise.muscleGroups?.[0] || exercise.muscle,
    secondaryMuscles: (exercise.muscleGroups || []).filter((muscle) => muscle !== metadata.primaryMuscle),
    difficulty: metadata.difficulty || "beginner",
    laterality: metadata.laterality || "bilateral",
    exerciseType: metadata.exerciseType || "accessory",
    requiredEquipmentOptions: metadata.requiredEquipmentOptions || [["bodyweight"]],
    recommendedSetRange: metadata.exerciseType === "isolation" ? [2, 4] : [2, 5],
    recommendedRpeRange: [6, 9],
    progression: metadata.progression || "Сначала качество и повторения, затем нагрузка.",
    regression: metadata.regression || exercise.alternative,
    visualReady: metadata.visualReady !== false,
    visual: metadata.visualReady === false ? null : `/assets/exercises/${exercise.id}.webp`,
    productionReady: metadata.visualReady !== false
  });
}

export const exerciseList = Object.values(exercises);
