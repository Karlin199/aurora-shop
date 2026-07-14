export async function getDashboard() {
  const res = await fetch("/api/dashboard");

  if (!res.ok) {
    throw new Error("Failed to load dashboard");
  }

  return res.json();
}