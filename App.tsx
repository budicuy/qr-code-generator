
import React, { useState } from 'react';
import QrStudio from './components/QrStudio';
import { GithubIcon, FolderIcon, ProfileIcon } from './components/Icons';
import { AppProvider } from './context/AppContext';
import FileManager from './components/FileManager';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLanguage } from './context/LanguageContext';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const [isFileManagerOpen, setFileManagerOpen] = useState(false);
  const [isProfilePageOpen, setProfilePageOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
        <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                {t('header.title')}
              </h1>
              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setFileManagerOpen(true)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                    aria-label={t('header.fileManager_aria')}
                  >
                   <FolderIcon className="h-5 w-5" />
                   <span className="hidden sm:inline">{t('header.myProjects')}</span>
                 </button>
                 <LanguageSwitcher />
                 <button
                    onClick={() => setProfilePageOpen(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={t('header.profile_aria')}
                 >
                    <ProfileIcon className="h-6 w-6" />
                 </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <QrStudio setFileManagerOpen={setFileManagerOpen} />
        </main>
        
        {isFileManagerOpen && <FileManager onClose={() => setFileManagerOpen(false)} />}
        {isProfilePageOpen && <ProfilePage onClose={() => setProfilePageOpen(false)} />}

        <footer className="text-center p-4 text-gray-500 text-sm mt-8">
          <p>
            {t('footer.builtWith')}{' '}
            <span className="text-gray-600">|</span> {t('footer.developed_by')}{' '}
            <button 
              onClick={() => setProfilePageOpen(true)} 
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline focus:outline-none transition-colors"
            >
              BUDIANNOR
            </button>
          </p>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;