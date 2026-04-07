export const RASHI_SYMBOLS = {
  Mesha: "♈", Vrishabha: "♉", Mithuna: "♊", Karka: "♋",
  Simha: "♌", Kanya: "♍", Tula: "♎", Vrischika: "♏",
  Dhanu: "♐", Makara: "♑", Kumbha: "♒", Meena: "♓"
};

export const RASHI_ORDER = [
  "Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya",
  "Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"
];

export const GRAHA_INFO = {
  surya:   { sym: "सू", name_sa: "सूर्य",  color: "#B8650A", match: "sur" },  // Deep orange-gold (Sun)
  chandra: { sym: "चं", name_sa: "चन्द्र", color: "#4A6885", match: "cha" },  // Steel blue-grey (Moon)
  mangal:  { sym: "मं", name_sa: "मंगल",   color: "#8B2500", match: "man" },  // Blood red (Mars)
  budh:    { sym: "बु", name_sa: "बुध",    color: "#2D6B3F", match: "bud" },  // Deep green (Mercury)
  guru:    { sym: "गु", name_sa: "गुरु",   color: "#9A7209", match: "gur" },  // Deep gold (Jupiter)
  shukra:  { sym: "शु", name_sa: "शुक्र",  color: "#7B5EA7", match: "shu" },  // Muted purple (Venus)
  shani:   { sym: "श",  name_sa: "शनि",    color: "#2F1B14", match: "sha" },  // Dark ink (Saturn)
  rahu:    { sym: "रा", name_sa: "राहु",   color: "#4A3728", match: "rah" },  // Dark brown (Rahu)
  ketu:    { sym: "के", name_sa: "केतु",   color: "#6B4226", match: "ket" },  // Warm brown (Ketu)
};

export function findGrahaKey(grahaName) {
  const lower = grahaName.toLowerCase();
  return Object.keys(GRAHA_INFO).find(k => lower.startsWith(GRAHA_INFO[k].match)) || null;
}

export const DIGNITY_COLORS = {
  uccha: "#2D6B3F",
  neecha: "#8B2500",
  swakshetra: "#9A7209",
  moolatrikona: "#B8650A",
  neutral: "#5C4033",
};

export const SEVERITY_STYLES = {
  shubh:    { bg: "rgba(45,107,63,0.12)",  border: "#2D6B3F", dot: "#2D6B3F" },
  savdhan:  { bg: "rgba(154,114,9,0.12)",  border: "#9A7209", dot: "#9A7209" },
  chetavani:{ bg: "rgba(139,37,0,0.12)",   border: "#8B2500", dot: "#8B2500" },
};
