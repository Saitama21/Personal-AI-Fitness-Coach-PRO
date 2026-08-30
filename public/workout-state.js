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

  exercise.sets = exercise.setLogs.length;
  return { added: true, set: exercise.setLogs.at(-1) };
}

export function removeLastSetLog(exercise, { minSets = 1 } = {}) {
  if (!exercise || !Array.isArray(exercise.setLogs)) return { removed: false, reason: "invalid_exercise" };
  if (exercise.setLogs.length <= minSets) return { removed: false, reason: "min_sets" };
  const removed = exercise.setLogs.pop();
  exercise.setLogs.forEach((set, index) => { set.set = index + 1; });
  exercise.sets = exercise.setLogs.length;
  return { removed: true, set: removed };
}
