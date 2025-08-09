import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, languages, LangCode } from '../context/LanguageContext';
import { ChevronDownIcon } from './Icons';

const LanguageSwitcher: React.FC = () => {
    const { lang, setLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (newLang: LangCode) => {
        setLang(newLang);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const currentLanguage = languages[lang];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span className={`fi fi-${currentLanguage.flag} fis`}></span>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 py-1">
                    {Object.entries(languages).map(([code, { name, flag }]) => (
                        <button
                            key={code}
                            onClick={() => handleLanguageChange(code as LangCode)}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        >
                            <span className={`fi fi-${flag} fis`}></span>
                            <span>{name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;