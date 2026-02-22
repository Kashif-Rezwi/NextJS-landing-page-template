'use client';
import { useI18n } from './provider';

const LOCALE_FLAGS: Record<string, string> = {
  en: '🇺🇸', fr: '🇫🇷', ar: '🇸🇦', ja: '🇯🇵',
  de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', pt: '🇧🇷', zh: '🇨🇳', ko: '🇰🇷',
};

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', fr: 'Français', ar: 'العربية', ja: '日本語',
  de: 'Deutsch', es: 'Español', it: 'Italiano', pt: 'Português', zh: '中文', ko: '한국어',
};

export function LanguageSwitcher() {
  const { locale, changeLocale, availableLocales } = useI18n();
  if (availableLocales.length <= 1) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '6px',
      background: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0',
      borderRadius: '14px', padding: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      backdropFilter: 'blur(12px)',
    }}>
      <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
        🌐 Language
      </p>
      {availableLocales.map((loc) => (
        <button key={loc} onClick={() => changeLocale(loc)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '7px 14px', borderRadius: '8px', border: 'none',
          background: loc === locale ? '#0070f3' : 'transparent',
          color: loc === locale ? '#fff' : '#374151',
          cursor: 'pointer', fontSize: '13px', fontWeight: loc === locale ? 600 : 400,
          transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}>
          <span>{LOCALE_FLAGS[loc] ?? '🌐'}</span>
          <span>{LOCALE_NAMES[loc] ?? loc.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
