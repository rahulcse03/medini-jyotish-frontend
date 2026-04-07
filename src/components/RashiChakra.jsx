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

/* Inline styles for hover — using CSS class injection */
const HOVER_STYLES = `
  .rashi-symbol:hover { filter: drop-shadow(0 0 4px rgba(184,134,11,0.5)); }
  .rashi-symbol { transition: filter 0.2s ease; cursor: pointer; }
  .graha-group:hover .graha-bg { opacity: 0.35 !important; }
  .graha-group:hover .graha-label { transform: scale(1.15); }
  .graha-group { cursor: pointer; }
  .graha-bg { transition: opacity 0.2s ease; }
  .graha-label { transition: transform 0.2s ease; }
  .house-sector { transition: fill 0.2s ease; }
  .house-sector:hover { fill: rgba(184,134,11,0.12) !important; }
`;

export default function RashiChakra({ grahas }) {
  if (!grahas || Object.keys(grahas).length === 0) return null;

  const cx = 220, cy = 220, outer = 200, inner = 100;

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
    <>
      <style>{HOVER_STYLES}</style>
      <svg viewBox="0 0 440 440" style={{ width: '100%', maxWidth: 440, display: 'block', margin: '0 auto' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer and inner rings */}
        <circle cx={cx} cy={cy} r={outer} fill="none" stroke="#5C4033" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={inner} fill="none" stroke="#5C4033" strokeWidth="1.5" />

        {houses.map(h => {
          const sectorTooltip = `${RASHI_NAMES[h.rashi]}${h.planets.length > 0 ? `\n${h.planets.map(p => {
            const gi = GRAHA_INFO[p.key];
            return `${gi?.name_sa || ''} (${p.graha || p.key}) ${p.degree?.toFixed(1)}°`;
          }).join('\n')}` : ''}`;

          return (
            <g key={h.rashi}>
              {/* House sector — hoverable */}
              <path d={h.path}
                className="house-sector"
                fill={h.planets.length > 0 ? 'rgba(184,134,11,0.07)' : 'transparent'}
                stroke="#5C4033" strokeWidth="0.5">
                <title>{sectorTooltip}</title>
              </path>

              {/* Dividing line */}
              <line
                x1={cx + inner * Math.cos(h.startAngle)}
                y1={cy + inner * Math.sin(h.startAngle)}
                x2={cx + outer * Math.cos(h.startAngle)}
                y2={cy + outer * Math.sin(h.startAngle)}
                stroke="#5C4033" strokeWidth="1" />

              {/* Rashi symbol — glows on hover */}
              <text x={h.labelPos.x} y={h.labelPos.y}
                className="rashi-symbol"
                textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: 14, fill: '#5C4033', fontFamily: "'EB Garamond', serif" }}>
                <title>{RASHI_NAMES[h.rashi]}</title>
                {RASHI_SYMBOLS[h.rashi]}
              </text>

              {/* Planets — highlight on hover */}
              {h.planets.map((p, pi) => {
                const spread = h.planets.length > 1
                  ? (pi - (h.planets.length - 1) / 2) * 9 : 0;
                const angle = h.midAngle + spread * (Math.PI / 180);
                const px = cx + h.planetR * Math.cos(angle);
                const py = cy + h.planetR * Math.sin(angle);
                const gi = GRAHA_INFO[p.key] || { sym: '?', color: '#5C4033', name_sa: '' };

                const tooltip = [
                  `${gi.name_sa} (${p.graha || p.key})`,
                  `${p.rashi} ${p.degree?.toFixed(1)}°`,
                  p.nakshatra ? `${p.nakshatra} Pada ${p.pada}` : '',
                  p.dignity && p.dignity !== 'neutral' ? p.dignity : '',
                  p.is_retrograde ? 'Vakri (Retrograde) ℞' : '',
                ].filter(Boolean).join('\n');

                return (
                  <g key={p.key} className="graha-group">
                    <circle cx={px} cy={py} r="16" fill={gi.color} opacity="0.12" className="graha-bg">
                      <title>{tooltip}</title>
                    </circle>
                    <text x={px} y={py}
                      className="graha-label"
                      textAnchor="middle" dominantBaseline="central"
                      style={{
                        fontSize: 13, fill: gi.color, fontWeight: 700,
                        fontFamily: "'Noto Serif Devanagari', serif",
                        transformOrigin: `${px}px ${py}px`,
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
          );
        })}

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
    </>
  );
}
