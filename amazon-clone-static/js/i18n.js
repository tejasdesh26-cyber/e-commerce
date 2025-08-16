// Simple i18n for English, Hindi, Marathi
const LANG = {
  en: {
    searchPlaceholder: 'Search products...',
    heroTitle: 'Discover great products — fast',
    heroSubtitle: 'Local demo store — works offline (no backend)',
    featured: 'Featured Products'
  },
  hi: {
    searchPlaceholder: 'उत्पाद खोजें...',
    heroTitle: 'बेहतरीन उत्पाद खोजें — तेज़',
    heroSubtitle: 'स्थानीय डेमो स्टोर — बिना बैकएंड के काम करता है',
    featured: 'विशेष उत्पाद'
  },
  mr: {
    searchPlaceholder: 'उत्पादन शोधा...',
    heroTitle: 'शेगड उत्पाद लवकर शोधा',
    heroSubtitle: 'लोकल डेमो स्टोअर — बॅकएंड शिवाय चालते',
    featured: 'वैशिष्ट्यीकृत उत्पाद'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key){ return LANG[currentLang][key] || LANG['en'][key] || ''; }

function applyTranslations(){
  document.getElementById('searchInput') && (document.getElementById('searchInput').placeholder = t('searchPlaceholder'));
  document.getElementById('heroTitle') && (document.getElementById('heroTitle').textContent = t('heroTitle'));
  document.getElementById('heroSubtitle') && (document.getElementById('heroSubtitle').textContent = t('heroSubtitle'));
  document.getElementById('productsHeading') && (document.getElementById('productsHeading').textContent = t('featured'));
  // update lang chip
  const chip = document.getElementById('langBtn');
  if(chip) chip.textContent = currentLang.toUpperCase();
}

document.addEventListener('DOMContentLoaded', applyTranslations);
