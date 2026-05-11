export function extractYouTubeId(input = "") {
  const url = String(input || "").trim();
  if (!url) return null;

  // allow raw IDs
  if (/^[a-zA-Z0-9_-]{6,}$/.test(url) && !url.includes("/")) return url;

  const m = url.match(/(?:embed\/|v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
}

export function toYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function toYouTubeWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

