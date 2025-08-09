import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Language configuration
export const languages = {
    'en': { name: 'English', flag: 'gb' },
    'ru': { name: 'Rusia', flag: 'ru' },
    'sg': { name: 'Singapore', flag: 'sg' },
    'id': { name: 'Indonesia', flag: 'id' },
    'zh': { name: 'China', flag: 'cn' },
    'th': { name: 'Thailand', flag: 'th' },
    'ph': { name: 'Philipina', flag: 'ph' },
    'ko': { name: 'Korea', flag: 'kr' },
} as const;

export type LangCode = keyof typeof languages;
export const defaultLang: LangCode = 'id';

// Types
interface LanguageContextType {
    lang: LangCode;
    setLang: (lang: LangCode) => void;
    t: (key: string, replacements?: { [key: string]: string }) => string;
}

// Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<LangCode>(() => {
        if (typeof window === 'undefined') return defaultLang;
        const savedLang = window.localStorage.getItem('qr_lang') as LangCode;
        return savedLang && languages[savedLang] ? savedLang : defaultLang;
    });
    const [translations, setTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await fetch(`/locales/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Could not load ${lang}.json`);
                }
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error("Failed to fetch translations:", error);
                // Fallback to default language if current one fails
                if (lang !== defaultLang) {
                    setLang(defaultLang);
                }
            }
        };
        fetchTranslations();
    }, [lang]);

    const setLang = (newLang: LangCode) => {
        setLangState(newLang);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('qr_lang', newLang);
        }
    };

    const t = useCallback((key: string, replacements: { [key: string]: string } = {}) => {
        let translation = translations[key] || key;
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
        return translation;
    }, [translations]);

    const value = { lang, setLang, t };

    return (
        <LanguageContext.Provider value={value}>
            {Object.keys(translations).length > 0 ? children : null /* Render children only when translations are loaded */}
        </LanguageContext.Provider>
    );
};

// Hook
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};