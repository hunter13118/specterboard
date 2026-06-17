export async function renderShareCardPng({ metric, standings, streak, smackTalk, dateKey }) {
  const W = 1080;
  const H = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b0f1a");
  bg.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 52px system-ui";
  ctx.fillText("SpecterBoard", 64, 90);
  ctx.font = "28px system-ui";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`${metric.name} · ${dateKey}`, 64, 140);
  ctx.fillStyle = "#f97316";
  ctx.font = "bold 36px system-ui";
  ctx.fillText(`🔥 ${streak} day streak`, 64, 190);
  let y = 280;
  for (const row of standings.ranked) {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 32px system-ui";
    ctx.fillText(`#${row.rank} ${row.name} — ${row.score}`, 64, y);
    y += 56;
  }
  if (smackTalk) {
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "italic 26px system-ui";
    ctx.fillText(smackTalk.slice(0, 120), 64, y + 40, W - 128);
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG failed"))), "image/png");
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
