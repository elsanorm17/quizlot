const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getStudySets() {
  const response = await fetch(`${API_BASE}/api/sets`);
  if (!response.ok) throw new Error("Could not load study sets");
  return response.json();
}
