const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

export async function fetchDailySmackTalk({ metric, leader, standings, userAhead }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("Missing VITE_GEMINI_API_KEY");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  const standingLines = standings.map((s) => `${s.rank}. ${s.name}: ${s.score}`).join("\n");
  const prompt = [
    `Metric: ${metric.name} (${metric.unit})`,
    `Leaderboard:\n${standingLines}`,
    userAhead ? "User leads all ghosts." : `Leader: ${leader.name}.`,
    "Write 1-3 sentences in-character smack talk or hype. No markdown.",
  ].join("\n\n");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 180 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim() || "The ghosts are quiet.";
}
