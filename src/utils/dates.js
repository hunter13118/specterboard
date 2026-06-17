export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function lastNDays(n, fromKey = todayKey()) {
  const end = new Date(`${fromKey}T12:00:00`);
  const keys = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    keys.push(todayKey(d));
  }
  return keys;
}
