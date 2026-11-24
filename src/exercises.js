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
  incline_pushup: { movementPattern: "horizontal_push", primaryMuscle: "Грудные", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"]], progression: "Снижай высоту опоры или добавляй повторения при стабильной технике.", regression: "Более высокая опора", visualReady: false, visualIssue: "source_movement_mismatch_and_subject_cropped" },
  lat_pulldown: { movementPattern: "vertical_pull", primaryMuscle: "Широчайшие", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["cable"], ["machine"]], progression: "Доведи подходы до верхней границы повторений без раскачки, затем добавь вес.", regression: "Тяга резинки сверху", visualReady: false, visualIssue: "source_movement_mismatch" },
  glute_bridge: { movementPattern: "hip_extension", primaryMuscle: "Ягодичные", difficulty: "beginner", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"]], progression: "Добавляй повторения, паузу вверху или внешний вес.", regression: "Мост с меньшей амплитудой" },
  hip_thrust: { movementPattern: "hip_extension", primaryMuscle: "Ягодичные", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"], ["barbell"]], progression: "Доведи все подходы до верхней границы повторений при RPE ≤ 8, затем добавь вес.", regression: "Ягодичный мост" },
  reverse_lunge: { movementPattern: "unilateral_knee_dominant", primaryMuscle: "Ягодичные", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Сначала повторения и контроль, затем гантели.", regression: "Сплит-присед с опорой", visualReady: false, visualIssue: "source_movement_mismatch" },
  split_squat: { movementPattern: "unilateral_knee_dominant", primaryMuscle: "Квадрицепсы", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Увеличивай повторения, затем нагрузку или амплитуду.", regression: "Сплит-присед с опорой рукой", visualReady: false, visualIssue: "source_subject_cropped" },
  step_up: { movementPattern: "unilateral_knee_dominant", primaryMuscle: "Квадрицепсы", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Добавляй повторения, затем небольшой вес без увеличения высоты ценой техники.", regression: "Низкая платформа" },
  calf_raise: { movementPattern: "plantar_flexion", primaryMuscle: "Икроножные", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["bodyweight"], ["dumbbells"]], progression: "Сначала полная амплитуда и повторения, затем нагрузка.", regression: "Двусторонние подъёмы с опорой" },
  leg_abduction: { movementPattern: "hip_abduction", primaryMuscle: "Средняя ягодичная", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["machine"]], progression: "Добавляй повторения без раскачки, затем минимальный шаг веса.", regression: "Отведение ноги лёжа на боку", visualReady: false, visualIssue: "source_movement_mismatch_and_low_detail" },
  back_extension: { movementPattern: "hip_hinge", primaryMuscle: "Ягодичные", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["machine"]], progression: "Сначала амплитуда и контроль таза, затем внешний вес.", regression: "Ягодичный мост", visualReady: false, visualIssue: "source_movement_mismatch" },
  dumbbell_row: { movementPattern: "horizontal_pull", primaryMuscle: "Широчайшие", difficulty: "beginner", laterality: "unilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"]], progression: "Добавляй повторения при неподвижном корпусе, затем вес.", regression: "Тяга одной рукой с дополнительной опорой" },
  face_pull: { movementPattern: "scapular_pull", primaryMuscle: "Задняя дельта", difficulty: "beginner", laterality: "bilateral", exerciseType: "accessory", requiredEquipmentOptions: [["cable"]], progression: "Увеличивай повторения и контроль лопаток до добавления веса.", regression: "Лёгкая тяга к лицу" },
  rear_delt_fly: { movementPattern: "horizontal_abduction", primaryMuscle: "Задняя дельта", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["dumbbells"]], progression: "Добавляй повторения без инерции, затем минимальный шаг веса.", regression: "Меньший вес и амплитуда" },
  shoulder_press: { movementPattern: "vertical_push", primaryMuscle: "Передняя дельта", difficulty: "intermediate", laterality: "bilateral", exerciseType: "compound", requiredEquipmentOptions: [["dumbbells"]], progression: "Доведи все подходы до верхней границы повторений без прогиба, затем вес.", regression: "Жим одной рукой с лёгким весом", visualReady: false, visualIssue: "source_movement_mismatch" },
  lateral_raise: { movementPattern: "shoulder_abduction", primaryMuscle: "Средняя дельта", difficulty: "beginner", laterality: "bilateral", exerciseType: "isolation", requiredEquipmentOptions: [["dumbbells"]], progression: "Добавляй повторения до верхней границы, затем самый малый шаг веса.", regression: "Меньший вес и частичная амплитуда без боли" },
  dead_bug: { movementPattern: "anti_extension", primaryMuscle: "Кор", difficulty: "beginner", laterality: "contralateral", exerciseType: "core", requiredEquipmentOptions: [["bodyweight"]], progression: "Удлиняй рычаг и паузу только пока поясница остаётся стабильной.", regression: "Двигай только руками или только ногами" },
  plank: { movementPattern: "anti_extension", primaryMuscle: "Кор", difficulty: "beginner", laterality: "bilateral", exerciseType: "core", requiredEquipmentOptions: [["bodyweight"]], progression: "Увеличивай время до верхней границы, затем усложняй вариант.", regression: "Планка от высокой опоры" }
};

