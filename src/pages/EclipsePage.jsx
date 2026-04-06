import { SectionHeader, SeverityBadge, Divider } from '../components/Shared';
import { useState } from 'react';

function utcToLocal(utcStr) {
  if (!utcStr) return '--';
  try {
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return utcStr;
    return d.toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
  } catch { return utcStr; }
}

function utcToDate(utcStr) {
  if (!utcStr) return '--';
  try {
    const d = new Date(utcStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return utcStr; }
}

function EclipseCard({ eclipse, index }) {
  const [expanded, setExpanded] = useState(false);
  const isSolar = eclipse.kind === 'solar';

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(!expanded)}
      style={{
        background: 'rgba(245,230,200,0.5)',
        border: '1px solid rgba(92,64,51,0.15)',
        padding: '20px 24px', marginBottom: 16, cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        animation: `fadeSlideIn 0.6s ease ${index * 0.15}s both`,
        borderColor: expanded ? 'rgba(184,134,11,0.4)' : 'rgba(92,64,51,0.15)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>
            {isSolar ? 'सूर्यग्रहण' : 'चन्द्रग्रहण'}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--burnt-sienna)' }}>
            {eclipse.type}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <SeverityBadge severity={eclipse.severity} sa={eclipse.severity_sa} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ochre)', marginTop: 6 }}>
            {utcToDate(eclipse.datetime_utc)}
          </div>
        </div>
      </div>

      {/* Rashi and Nakshatra */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12,
        padding: '12px 16px', background: 'rgba(184,134,11,0.05)',
        border: '1px solid rgba(184,134,11,0.1)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ochre)', marginBottom: 4 }}>Rashi</div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, color: 'var(--ink)' }}>{eclipse.rashi_sa}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 8 }}>{eclipse.rashi} {eclipse.degree_in_rashi}°</span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ochre)', marginBottom: 4 }}>Nakshatra</div>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, color: 'var(--ink)' }}>{eclipse.nakshatra_sa}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--burnt-sienna)', marginLeft: 8 }}>Pada {eclipse.pada}</span>
        </div>
      </div>

      {/* Sanskrit */}
      <div style={{
        fontFamily: 'var(--font-sanskrit)', fontSize: 15, color: 'var(--ink)',
        lineHeight: 1.8, marginBottom: 10,
        borderLeft: '2px solid var(--ochre)', paddingLeft: 16,
      }}>
        {eclipse.sanskrit}
      </div>

      {/* Prediction */}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.7, marginBottom: 8 }}>
        {eclipse.prediction}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(92,64,51,0.1)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--burnt-sienna)', lineHeight: 2.2 }}>
            <div><strong>Affected regions:</strong> {eclipse.affected_regions?.join(', ')}</div>
            <div><strong>Direction:</strong> {eclipse.direction}</div>
            <div><strong>Effect category:</strong> {eclipse.effect_category}</div>
            <div><strong>Duration of effects:</strong> {eclipse.effect_duration_months} months</div>
            <div><strong>Nakshatra-specific effect:</strong> {eclipse.nakshatra_effect}</div>
            <div><strong>Source:</strong> {eclipse.source}</div>

            {eclipse.timing && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(92,64,51,0.08)' }}>
                <strong>Eclipse timing:</strong>
                {eclipse.timing.penumbral_begin_utc && <div>Penumbral begin: {utcToLocal(eclipse.timing.penumbral_begin_utc)}</div>}
                {eclipse.timing.partial_begin_utc && <div>Partial begin: {utcToLocal(eclipse.timing.partial_begin_utc)}</div>}
                {eclipse.timing.total_begin_utc && <div>Totality begin: {utcToLocal(eclipse.timing.total_begin_utc)}</div>}
                {eclipse.timing.total_end_utc && <div>Totality end: {utcToLocal(eclipse.timing.total_end_utc)}</div>}
                {eclipse.timing.partial_end_utc && <div>Partial end: {utcToLocal(eclipse.timing.partial_end_utc)}</div>}
                {eclipse.timing.penumbral_end_utc && <div>Penumbral end: {utcToLocal(eclipse.timing.penumbral_end_utc)}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EclipsePage({ data }) {
  if (!data) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <SectionHeader
        sa="ग्रहण फल"
        en="Eclipse Analysis"
        sub={`${data.total_upcoming} upcoming eclipses with Brihat Samhita interpretation`}
      />

      {data.eclipses?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--burnt-sienna)', fontStyle: 'italic' }}>
          No upcoming eclipses found.
        </div>
      ) : (
        data.eclipses?.map((ecl, i) => (
          <EclipseCard key={`${ecl.kind}-${ecl.date}`} eclipse={ecl} index={i} />
        ))
      )}

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--burnt-sienna)', fontStyle: 'italic', lineHeight: 1.8 }}>
        Eclipse interpretations based on Brihat Samhita Ch. 5-6 by Varahamihira
        <br />Tap any eclipse to see detailed analysis
      </div>
    </div>
  );
}
