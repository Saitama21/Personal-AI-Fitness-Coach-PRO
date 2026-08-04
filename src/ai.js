const OPENAI_URL = "https://api.openai.com/v1/responses";

function localCoachReply(message, context = {}) {
  const text = String(message || "").toLowerCase();
  if (/бол|прострел|онем|головокруж|тошнот|дыхани/.test(text)) {
    return {
      provider: "local",
      text: "Не продолжай упражнение через острую или необычную боль. Останови нагрузку, отметь место и характер симптома. Для подбора безопасной замены нужны упражнение, момент появления боли и её интенсивность по шкале 0–10. При сильной, нарастающей боли, онемении, головокружении или затруднённом дыхании нужна медицинская оценка."
    };
  }
  if (/увелич|вес|прогресс/.test(text)) {
    return {
      provider: "local",
      text: "Повышай рабочий вес после двух уверенных тренировок подряд: все подходы выполнены в верхней части диапазона, техника стабильна, субъективная тяжесть не выше 7–8 из 10. Для верхней части тела обычно достаточно шага 1–2 кг, для ног — 2–5 кг."
    };
  }
  if (/замен|занят тренаж|нет оборудования/.test(text)) {
    return {
      provider: "local",
      text: "Подбирай замену по движению, а не только по мышце: присед заменяется приседом или шагом, горизонтальная тяга — другой горизонтальной тягой, жим — жимом с комфортной траекторией. Напиши название упражнения и доступное оборудование — предложу точную замену."
    };
  }
  return {
    provider: "local",
    text: `Ориентир на сегодня: тренируйся с запасом 2–3 повторения, не жертвуй техникой ради цифры и запиши фактический вес, повторения и тяжесть подходов. ${context?.profile?.name ? `${context.profile.name}, ` : ""}по этим данным план скорректируется точнее.`
  };
}

function extractOutputText(response) {
  if (typeof response?.output_text === "string") return response.output_text.trim();
  const parts = [];
  for (const item of response?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

export async function coachReply({ message, context = {} }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return localCoachReply(message, context);

  const model = process.env.OPENAI_MODEL || "gpt-5-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        store: false,
        instructions: [
          "Ты осторожный русскоязычный фитнес-тренер внутри мобильного приложения.",
          "Давай конкретные, краткие и применимые рекомендации по тренировке.",
          "Не ставь диагнозы и не обещай медицинский результат.",
          "При острой боли, онемении, головокружении, проблемах с дыханием или иных тревожных симптомах рекомендуй прекратить нагрузку и обратиться за медицинской оценкой.",
          "Учитывай профиль и последнюю тренировку, но не придумывай отсутствующие данные."
        ].join(" "),
        input: JSON.stringify({ message, context })
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI response error", response.status, detail.slice(0, 500));
      return localCoachReply(message, context);
    }

    const data = await response.json();
    const text = extractOutputText(data);
    return text ? { provider: "openai", model, text } : localCoachReply(message, context);
  } catch (error) {
    console.error("OpenAI request failed", error?.message || error);
    return localCoachReply(message, context);
  } finally {
    clearTimeout(timeout);
  }
}
