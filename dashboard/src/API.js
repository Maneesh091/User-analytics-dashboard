// Backend ka base URL .env se aata hai (VITE_API_URL)
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
 
// Ek chhota helper: path do, JSON wapas lo. Error aaye to throw karo.
export async function getJSON(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}