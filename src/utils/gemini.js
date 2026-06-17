import { apiUrl, getGeminiAuthHeaders } from "../lib/geminiCapability.js";

export async function fetchDailySmackTalk({ metric, leader, standings, userAhead }) {
  const headers = await getGeminiAuthHeaders();
  if (!headers) {
    throw new Error("Connect a Gemini API key or sign in with trusted-user access.");
  }

  const res = await fetch(apiUrl("/smack-talk"), {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ metric, leader, standings, userAhead }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.hint || data.detail || data.error || `Gemini ${res.status}`);
  }
  return data.text || "The ghosts are quiet.";
}