// Expanded catalog; illustrations pending visual QA.
Object.assign(exercises, {
  "pushup": {
    "id": "pushup",
    "name": "Отжимания от пола",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Трицепс"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Держи тело прямым",
      "Опускай грудь между ладонями",
      "Выжимайся без прогиба"
    ],
    "avoid": [
      "Провисание таза",
      "Локти строго в стороны"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Отжимания от опоры"
  },
  "floor_press": {
    "id": "floor_press",
    "name": "Жим гантелей на полу",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Трицепс"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Ляг на спину, согни ноги",
      "Опускай локти до касания пола",
      "Выжимай над грудью"
    ],
    "avoid": [
      "Удары локтями о пол",
      "Прогиб поясницы"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Отжимания от опоры"
  },
  "machine_chest_press": {
    "id": "machine_chest_press",
    "name": "Жим от груди в тренажёре",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Трицепс"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Настрой сиденье на уровень груди",
      "Прижми спину",
      "Выжимай плавно"
    ],
    "avoid": [
      "Подъём плеч",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Жим гантелей на полу"
  },
  "cable_chest_press": {
    "id": "cable_chest_press",
    "name": "Жим на блоках стоя",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Трицепс"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Встань в разножку",
      "Держи рукояти у груди",
      "Выжимай без разворота корпуса"
    ],
    "avoid": [
      "Прогиб спины",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Отжимания от опоры"
  },
  "pec_deck": {
    "id": "pec_deck",
    "name": "Сведение рук в тренажёре",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "chest_adduction",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Настрой сиденье",
      "Своди руки перед грудью",
      "Возвращай плавно"
    ],
    "avoid": [
      "Чрезмерное растяжение",
      "Подъём плеч"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Жим от груди"
  },
  "cable_fly": {
    "id": "cable_fly",
    "name": "Сведение рук на блоках",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "chest_adduction",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Слегка согни локти",
      "Своди руки дугой",
      "Медленно возвращай"
    ],
    "avoid": [
      "Изменение угла локтей",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Сведение в тренажёре"
  },
  "seated_cable_row": {
    "id": "seated_cable_row",
    "name": "Горизонтальная тяга блока",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Ромбовидные"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Сядь устойчиво",
      "Тяни рукоять к животу",
      "Выпрямляй руки без раскачки"
    ],
    "avoid": [
      "Рывки корпусом",
      "Округление спины"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Тяга гантели"
  },
  "machine_row": {
    "id": "machine_row",
    "name": "Тяга с опорой грудью",
    "muscle": "Ромбовидные",
    "muscleGroups": [
      "Ромбовидные",
      "Широчайшие"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Настрой опору грудью",
      "Тяни локти назад",
      "Возвращай плавно"
    ],
    "avoid": [
      "Отрыв груди",
      "Подъём плеч"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Горизонтальная тяга блока"
  },
  "barbell_row": {
    "id": "barbell_row",
    "name": "Тяга штанги в наклоне",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Ромбовидные"
    ],
    "equipment": [
      "barbell",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Отведи таз назад",
      "Держи спину нейтрально",
      "Тяни штангу к животу"
    ],
    "avoid": [
      "Рывки",
      "Округление поясницы"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Тяга гантели с опорой"
  },
  "neutral_pulldown": {
    "id": "neutral_pulldown",
    "name": "Верхний блок нейтральным хватом",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Бицепс"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "vertical_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Зафиксируй бёдра",
      "Тяни локти вниз",
      "Плавно выпрямляй руки"
    ],
    "avoid": [
      "Раскачка",
      "Тяга за голову"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Тяга верхнего блока"
  },
  "straight_arm_pulldown": {
    "id": "straight_arm_pulldown",
    "name": "Тяга блока прямыми руками",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Кор"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "shoulder_extension",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Слегка согни локти",
      "Веди рукоять к бёдрам",
      "Возвращай без прогиба"
    ],
    "avoid": [
      "Сгибание локтей",
      "Раскачка"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Тяга верхнего блока"
  },
  "standing_dumbbell_press": {
    "id": "standing_dumbbell_press",
    "name": "Жим гантелей стоя",
    "muscle": "Передняя дельта",
    "muscleGroups": [
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "vertical_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Напряги корпус",
      "Выжимай гантели вверх",
      "Опускай до комфорта"
    ],
    "avoid": [
      "Прогиб поясницы",
      "Толчок ногами"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Жим гантелей сидя"
  },
  "machine_shoulder_press": {
    "id": "machine_shoulder_press",
    "name": "Жим плечами в тренажёре",
    "muscle": "Передняя дельта",
    "muscleGroups": [
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "vertical_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Настрой сиденье",
      "Держи спину на опоре",
      "Выжимай плавно"
    ],
    "avoid": [
      "Подъём плеч",
      "Болезненная амплитуда"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Жим гантелей сидя"
  },
  "cable_lateral_raise": {
    "id": "cable_lateral_raise",
    "name": "Отведение руки на нижнем блоке",
    "muscle": "Средняя дельта",
    "muscleGroups": [
      "Средняя дельта",
      "Трапеции"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "shoulder_abduction",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Встань боком к блоку",
      "Подними руку до плеча",
      "Плавно опусти"
    ],
    "avoid": [
      "Раскачка",
      "Подъём плеча к уху"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Разведение гантелей"
  },
  "reverse_pec_deck": {
    "id": "reverse_pec_deck",
    "name": "Обратные разведения в тренажёре",
    "muscle": "Задняя дельта",
    "muscleGroups": [
      "Задняя дельта",
      "Ромбовидные"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "horizontal_abduction",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Прижми грудь к опоре",
      "Разводи руки",
      "Вернись плавно"
    ],
    "avoid": [
      "Рывки",
      "Чрезмерный отвод назад"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Разведение в наклоне"
  },
  "dumbbell_curl": {
    "id": "dumbbell_curl",
    "name": "Сгибание рук с гантелями",
    "muscle": "Бицепс",
    "muscleGroups": [
      "Бицепс",
      "Предплечья"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "elbow_flexion",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Прижми локти к бокам",
      "Согни руки",
      "Медленно опусти"
    ],
    "avoid": [
      "Движение плечами",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Сгибание на блоке"
  },
  "hammer_curl": {
    "id": "hammer_curl",
    "name": "Молотковые сгибания",
    "muscle": "Бицепс",
    "muscleGroups": [
      "Бицепс",
      "Предплечья"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "elbow_flexion",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Держи ладони друг к другу",
      "Сгибай локти",
      "Опускай без инерции"
    ],
    "avoid": [
      "Раскачка",
      "Залом кистей"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Сгибание с гантелями"
  },
  "barbell_curl": {
    "id": "barbell_curl",
    "name": "Сгибание рук со штангой",
    "muscle": "Бицепс",
    "muscleGroups": [
      "Бицепс",
      "Предплечья"
    ],
    "equipment": [
      "barbell",
      "gym"
    ],
    "pattern": "elbow_flexion",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Держи локти у корпуса",
      "Согни руки",
      "Опускай контролируемо"
    ],
    "avoid": [
      "Раскачка",
      "Разгибание спины"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Сгибание с гантелями"
  },
  "cable_curl": {
    "id": "cable_curl",
    "name": "Сгибание рук на нижнем блоке",
    "muscle": "Бицепс",
    "muscleGroups": [
      "Бицепс",
      "Предплечья"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "elbow_flexion",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Встань устойчиво",
      "Сгибай локти не двигая плечами",
      "Плавно опускай"
    ],
    "avoid": [
      "Рывки",
      "Подъём локтей"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Сгибание с гантелями"
  },
  "triceps_pushdown": {
    "id": "triceps_pushdown",
    "name": "Разгибание рук на блоке",
    "muscle": "Трицепс",
    "muscleGroups": [
      "Трицепс",
      "Предплечья"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "elbow_extension",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Прижми локти к корпусу",
      "Разогни руки вниз",
      "Плавно согни локти"
    ],
    "avoid": [
      "Раскачка",
      "Движение плечами"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Разгибание с гантелью"
  },
  "overhead_triceps_extension": {
    "id": "overhead_triceps_extension",
    "name": "Разгибание с гантелью над головой",
    "muscle": "Трицепс",
    "muscleGroups": [
      "Трицепс",
      "Кор"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "elbow_extension",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Удерживай гантель над головой",
      "Согни локти до комфорта",
      "Выпрями без прогиба"
    ],
    "avoid": [
      "Разведение локтей",
      "Прогиб спины"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Разгибание на блоке"
  },
  "triceps_kickback": {
    "id": "triceps_kickback",
    "name": "Разгибание руки в наклоне",
    "muscle": "Трицепс",
    "muscleGroups": [
      "Трицепс",
      "Предплечья"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "elbow_extension",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Зафиксируй корпус с опорой",
      "Держи плечо вдоль туловища",
      "Разгибай локоть плавно"
    ],
    "avoid": [
      "Мах плечом",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Разгибание на блоке"
  },
  "close_grip_pushup": {
    "id": "close_grip_pushup",
    "name": "Отжимания узким хватом",
    "muscle": "Трицепс",
    "muscleGroups": [
      "Трицепс",
      "Грудные"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Поставь ладони под плечами",
      "Опускайся с локтями ближе к корпусу",
      "Выжимайся с прямым телом"
    ],
    "avoid": [
      "Провисание таза",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Отжимания от опоры"
  },
  "side_plank": {
    "id": "side_plank",
    "name": "Боковая планка",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор",
      "Средняя ягодичная"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "anti_lateral_flexion",
    "unit": "сек.",
    "defaultReps": "20–40",
    "rest": 60,
    "cues": [
      "Упрись предплечьем под плечом",
      "Подними таз",
      "Дыши и удерживай прямую линию"
    ],
    "avoid": [
      "Провисание таза",
      "Задержка дыхания"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Боковая планка с колен"
  },
  "bird_dog": {
    "id": "bird_dog",
    "name": "Разноимённое вытяжение на четвереньках",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор",
      "Ягодичные"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "anti_extension",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Встань на четвереньки",
      "Вытяни противоположные руку и ногу",
      "Вернись без разворота таза"
    ],
    "avoid": [
      "Прогиб спины",
      "Подъём ноги слишком высоко"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Мёртвый жук"
  },
  "reverse_crunch": {
    "id": "reverse_crunch",
    "name": "Обратные скручивания",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор",
      "Прямая мышца живота"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "trunk_flexion",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Ляг на спину",
      "Подкрути таз к рёбрам",
      "Опускай таз медленно"
    ],
    "avoid": [
      "Мах ногами",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Мёртвый жук"
  },
  "crunch": {
    "id": "crunch",
    "name": "Скручивания лёжа",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор",
      "Прямая мышца живота"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "trunk_flexion",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Согни колени",
      "Подними лопатки на выдохе",
      "Медленно опустись"
    ],
    "avoid": [
      "Тяга за шею",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Мёртвый жук"
  },
  "pallof_press": {
    "id": "pallof_press",
    "name": "Жим Палофа",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор",
      "Косые мышцы живота"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "anti_rotation",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Встань боком к блоку",
      "Выжми рукоять перед грудью",
      "Удерживай таз без поворота"
    ],
    "avoid": [
      "Разворот корпуса",
      "Задержка дыхания"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Боковая планка"
  },
  "bodyweight_squat": {
    "id": "bodyweight_squat",
    "name": "Приседания без веса",
    "muscle": "Квадрицепсы",
    "muscleGroups": [
      "Квадрицепсы",
      "Ягодичные"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "squat",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Стой на всей стопе",
      "Согни колени и таз",
      "Встань без завала коленей"
    ],
    "avoid": [
      "Отрыв пяток",
      "Завал коленей"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Присед к опоре"
  },
  "leg_press": {
    "id": "leg_press",
    "name": "Жим ногами",
    "muscle": "Квадрицепсы",
    "muscleGroups": [
      "Квадрицепсы",
      "Ягодичные"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "squat",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Прижми таз к сиденью",
      "Опускай платформу до комфорта",
      "Выжимай плавно"
    ],
    "avoid": [
      "Отрыв таза",
      "Резкое выпрямление коленей"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Гоблет-присед"
  },
  "seated_leg_curl": {
    "id": "seated_leg_curl",
    "name": "Сгибание ног сидя",
    "muscle": "Бицепс бедра",
    "muscleGroups": [
      "Бицепс бедра",
      "Икроножные"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "knee_flexion",
    "unit": "кг",
    "defaultReps": "10–15",
    "rest": 60,
    "cues": [
      "Совмести колени с осью тренажёра",
      "Согни ноги",
      "Верни валик плавно"
    ],
    "avoid": [
      "Отрыв таза",
      "Рывки"
    ],
    "contraindication": "При резкой или нарастающей боли прекрати упражнение.",
    "alternative": "Румынская тяга"
  }
});
Object.assign(exerciseMetadata, {
  "pushup": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Отжимания от опоры",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "floor_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Отжимания от опоры",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "machine_chest_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Жим гантелей на полу",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "cable_chest_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Отжимания от опоры",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "pec_deck": {
    "movementPattern": "chest_adduction",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Жим от груди",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "cable_fly": {
    "movementPattern": "chest_adduction",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Сведение в тренажёре",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "seated_cable_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Широчайшие",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Тяга гантели",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "machine_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Ромбовидные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Горизонтальная тяга блока",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "barbell_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Широчайшие",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "barbell"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Тяга гантели с опорой",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "neutral_pulldown": {
    "movementPattern": "vertical_pull",
    "primaryMuscle": "Широчайшие",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Тяга верхнего блока",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "straight_arm_pulldown": {
    "movementPattern": "shoulder_extension",
    "primaryMuscle": "Широчайшие",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Тяга верхнего блока",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "standing_dumbbell_press": {
    "movementPattern": "vertical_push",
    "primaryMuscle": "Передняя дельта",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Жим гантелей сидя",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "machine_shoulder_press": {
    "movementPattern": "vertical_push",
    "primaryMuscle": "Передняя дельта",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Жим гантелей сидя",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "cable_lateral_raise": {
    "movementPattern": "shoulder_abduction",
    "primaryMuscle": "Средняя дельта",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Разведение гантелей",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "reverse_pec_deck": {
    "movementPattern": "horizontal_abduction",
    "primaryMuscle": "Задняя дельта",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Разведение в наклоне",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "dumbbell_curl": {
    "movementPattern": "elbow_flexion",
    "primaryMuscle": "Бицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Сгибание на блоке",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "hammer_curl": {
    "movementPattern": "elbow_flexion",
    "primaryMuscle": "Бицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Сгибание с гантелями",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "barbell_curl": {
    "movementPattern": "elbow_flexion",
    "primaryMuscle": "Бицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "barbell"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Сгибание с гантелями",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "cable_curl": {
    "movementPattern": "elbow_flexion",
    "primaryMuscle": "Бицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Сгибание с гантелями",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "triceps_pushdown": {
    "movementPattern": "elbow_extension",
    "primaryMuscle": "Трицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Разгибание с гантелью",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "overhead_triceps_extension": {
    "movementPattern": "elbow_extension",
    "primaryMuscle": "Трицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Разгибание на блоке",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "triceps_kickback": {
    "movementPattern": "elbow_extension",
    "primaryMuscle": "Трицепс",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Разгибание на блоке",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "close_grip_pushup": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Трицепс",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Отжимания от опоры",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "side_plank": {
    "movementPattern": "anti_lateral_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Боковая планка с колен",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "bird_dog": {
    "movementPattern": "anti_extension",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "contralateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Мёртвый жук",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "reverse_crunch": {
    "movementPattern": "trunk_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Мёртвый жук",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "crunch": {
    "movementPattern": "trunk_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Мёртвый жук",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "pallof_press": {
    "movementPattern": "anti_rotation",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Боковая планка",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "bodyweight_squat": {
    "movementPattern": "squat",
    "primaryMuscle": "Квадрицепсы",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Присед к опоре",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "leg_press": {
    "movementPattern": "squat",
    "primaryMuscle": "Квадрицепсы",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Гоблет-присед",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "seated_leg_curl": {
    "movementPattern": "knee_flexion",
    "primaryMuscle": "Бицепс бедра",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала техника и повторения, затем нагрузка.",
    "regression": "Румынская тяга",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  }
});

Object.assign(exercises, {
  "front_raise": {
    "id": "front_raise",
    "name": "Подъём гантелей перед собой",
    "muscle": "Передняя дельта",
    "muscleGroups": [
      "Передняя дельта",
      "Средняя дельта"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "shoulder_flexion",
    "unit": "кг",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Стой устойчиво.",
      "поднимай гантели перед собой до уровня плеч.",
      "опускай медленно."
    ],
    "avoid": [
      "Не раскачивай корпус.",
      "не поднимай плечи к ушам."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим гантелей"
  },
  "arnold_press": {
    "id": "arnold_press",
    "name": "Жим Арнольда",
    "muscle": "Передняя дельта",
    "muscleGroups": [
      "Передняя дельта",
      "Трицепс",
      "Средняя дельта"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "vertical_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Начни с гантелей перед плечами.",
      "плавно разверни ладони и выжми вверх.",
      "вернись по той же траектории."
    ],
    "avoid": [
      "Не форсируй поворот плеча.",
      "не прогибай поясницу."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим гантелей"
  },
  "single_arm_dumbbell_press": {
    "id": "single_arm_dumbbell_press",
    "name": "Жим одной гантели стоя",
    "muscle": "Передняя дельта",
    "muscleGroups": [
      "Передняя дельта",
      "Трицепс",
      "Средняя дельта"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "vertical_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Держи гантель у плеча.",
      "напряги кор.",
      "выжми вверх без наклона корпуса."
    ],
    "avoid": [
      "Не отклоняйся вбок.",
      "не выпячивай рёбра."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим двумя гантелями"
  },
  "upright_row": {
    "id": "upright_row",
    "name": "Тяга гантелей к нижней части груди",
    "muscle": "Средняя дельта",
    "muscleGroups": [
      "Средняя дельта",
      "Трапеции"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "shoulder_abduction",
    "unit": "кг",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Держи гантели перед бёдрами широким хватом.",
      "веди локти в стороны до комфортной высоты.",
      "плавно опусти."
    ],
    "avoid": [
      "Не поднимай локти выше плеч.",
      "не работай через боль."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Подъём гантелей в стороны"
  },
  "incline_rear_delt_raise": {
    "id": "incline_rear_delt_raise",
    "name": "Разведение гантелей лёжа грудью на наклонной скамье",
    "muscle": "Задняя дельта",
    "muscleGroups": [
      "Задняя дельта",
      "Ромбовидные"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "horizontal_abduction",
    "unit": "кг",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Ляг грудью на устойчивую наклонную скамью.",
      "разводи слегка согнутые руки в стороны.",
      "плавно опускай."
    ],
    "avoid": [
      "Не разгибай поясницу.",
      "не дёргай гантели."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Разведение гантелей в наклоне"
  },
  "band_pull_apart": {
    "id": "band_pull_apart",
    "name": "Разведение эластичной ленты",
    "muscle": "Задняя дельта",
    "muscleGroups": [
      "Задняя дельта",
      "Ромбовидные"
    ],
    "equipment": [
      "band",
      "home",
      "gym"
    ],
    "pattern": "horizontal_abduction",
    "unit": "повт.",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Держи ленту перед грудью.",
      "разводи руки в стороны до комфортного натяжения.",
      "медленно вернись."
    ],
    "avoid": [
      "Не выгибай спину.",
      "не тяни ленту к лицу."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Разведение гантелей в наклоне"
  },
  "incline_y_raise": {
    "id": "incline_y_raise",
    "name": "Y-подъём рук на наклонной скамье",
    "muscle": "Трапеции",
    "muscleGroups": [
      "Трапеции",
      "Задняя дельта"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "scapular_pull",
    "unit": "кг",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Ляг грудью на скамью.",
      "подними лёгкие гантели по диагонали в форме Y.",
      "опускай подконтрольно."
    ],
    "avoid": [
      "Не пожимай плечами.",
      "не используй большой вес."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Y-подъём без веса"
  },
  "barbell_bench_press": {
    "id": "barbell_bench_press",
    "name": "Жим штанги лёжа",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "barbell",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Используй скамью со страховочными упорами.",
      "опусти гриф к нижней части груди.",
      "выжми без отрыва таза."
    ],
    "avoid": [
      "Не отбивай гриф от груди.",
      "не жми тяжело без страховки."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим гантелей лёжа на полу"
  },
  "dumbbell_bench_press": {
    "id": "dumbbell_bench_press",
    "name": "Жим гантелей лёжа на скамье",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Ляг на устойчивую скамью, стопы на полу.",
      "опускай гантели к бокам груди.",
      "выжимай вверх."
    ],
    "avoid": [
      "Не опускай локти чрезмерно глубоко.",
      "не сталкивай гантели."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим гантелей лёжа на полу"
  },
  "incline_dumbbell_press": {
    "id": "incline_dumbbell_press",
    "name": "Жим гантелей на наклонной скамье",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Установи наклон примерно 15–30°.",
      "опусти гантели к верхней части груди.",
      "выжми вверх."
    ],
    "avoid": [
      "Не поднимай плечи к ушам.",
      "не прогибай поясницу."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим гантелей лёжа"
  },
  "incline_barbell_press": {
    "id": "incline_barbell_press",
    "name": "Жим штанги на наклонной скамье",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "barbell",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Используй наклонную скамью с упорами.",
      "опусти гриф к верхней части груди.",
      "выжми подконтрольно."
    ],
    "avoid": [
      "Не отбивай гриф.",
      "не работай без страховки."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Наклонный жим гантелей"
  },
  "dumbbell_fly": {
    "id": "dumbbell_fly",
    "name": "Разведение гантелей лёжа",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "chest_adduction",
    "unit": "кг",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "На устойчивой скамье держи руки над грудью.",
      "с мягкими локтями разводи их по дуге.",
      "сведи обратно."
    ],
    "avoid": [
      "Не опускай руки глубже комфортной амплитуды.",
      "не выпрямляй локти под нагрузкой."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Сведение рук в тренажёре"
  },
  "knee_pushup": {
    "id": "knee_pushup",
    "name": "Отжимания с колен",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Поставь ладони под плечами или чуть шире.",
      "выстрой линию от головы до колен.",
      "опустись и оттолкнись."
    ],
    "avoid": [
      "Не проваливай поясницу.",
      "не разводи локти под 90°."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Отжимания от опоры"
  },
  "decline_pushup": {
    "id": "decline_pushup",
    "name": "Отжимания с ногами на опоре",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Поставь стопы на низкую устойчивую опору.",
      "держи корпус ровно.",
      "опускай грудь к полу и выжимайся."
    ],
    "avoid": [
      "Не используй шаткую опору.",
      "не прогибай поясницу."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Обычные отжимания"
  },
  "dumbbell_squeeze_press": {
    "id": "dumbbell_squeeze_press",
    "name": "Жим гантелей с приведением лёжа на полу",
    "muscle": "Грудные",
    "muscleGroups": [
      "Грудные",
      "Передняя дельта",
      "Трицепс"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "horizontal_push",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Ляг на пол и соедини гантели над грудью.",
      "удерживай лёгкое давление между ними.",
      "опусти и выжми."
    ],
    "avoid": [
      "Не теряй контроль над гантелями.",
      "не заламывай кисти."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Жим гантелей лёжа на полу"
  },
  "chest_supported_row": {
    "id": "chest_supported_row",
    "name": "Тяга гантелей с опорой грудью",
    "muscle": "Ромбовидные",
    "muscleGroups": [
      "Ромбовидные",
      "Бицепс"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Ляг грудью на наклонную скамью.",
      "подтяни локти к корпусу.",
      "плавно распрями руки."
    ],
    "avoid": [
      "Не отрывай грудь от опоры.",
      "не пожимай плечами."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Тяга гантели одной рукой"
  },
  "single_arm_cable_row": {
    "id": "single_arm_cable_row",
    "name": "Горизонтальная тяга блока одной рукой",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Бицепс",
      "Ромбовидные"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Сядь устойчиво лицом к блоку.",
      "веди локоть назад.",
      "верни рукоять без вращения таза."
    ],
    "avoid": [
      "Не раскачивай корпус.",
      "не дёргай трос."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Горизонтальная тяга блока"
  },
  "underhand_pulldown": {
    "id": "underhand_pulldown",
    "name": "Тяга верхнего блока обратным хватом",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Бицепс"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "vertical_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Возьмись за рукоять ладонями к себе примерно на ширине плеч.",
      "тяни локти вниз.",
      "плавно верни вес."
    ],
    "avoid": [
      "Не тяни за голову.",
      "не раскачивайся."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Тяга верхнего блока нейтральным хватом"
  },
  "wide_grip_seated_row": {
    "id": "wide_grip_seated_row",
    "name": "Горизонтальная тяга блока широким хватом",
    "muscle": "Ромбовидные",
    "muscleGroups": [
      "Ромбовидные",
      "Бицепс"
    ],
    "equipment": [
      "cable",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Сядь с нейтральной спиной.",
      "тяни рукоять к нижней части груди, локти умеренно в стороны.",
      "плавно верни."
    ],
    "avoid": [
      "Не запрокидывай корпус.",
      "не поднимай плечи."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Горизонтальная тяга блока"
  },
  "dumbbell_pullover": {
    "id": "dumbbell_pullover",
    "name": "Пуловер с гантелью",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Грудные"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "shoulder_extension",
    "unit": "кг",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Ляг на устойчивую скамью.",
      "удерживай гантель обеими руками.",
      "опускай за голову до комфортной амплитуды и верни."
    ],
    "avoid": [
      "Не переразгибай поясницу.",
      "не опускай вес через боль."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Тяга прямыми руками"
  },
  "inverted_row": {
    "id": "inverted_row",
    "name": "Горизонтальные подтягивания под перекладиной",
    "muscle": "Широчайшие",
    "muscleGroups": [
      "Широчайшие",
      "Бицепс",
      "Ромбовидные"
    ],
    "equipment": [
      "machine",
      "gym"
    ],
    "pattern": "horizontal_pull",
    "unit": "кг",
    "defaultReps": "8–12",
    "rest": 90,
    "cues": [
      "Используй надёжно закреплённую перекладину.",
      "держи корпус ровно.",
      "подтяни грудь к ней и опустись."
    ],
    "avoid": [
      "Не используй незакреплённый гриф.",
      "не проваливай таз."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Тяга в тренажёре"
  },
  "prone_w_raise": {
    "id": "prone_w_raise",
    "name": "W-подъём рук лёжа на животе",
    "muscle": "Ромбовидные",
    "muscleGroups": [
      "Ромбовидные",
      "Задняя дельта"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "scapular_pull",
    "unit": "повт.",
    "defaultReps": "12–15",
    "rest": 60,
    "cues": [
      "Ляг на живот, локти согнуты в форме W.",
      "слегка приподними руки и сведи лопатки.",
      "вернись."
    ],
    "avoid": [
      "Не запрокидывай голову.",
      "не поднимай грудь за счёт поясницы."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Y-подъём без веса"
  },
  "russian_twist": {
    "id": "russian_twist",
    "name": "Повороты корпуса сидя",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "trunk_rotation",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Сядь со стопами на полу.",
      "слегка отклони корпус с нейтральной спиной.",
      "поворачивай грудную клетку в небольшом диапазоне."
    ],
    "avoid": [
      "Не скручивай поясницу рывком.",
      "не гонись за амплитудой."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Мёртвый жук"
  },
  "mountain_climber": {
    "id": "mountain_climber",
    "name": "Альпинист",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "anti_extension",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Прими упор лёжа.",
      "поочерёдно подтягивай колени под корпус.",
      "удерживай таз стабильным."
    ],
    "avoid": [
      "Не проваливай поясницу.",
      "не прыгай при потере контроля."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Планка"
  },
  "hanging_knee_raise": {
    "id": "hanging_knee_raise",
    "name": "Подъём коленей в висе",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "pullup_bar",
      "gym"
    ],
    "pattern": "trunk_flexion",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Повисни на надёжной перекладине.",
      "подтягивай согнутые колени, слегка подкручивая таз.",
      "медленно опускай."
    ],
    "avoid": [
      "Не раскачивайся.",
      "не бросай ноги вниз."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Обратные скручивания"
  },
  "hollow_hold": {
    "id": "hollow_hold",
    "name": "Удержание полого корпуса",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "anti_extension",
    "unit": "сек.",
    "defaultReps": "20–40",
    "rest": 60,
    "cues": [
      "Ляг на спину.",
      "мягко прижми поясницу к полу.",
      "удерживай плечи и ноги приподнятыми в доступной амплитуде."
    ],
    "avoid": [
      "Не задерживай дыхание.",
      "не отрывай поясницу."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Мёртвый жук"
  },
  "heel_taps": {
    "id": "heel_taps",
    "name": "Касания пяток лёжа",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "anti_lateral_flexion",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Ляг с согнутыми коленями.",
      "слегка подними плечи.",
      "поочерёдно тянись рукой к пятке небольшим боковым движением."
    ],
    "avoid": [
      "Не тяни голову руками.",
      "не делай рывков."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Боковая планка с колен"
  },
  "plank_shoulder_tap": {
    "id": "plank_shoulder_tap",
    "name": "Планка с касанием плеч",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "anti_rotation",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Встань в упор лёжа, стопы шире таза.",
      "касайся противоположного плеча.",
      "удерживай таз неподвижным."
    ],
    "avoid": [
      "Не поворачивай таз.",
      "не задерживай дыхание."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Планка"
  },
  "suitcase_carry": {
    "id": "suitcase_carry",
    "name": "Переноска гантели в одной руке",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "dumbbells",
      "home",
      "gym"
    ],
    "pattern": "anti_lateral_flexion",
    "unit": "сек.",
    "defaultReps": "20–40",
    "rest": 60,
    "cues": [
      "Возьми гантель одной рукой.",
      "иди короткими контролируемыми шагами.",
      "держи корпус вертикально."
    ],
    "avoid": [
      "Не наклоняйся к грузу.",
      "не задерживай дыхание."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Боковая планка"
  },
  "bicycle_crunch": {
    "id": "bicycle_crunch",
    "name": "Скручивания велосипед",
    "muscle": "Кор",
    "muscleGroups": [
      "Кор"
    ],
    "equipment": [
      "bodyweight",
      "home",
      "gym"
    ],
    "pattern": "trunk_flexion",
    "unit": "повт.",
    "defaultReps": "8–12",
    "rest": 60,
    "cues": [
      "Ляг на спину.",
      "поочерёдно сближай противоположные плечо и колено.",
      "выпрямляй другую ногу в доступной амплитуде."
    ],
    "avoid": [
      "Не тяни шею.",
      "не отрывай поясницу бесконтрольно."
    ],
    "contraindication": "При острой боли, головокружении или ухудшении самочувствия прекрати упражнение. При травме согласуй нагрузку со специалистом.",
    "alternative": "Скручивания"
  }
});
Object.assign(exerciseMetadata, {
  "front_raise": {
    "movementPattern": "shoulder_flexion",
    "primaryMuscle": "Передняя дельта",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим гантелей",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "arnold_press": {
    "movementPattern": "vertical_push",
    "primaryMuscle": "Передняя дельта",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим гантелей",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "single_arm_dumbbell_press": {
    "movementPattern": "vertical_push",
    "primaryMuscle": "Передняя дельта",
    "difficulty": "intermediate",
    "laterality": "unilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим двумя гантелями",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "upright_row": {
    "movementPattern": "shoulder_abduction",
    "primaryMuscle": "Средняя дельта",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "accessory",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Подъём гантелей в стороны",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "incline_rear_delt_raise": {
    "movementPattern": "horizontal_abduction",
    "primaryMuscle": "Задняя дельта",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Разведение гантелей в наклоне",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "band_pull_apart": {
    "movementPattern": "horizontal_abduction",
    "primaryMuscle": "Задняя дельта",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "band"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Разведение гантелей в наклоне",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "incline_y_raise": {
    "movementPattern": "scapular_pull",
    "primaryMuscle": "Трапеции",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "accessory",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Y-подъём без веса",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "barbell_bench_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "barbell"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим гантелей лёжа на полу",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "dumbbell_bench_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим гантелей лёжа на полу",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "incline_dumbbell_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим гантелей лёжа",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "incline_barbell_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "barbell"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Наклонный жим гантелей",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "dumbbell_fly": {
    "movementPattern": "chest_adduction",
    "primaryMuscle": "Грудные",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "isolation",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Сведение рук в тренажёре",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "knee_pushup": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Отжимания от опоры",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "decline_pushup": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Обычные отжимания",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "dumbbell_squeeze_press": {
    "movementPattern": "horizontal_push",
    "primaryMuscle": "Грудные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Жим гантелей лёжа на полу",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "chest_supported_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Ромбовидные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Тяга гантели одной рукой",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "single_arm_cable_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Широчайшие",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Горизонтальная тяга блока",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "underhand_pulldown": {
    "movementPattern": "vertical_pull",
    "primaryMuscle": "Широчайшие",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Тяга верхнего блока нейтральным хватом",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "wide_grip_seated_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Ромбовидные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "cable"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Горизонтальная тяга блока",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "dumbbell_pullover": {
    "movementPattern": "shoulder_extension",
    "primaryMuscle": "Широчайшие",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "accessory",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Тяга прямыми руками",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "inverted_row": {
    "movementPattern": "horizontal_pull",
    "primaryMuscle": "Широчайшие",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "compound",
    "requiredEquipmentOptions": [
      [
        "machine"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Тяга в тренажёре",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "prone_w_raise": {
    "movementPattern": "scapular_pull",
    "primaryMuscle": "Ромбовидные",
    "difficulty": "beginner",
    "laterality": "bilateral",
    "exerciseType": "accessory",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Y-подъём без веса",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "russian_twist": {
    "movementPattern": "trunk_rotation",
    "primaryMuscle": "Кор",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Мёртвый жук",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "mountain_climber": {
    "movementPattern": "anti_extension",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "contralateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Планка",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "hanging_knee_raise": {
    "movementPattern": "trunk_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "pullup_bar"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Обратные скручивания",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "hollow_hold": {
    "movementPattern": "anti_extension",
    "primaryMuscle": "Кор",
    "difficulty": "intermediate",
    "laterality": "bilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Мёртвый жук",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "heel_taps": {
    "movementPattern": "anti_lateral_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Боковая планка с колен",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "plank_shoulder_tap": {
    "movementPattern": "anti_rotation",
    "primaryMuscle": "Кор",
    "difficulty": "intermediate",
    "laterality": "contralateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Планка",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "suitcase_carry": {
    "movementPattern": "anti_lateral_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "beginner",
    "laterality": "unilateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "dumbbells"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Боковая планка",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  },
  "bicycle_crunch": {
    "movementPattern": "trunk_flexion",
    "primaryMuscle": "Кор",
    "difficulty": "intermediate",
    "laterality": "contralateral",
    "exerciseType": "core",
    "requiredEquipmentOptions": [
      [
        "bodyweight"
      ]
    ],
    "progression": "Сначала устойчивое выполнение и повторения, затем небольшое увеличение нагрузки.",
    "regression": "Скручивания",
    "visualReady": false,
    "visualIssue": "illustration_pending"
  }
});

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
    visualIssue: metadata.visualIssue || null,
    visual: metadata.visualReady === false ? null : `/assets/exercises/${exercise.id}.webp`,
    productionReady: metadata.productionReady !== false
  });
}

export const exerciseList = Object.values(exercises);
