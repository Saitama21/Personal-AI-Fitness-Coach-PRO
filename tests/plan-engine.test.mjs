import test from "node:test";
import assert from "node:assert/strict";
import { generatePlan, analyzeWorkout } from "../src/plan-engine.js";

test("generates a mobile-ready weekly plan", () => {
  const plan = generatePlan({ age: 30, height: 180, weight: 82, goal: "strength", level: "beginner", daysPerWeek: 3, duration: 45, equipment: ["gym"] });
  assert.equal(plan.workouts.length, 3);
  assert.ok(plan.workouts.every((workout) => workout.exercises.length >= 4));
  assert.ok(plan.workouts[0].exercises[0].suggestedWeight >= 2);
});

test("progresses load after an easy complete workout", () => {
  const analysis = analyzeWorkout({
    readiness: { sleep: 8, energy: 8, mood: 8 },
    entries: [
      { exerciseId: "goblet_squat", name: "Гоблет-присед", weight: 20, unit: "кг", pattern: "squat", completed: true, rpe: 7, pain: 0 },
      { exerciseId: "dumbbell_row", name: "Тяга", weight: 12, unit: "кг", pattern: "pull", completed: true, rpe: 7, pain: 0 }
    ]
  });
  assert.equal(analysis.state, "progress");
  assert.ok(analysis.recommendations[0].nextWeight > 20);
});

test("reduces load when pain is reported", () => {
  const analysis = analyzeWorkout({ entries: [{ exerciseId: "x", name: "Тест", weight: 20, unit: "кг", completed: true, rpe: 8, pain: 7 }] });
  assert.equal(analysis.state, "reduce");
  assert.match(analysis.safety, /прекратить/i);
});
