import { lastNDays, todayKey } from "./dates.js";

export function eliteDailyPace(dateKey) {
  const dow = new Date(`${dateKey}T12:00:00`).getDay();
  return [3.2, 4.0, 4.8, 5.2, 4.6, 3.0, 2.4][dow];
}

export function pastYouPace(logs, dateKey = todayKey()) {
  const keys = lastNDays(30, dateKey);
  const total = keys.reduce((sum, k) => sum + (logs[k] || 0), 0);
  return Math.round((total / 30) * 10) / 10;
}

export function buildStandings(state, dateKey) {
  const userCount = state.logs[dateKey] || 0;
  const customPace = Number(state.customGhost?.dailyPace) || 2;
  const rows = [
    { id: "user", name: "You", color: "#22d3ee", score: userCount, isUser: true },
    { id: "past_you", name: "Past-You", color: "#a78bfa", score: pastYouPace(state.logs, dateKey), isGhost: true },
    { id: "elite", name: "Elite 1%", color: "#f59e0b", score: eliteDailyPace(dateKey), isGhost: true },
    { id: "custom", name: state.customGhost?.name || "Rival", color: "#f472b6", score: customPace, isGhost: true },
  ];
  const ranked = [...rows].sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }));
  const leader = ranked[0];
  const userRow = rows[0];
  const aheadGhost = ranked.find((r) => r.isGhost && r.score > userRow.score);
  return { rows, ranked, leader, aheadGhost, userAhead: !aheadGhost };
}
