import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import uk from './locales/uk.json';
import en from './locales/en.json';

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'uk';
const supportedLanguages = ['uk', 'en'];
const detectedLanguage = supportedLanguages.includes(deviceLocale) ? deviceLocale : 'uk';

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: detectedLanguage,
  fallbackLng: 'uk',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
export { i18n };
