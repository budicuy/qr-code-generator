
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CloseIcon, GithubIcon, LinkedInIcon, GlobeIcon, WhatsAppIcon, MailIcon } from './Icons';

interface ProfilePageProps {
  onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const { t } = useLanguage();

  const socialLinks = [
    { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/budicuy' },
    { name: 'LinkedIn', icon: LinkedInIcon, url: 'https://www.linkedin.com/in/budiannor-5000a728b' },
    { name: 'Portfolio', icon: GlobeIcon, url: 'https://budiannor.vercel.app/' },
    { name: 'Email', icon: MailIcon, url: 'mailto:personal.budicuy@gmail.com' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 transform transition-all"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-heading"
      >
        <div className="relative p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label={t('profile.close_aria')}
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          <img
            src="/me.jpg"
            alt={t('profile.name')}
            className="w-28 h-28 rounded-full mx-auto mb-4 ring-4 ring-gray-700/50 object-cover"
          />

          <h1 id="profile-heading" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            {t('profile.name')}
          </h1>
          <p className="text-md text-gray-300 mt-1">{t('profile.role')}</p>
          <p className="text-gray-400 mt-4 max-w-xs mx-auto text-sm">{t('profile.bio')}</p>

          <div className="flex justify-center gap-4 mt-6">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 p-3 rounded-full transition-all"
                aria-label={link.name}
              >
                <link.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="https://wa.me/62882022007324"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
            >
              <WhatsAppIcon className="w-5 h-5 mr-3" />
              {t('profile.contact_whatsapp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
