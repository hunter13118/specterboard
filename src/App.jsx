import { useCallback, useEffect, useMemo, useState } from "react";
import { todayKey } from "./utils/dates.js";
import { buildStandings } from "./utils/ghosts.js";
import { computeStreak } from "./utils/streak.js";
import { loadState, saveState, incrementToday } from "./services/storage.js";
import { fetchDailySmackTalk } from "./utils/gemini.js";
import { renderShareCardPng, downloadBlob } from "./utils/shareCard.js";
import "./App.css";

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [smackLoading, setSmackLoading] = useState(false);
  const [smackError, setSmackError] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const dateKey = todayKey();
  const standings = useMemo(() => buildStandings(state, dateKey), [state, dateKey]);
  const streak = useMemo(() => computeStreak(state.logs, dateKey), [state.logs, dateKey]);
  const userToday = state.logs[dateKey] || 0;

  const persist = useCallback((next) => {
    setState(next);
    saveState(next);
  }, []);

  const ensureSmackTalk = useCallback(async (snap) => {
    if (snap.smackTalk?.date === dateKey) return snap;
    setSmackLoading(true);
    setSmackError("");
    try {
      const st = buildStandings(snap, dateKey);
      const text = await fetchDailySmackTalk({
        metric: snap.metric,
        leader: st.leader,
        standings: st.ranked,
        userAhead: st.userAhead,
      });
      const next = { ...snap, smackTalk: { date: dateKey, leaderName: st.leader.name, text } };
      saveState(next);
      setState(next);
      return next;
    } catch (e) {
      setSmackError(e.message);
      return snap;
    } finally {
      setSmackLoading(false);
    }
  }, [dateKey]);

  useEffect(() => {
    if (state.onboarded && state.smackTalk?.date !== dateKey) ensureSmackTalk(state);
  }, [state.onboarded, state.smackTalk?.date, dateKey, ensureSmackTalk, state]);

  if (!state.onboarded) {
    return (
      <div className="app">
        <header className="hero"><h1>SpecterBoard</h1><p className="sub">Ghost leaderboard</p></header>
        <form className="panel" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          persist({
            ...state,
            onboarded: true,
            metric: { name: fd.get("metricName"), unit: fd.get("metricUnit") },
            customGhost: { name: fd.get("ghostName"), dailyPace: Number(fd.get("ghostPace")) || 2 },
          });
        }}>
          <label className="field"><span>Metric</span><input name="metricName" aria-label="Metric" defaultValue="Climbing sessions" required /></label>
          <label className="field"><span>Unit</span><input name="metricUnit" defaultValue="sessions" aria-label="Unit label" /></label>
          <label className="field"><span>Rival name</span><input name="ghostName" defaultValue="Rival" placeholder="Friend / rival" /></label>
          <label className="field"><span>Rival pace / day</span><input name="ghostPace" type="number" defaultValue={2} step="0.1" /></label>
          <button type="submit" className="primary">Start haunting</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <div><h1>SpecterBoard</h1><p className="sub">{state.metric.name}</p></div>
        <div className="streak" aria-label={`${streak} day streak`}>🔥 {streak}</div>
      </header>
      <section className="panel">
        <p className="muted">Today · {dateKey}</p>
        <div className="log-row">
          <p className="log-count">{userToday}</p>
          <button type="button" className="primary log-btn" aria-label="Log plus one" onClick={() => persist(incrementToday(state, dateKey))}>+1</button>
        </div>
        <button type="button" className="secondary" disabled={shareBusy} onClick={async () => {
          setShareBusy(true);
          try {
            const blob = await renderShareCardPng({ metric: state.metric, standings, streak, smackTalk: state.smackTalk?.text, dateKey });
            downloadBlob(blob, `specterboard-${dateKey}.png`);
          } finally { setShareBusy(false); }
        }}>{shareBusy ? "Rendering…" : "Share card"}</button>
      </section>
      <section className="panel" aria-label="Ghost leaderboard">
        <h2>Leaderboard</h2>
        <ol className="lb-list">
          {standings.ranked.map((r) => (
            <li key={r.id} className={r.isUser ? "is-user" : ""}>#{r.rank} {r.name} <strong>{r.score}</strong></li>
          ))}
        </ol>
      </section>
      <section className="panel" aria-label="Daily smack talk">
        <h2>Daily smack talk</h2>
        {smackLoading && <p className="muted">Composing…</p>}
        {smackError && <p className="error">{smackError}</p>}
        <blockquote>{state.smackTalk?.text || "Log activity to wake the ghosts."}</blockquote>
      </section>
      <footer className="foot">War Council built this — not a runtime dependency.</footer>
    </div>
  );
}
