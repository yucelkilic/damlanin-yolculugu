export const languages = ['tr', 'en', 'es'];
const requested = new URLSearchParams(location.search).get('lang');
let saved = null;
try { saved = localStorage.getItem('damla-language'); } catch {}
export const lang = languages.includes(requested) ? requested : languages.includes(saved) ? saved : 'tr';
export const languageIndex = languages.indexOf(lang);
export const pick = values => values[languageIndex];
export const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const localized = href => {
  const url = new URL(href, location.href);
  url.searchParams.set('lang', lang);
  return url.pathname + url.search + url.hash;
};
export function languagePicker() {
  return `<label class="language-picker"><span class="sr-only">${pick(['Dil','Language','Idioma'])}</span><select id="language-select" aria-label="${pick(['Dil seç','Choose language','Elegir idioma'])}"><option value="tr" ${lang==='tr'?'selected':''}>TR · Türkçe</option><option value="en" ${lang==='en'?'selected':''}>EN · English</option><option value="es" ${lang==='es'?'selected':''}>ES · Español</option></select></label>`;
}
export function initLocale() {
  document.documentElement.lang = lang;
  document.getElementById('language-select')?.addEventListener('change', event => {
    const next = event.target.value;
    if (!languages.includes(next)) return;
    try { localStorage.setItem('damla-language', next); } catch {}
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    location.assign(url.href);
  });
  document.querySelectorAll('a[data-locale-link]').forEach(link => { link.href = localized(link.getAttribute('href')); });
}
