import { SEVERITY_STYLES } from '../data/constants';
import { useLang, LANGUAGES } from '../i18n/LanguageContext';

export function Divider() {
  return (
    <div style={{
      textAlign: 'center', margin: '32px 0', color: 'var(--ochre)',
      fontSize: 16, letterSpacing: 12, opacity: 0.6, userSelect: 'none',
    }}>✦ ॐ ✦</div>
  );
}

export function SectionHeader({ sa, en, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <h2 style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 28, color: 'var(--ink)', margin: '0 0 4px', fontWeight: 400, letterSpacing: 2 }}>{sa}</h2>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--burnt-sienna)', letterSpacing: 3, textTransform: 'uppercase' }}>{en}</div>
      {sub && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)', marginTop: 4, fontStyle: 'italic' }}>{sub}</div>}
    </div>
  );
}

export function SeverityBadge({ severity, sa }) {
  const c = SEVERITY_STYLES[severity] || SEVERITY_STYLES.savdhan;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', background: c.bg, border: `1px solid ${c.border}`, fontFamily: 'var(--font-devanagari)', fontSize: 12, color: c.border, letterSpacing: 0.5 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {sa}
    </span>
  );
}

const NAV_TABS = [
  { key: 'graha',       sa: 'ग्रह गोचर',    tKey: 'nav.graha' },
  { key: 'panchang',    sa: 'पञ्चाङ्ग',     tKey: 'nav.panchang' },
  { key: 'medini',      sa: 'मेदिनी फल',    tKey: 'nav.medini' },
  { key: 'eclipse',     sa: 'ग्रहण फल',     tKey: 'nav.eclipse' },
  { key: 'samvatsara',  sa: 'संवत्सर फल',   tKey: 'nav.samvatsara' },
  { key: 'kundli',      sa: 'जन्म कुण्डली', tKey: 'nav.kundli' },
  { key: 'nations',     sa: 'राष्ट्र कुण्डली', tKey: 'nav.nations' },
  { key: 'monthly',     sa: 'मासिक सारांश',  tKey: 'nav.monthly' },
  { key: 'financial',   sa: 'आर्थिक ज्योतिष', tKey: 'nav.financial' },
  { key: 'topical',     sa: 'सामयिक विश्लेषण', tKey: 'nav.topical' },
  { key: 'rashifal',    sa: 'राशिफल',          tKey: 'nav.rashifal' },
];

export function Nav({ active, setActive }) {
  const { t } = useLang();
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', borderBottom: '2px solid var(--burnt-sienna)', marginBottom: 36, flexWrap: 'wrap' }}>
      {NAV_TABS.map(tab => (
        <button key={tab.key} onClick={() => setActive(tab.key)} style={{
          background: active === tab.key ? 'var(--burnt-sienna)' : 'transparent',
          color: active === tab.key ? 'var(--parchment-light)' : 'var(--burnt-sienna)',
          border: 'none', padding: '12px 16px', cursor: 'pointer',
          fontFamily: 'var(--font-devanagari)', fontSize: 13,
          letterSpacing: 1, transition: 'all 0.3s ease',
          borderTop: active === tab.key ? '2px solid var(--ochre)' : '2px solid transparent',
        }}>
          {tab.sa}
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2, opacity: 0.7 }}>{t(tab.tKey)}</span>
        </button>
      ))}
    </nav>
  );
}

export function LanguageSelector() {
  const { lang, setLang, t } = useLang();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, margin: '0 0 8px' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--ochre)', letterSpacing: 1, textTransform: 'uppercase' }}>{t('lang.label')}</span>
      <select
        value={lang}
        onChange={e => setLang(e.target.value)}
        style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink)',
          background: 'rgba(245,230,200,0.6)', border: '1px solid rgba(92,64,51,0.2)',
          padding: '3px 8px', cursor: 'pointer', outline: 'none',
        }}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.native}</option>
        ))}
      </select>
    </div>
  );
}

export function LoadingSkeleton() {
  const { t } = useLang();
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'shimmer 2s ease-in-out infinite' }}>
      <div style={{ fontFamily: 'var(--font-sanskrit)', fontSize: 24, color: 'var(--ochre)', marginBottom: 8 }}>गणना चल रही है...</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', fontStyle: 'italic' }}>{t('loading.positions')}</div>
    </div>
  );
}
