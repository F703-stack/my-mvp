import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import ar from '../locales/ar.json';
import zh from '../locales/zh.json';
import hi from '../locales/hi.json';
import ru from '../locales/ru.json';
import pt from '../locales/pt.json';
import ja from '../locales/ja.json';

// Basic client-side only i18n initialization
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      ar: { translation: ar },
      zh: { translation: zh },
      hi: { translation: hi },
      ru: { translation: ru },
      pt: { translation: pt },
      ja: { translation: ja },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;


