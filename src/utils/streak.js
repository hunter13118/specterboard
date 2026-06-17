import { lastNDays, todayKey } from "./dates.js";

export function computeStreak(logs, fromKey = todayKey()) {
  let streak = 0;
  for (const k of lastNDays(400, fromKey)) {
    if ((logs[k] || 0) > 0) streak += 1;
    else break;
  }
  return streak;
}
