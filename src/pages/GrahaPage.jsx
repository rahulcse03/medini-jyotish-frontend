import { SectionHeader } from '../components/Shared';
import { useLang } from '../i18n/LanguageContext';
import RashiChakra from '../components/RashiChakra';
import { GRAHA_INFO, DIGNITY_COLORS, findGrahaKey } from '../data/constants';

function GrahaRow({ g, delay }) {
  const key = findGrahaKey(g.graha);
  const info = key ? GRAHA_INFO[key] : { color: '#5C4033' };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(56px, 70px) 1fr minmax(70px, 100px) 50px 60px 60px',
      alignItems: 'center', padding: '12px 16px',
      borderBottom: '1px solid rgba(92,64,51,0.10)', gap: 8,
      animation: `fadeSlideIn 0.4s ease ${delay}s both`,
    }}>
      <div style={{
        fontFamily: 'var(--font-devanagari)', fontSize: 15,
        color: info.color, fontWeight: 700,
      }}>{g.graha_sa}</div>

      <div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>
          {g.rashi}
        </span>
        <span style={{
          fontFamily: 'var(--font-devanagari)', fontSize: 12,
          color: 'var(--burnt-sienna)', marginLeft: 6,
        }}>{g.rashi_sa}</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 13,
          color: 'var(--ochre)', marginLeft: 8,
        }}>{g.degree.toFixed(2)}°</span>
      </div>

      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)',
      }}>{g.nakshatra}</div>

      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)',
      }}>P{g.pada}</div>

      <div style={{
        fontSize: 11, fontFamily: 'var(--font-body)', fontStyle: 'italic',
        color: DIGNITY_COLORS[g.dignity] || 'var(--burnt-sienna)',
      }}>
        {g.dignity !== 'neutral' ? g.dignity : ''}
      </div>

      <div style={{ fontSize: 11, fontFamily: 'var(--font-body)' }}>
        {g.is_retrograde && (
          <span style={{ color: 'var(--blood)', fontWeight: 700 }}>℞ वक्री</span>
        )}
      </div>
    </div>
  );
}

export default function GrahaPage({ data }) {
  const { t } = useLang();
  const positions = data?.positions || [];

  // Build grahas map for chakra
  const grahasForChakra = {};
  positions.forEach(p => {
    const key = findGrahaKey(p.graha);
    if (key) grahasForChakra[key] = { ...p };
  });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader
        sa="ग्रह गोचर"
        en={t('graha.title')}
        sub={t('graha.subtitle')}
      />

      <RashiChakra grahas={grahasForChakra} />

      <div style={{
        marginTop: 32, border: '1px solid rgba(92,64,51,0.15)',
        background: 'rgba(245,230,200,0.3)', overflow: 'hidden',
      }}>
        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(56px, 70px) 1fr minmax(70px, 100px) 50px 60px 60px',
          padding: '10px 16px', borderBottom: '2px solid rgba(92,64,51,0.2)',
          fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--burnt-sienna)',
          letterSpacing: 2, textTransform: 'uppercase',
        }}>
          <div>{t('graha.colGraha')}</div>
          <div>{t('graha.colRashi')}</div>
          <div>{t('graha.colNak')}</div>
          <div>{t('graha.colPada')}</div>
          <div>{t('graha.colDignity')}</div>
          <div>{t('graha.colStatus')}</div>
        </div>

        {positions.map((g, i) => (
          <GrahaRow key={g.graha} g={g} delay={i * 0.06} />
        ))}
      </div>

      {data?.note && (
        <div style={{
          textAlign: 'center', marginTop: 16, fontSize: 11,
          color: 'var(--ochre)', fontStyle: 'italic',
        }}>{data.note}</div>
      )}
    </div>
  );
}
