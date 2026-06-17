const KEY = "specterboard_v1";

export const DEFAULT_STATE = {
  metric: { name: "Activity", unit: "count" },
  logs: {},
  customGhost: { name: "Rival", dailyPace: 2 },
  smackTalk: null,
  onboarded: false,
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function incrementToday(state, dateKey) {
  const logs = { ...state.logs };
  logs[dateKey] = (logs[dateKey] || 0) + 1;
  return { ...state, logs };
}
