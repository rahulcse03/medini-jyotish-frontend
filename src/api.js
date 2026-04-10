const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchAPI(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function getGrahaPositions(format = 'summary') {
  return fetchAPI(`/api/v1/graha/positions?format=${format}`);
}

export function getPanchang(lat = 28.6139, lon = 77.209) {
  return fetchAPI(`/api/v1/panchang/today?lat=${lat}&lon=${lon}`);
}

export function getMediniPredictions(category = null) {
  const q = category ? `?category=${category}` : '';
  return fetchAPI(`/api/v1/medini/predictions${q}`);
}

export function getEclipseAnalysis(count = 6) {
  return fetchAPI(`/api/v1/eclipses/upcoming?count=${count}`);
}

export function getSamvatsaraPhala(year = null) {
  const q = year ? `?year=${year}` : '';
  return fetchAPI(`/api/v1/samvatsara/current${q}`);
}

export function getNationsList() {
  return fetchAPI('/api/v1/kundli/nations');
}

export function getNationKundli(key) {
  return fetchAPI(`/api/v1/kundli/nation/${key}`);
}

export function getMonthlySummary(year, month) {
  return fetchAPI(`/api/v1/medini/monthly/${year}/${month}`);
}

export function getFinancialAnalysis() {
  return fetchAPI('/api/v1/medini/financial');
}

export function getTopicalAnalysis() {
  return fetchAPI('/api/v1/medini/topical');
}
