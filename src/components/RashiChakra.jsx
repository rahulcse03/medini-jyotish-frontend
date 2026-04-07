import { RASHI_ORDER, RASHI_SYMBOLS, GRAHA_INFO } from '../data/constants';

const RASHI_NAMES = {
  Mesha: "Mesha (मेष) — Aries",
  Vrishabha: "Vrishabha (वृषभ) — Taurus",
  Mithuna: "Mithuna (मिथुन) — Gemini",
  Karka: "Karka (कर्क) — Cancer",
  Simha: "Simha (सिंह) — Leo",
  Kanya: "Kanya (कन्या) — Virgo",
  Tula: "Tula (तुला) — Libra",
  Vrischika: "Vrischika (वृश्चिक) — Scorpio",
  Dhanu: "Dhanu (धनु) — Sagittarius",
  Makara: "Makara (मकर) — Capricorn",
  Kumbha: "Kumbha (कुम्भ) — Aquarius",
  Meena: "Meena (मीन) — Pisces",
};

export default function RashiChakra({ grahas }) {
  if (!grahas || Object.keys(grahas).length === 0) return null;

  const cx = 220, cy = 220, outer = 200, inner = 100;

  // Group grahas by rashi
  const rashiGrahas = {};
  RASHI_ORDER.forEach(r => (rashiGrahas[r] = []));
  Object.entries(grahas).forEach(([key, g]) => {
    if (rashiGrahas[g.rashi]) rashiGrahas[g.rashi].push({ key, ...g });
  });

  const houses = RASHI_ORDER.map((rashi, i) => {
    const startAngle = (i * 30 - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
    const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);

    const oS = { x: cx + outer * Math.cos(startAngle), y: cy + outer * Math.sin(startAngle) };
    const oE = { x: cx + outer * Math.cos(endAngle), y: cy + outer * Math.sin(endAngle) };
    const iS = { x: cx + inner * Math.cos(startAngle), y: cy + inner * Math.sin(startAngle) };
    const iE = { x: cx + inner * Math.cos(endAngle), y: cy + inner * Math.sin(endAngle) };

    const path = `M ${oS.x} ${oS.y} A ${outer} ${outer} 0 0 1 ${oE.x} ${oE.y} L ${iE.x} ${iE.y} A ${inner} ${inner} 0 0 0 ${iS.x} ${iS.y} Z`;

    const labelR = outer + 18;
    const labelPos = { x: cx + labelR * Math.cos(midAngle), y: cy + labelR * Math.sin(midAngle) };
    const planetR = (outer + inner) / 2;
    const planets = rashiGrahas[rashi];

    return { rashi, i, path, midAngle, labelPos, planetR, planets, startAngle };
  });

  return (
    <svg viewBox="0 0 440 440" style={{ width: '100%', maxWidth: 440, display: 'block', margin: '0 auto', cursor: 'default' }}>
      {/* Outer and inner rings */}
      <circle cx={cx} cy={cy} r={outer} fill="none" stroke="#5C4033" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={inner} fill="none" stroke="#5C4033" strokeWidth="1.5" />

      {houses.map(h => (
        <g key={h.rashi}>
          {/* House sector */}
          <path d={h.path}
            fill={h.planets.length > 0 ? 'rgba(184,134,11,0.07)' : 'transparent'}
            stroke="#5C4033" strokeWidth="0.5"
            style={{ cursor: 'pointer' }}>
            <title>{RASHI_NAMES[h.rashi]}{h.planets.length > 0 ? ` — ${h.planets.map(p => GRAHA_INFO[p.key]?.name_sa || p.key).join(', ')}` : ''}</title>
          </path>

          {/* Dividing line */}
          <line
            x1={cx + inner * Math.cos(h.startAngle)}
            y1={cy + inner * Math.sin(h.startAngle)}
            x2={cx + outer * Math.cos(h.startAngle)}
            y2={cy + outer * Math.sin(h.startAngle)}
            stroke="#5C4033" strokeWidth="1" />

          {/* Rashi symbol with tooltip */}
          <text x={h.labelPos.x} y={h.labelPos.y}
            textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 14, fill: '#5C4033', fontFamily: "'EB Garamond', serif", cursor: 'help' }}>
            <title>{RASHI_NAMES[h.rashi]}</title>
            {RASHI_SYMBOLS[h.rashi]}
          </text>

          {/* Planets in sector with tooltips */}
          {h.planets.map((p, pi) => {
            const spread = h.planets.length > 1
              ? (pi - (h.planets.length - 1) / 2) * 9 : 0;
            const angle = h.midAngle + spread * (Math.PI / 180);
            const px = cx + h.planetR * Math.cos(angle);
            const py = cy + h.planetR * Math.sin(angle);
            const gi = GRAHA_INFO[p.key] || { sym: '?', color: '#5C4033' };

            const tooltip = `${gi.name_sa} (${p.graha || p.key}) — ${p.rashi} ${p.degree?.toFixed(1)}° | ${p.nakshatra || ''} P${p.pada || ''}${p.dignity && p.dignity !== 'neutral' ? ` | ${p.dignity}` : ''}${p.is_retrograde ? ' | Vakri ℞' : ''}`;

            return (
              <g key={p.key} style={{ cursor: 'help' }}>
                <circle cx={px} cy={py} r="14" fill={gi.color} opacity="0.15">
                  <title>{tooltip}</title>
                </circle>
                <text x={px} y={py}
                  textAnchor="middle" dominantBaseline="central"
                  style={{
                    fontSize: 13, fill: gi.color, fontWeight: 700,
                    fontFamily: "'Noto Serif Devanagari', serif",
                  }}>
                  <title>{tooltip}</title>
                  {gi.sym}
                </text>
                {p.is_retrograde && (
                  <text x={px + 13} y={py - 10}
                    style={{ fontSize: 8, fill: '#8B2500' }}>℞</text>
                )}
              </g>
            );
          })}
        </g>
      ))}

      {/* Center */}
      <circle cx={cx} cy={cy} r={inner - 1} fill="#F5E6C8" />
      <text x={cx} y={cy - 14} textAnchor="middle"
        style={{ fontSize: 15, fill: '#2F1B14', fontFamily: "'Noto Serif Devanagari', serif", fontWeight: 700 }}>
        राशि चक्र
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle"
        style={{ fontSize: 11, fill: '#5C4033', fontFamily: "'EB Garamond', serif" }}>
        Rashi Chakra
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle"
        style={{ fontSize: 9, fill: '#B8860B', fontFamily: "'EB Garamond', serif" }}>
        Lahiri Ayanamsha
      </text>
    </svg>
  );
}
