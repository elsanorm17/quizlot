const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getStudySets() {
  const response = await fetch(`${API_BASE}/api/sets`);
  if (!response.ok) throw new Error("Could not load study sets");
  return response.json();
}

export async function getStudySet(setId) {
  const response = await fetch(`${API_BASE}/api/sets/${setId}`);
  if (!response.ok) throw new Error("Could not load study set");
  return response.json();
}

export async function getFriends(username) {
  const response = await fetch(`${API_BASE}/api/friends?username=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error("Could not load friends");
  return response.json();
}

export async function getLeaderboard(username) {
  const response = await fetch(`${API_BASE}/api/leaderboard?username=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error("Could not load leaderboard");
  return response.json();
}
