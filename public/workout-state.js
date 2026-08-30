export function addSetLog(exercise, { maxSets = 10 } = {}) {
  if (!exercise || !Array.isArray(exercise.setLogs)) return { added: false, reason: "invalid_exercise" };
  if (exercise.setLogs.length >= maxSets) return { added: false, reason: "max_sets" };

  const previous = exercise.setLogs.at(-1) || {
    weight: exercise.suggestedWeight || "",
    reps: Number.parseInt(exercise.target, 10) || 10
  };

  exercise.setLogs.push({
    set: exercise.setLogs.length + 1,
    weight: previous.weight,
    reps: previous.reps,
    done: false
  });

  return { added: true, set: exercise.setLogs.at(-1) };
}
