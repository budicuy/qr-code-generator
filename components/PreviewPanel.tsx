
import React, { useState } from 'react';
import type { Extension, QrOptions, QrType, QrData } from '../types';
import { downloadExtensions, downloadResolutions } from '../constants';
import { DownloadIcon, SaveIcon, ResetIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

interface PreviewPanelProps {
  qrRef: React.RefObject<HTMLDivElement>;
  handleDownload: (extension: Extension, size: number) => void;
  qrType: QrType;
  qrData: QrData;
  options: QrOptions;
  setFileManagerOpen: (isOpen: boolean) => void;
  handleReset: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ qrRef, handleDownload, options, qrType, qrData, setFileManagerOpen, handleReset }) => {
  const { t } = useLanguage();
  const [selectedExtension, setSelectedExtension] = useState<Extension>('png');
  const [selectedResolution, setSelectedResolution] = useState<number>(1024);

  const handleSave = () => {
    // Pass current QR config to the FileManager via a global state or prop
    // For now, we'll just open the manager
    (window as any).qrToSave = { qrType, qrData, options };
    setFileManagerOpen(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl p-4 sm:p-6 sticky top-24">
      <div className="relative max-w-sm mx-auto">
        <div className="bg-white p-1 rounded-md flex items-center justify-center aspect-square">
          <div ref={qrRef} className="qr-preview-container" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div className="mt-6 max-w-sm mx-auto space-y-4">
        <p className="text-center text-gray-400 mb-2 text-sm">{t('preview.title')}</p>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={selectedResolution}
            onChange={(e) => setSelectedResolution(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-white"
            aria-label={t('preview.resolution_aria')}
          >
            {downloadResolutions.map(res => (
              <option key={res.value} value={res.value}>{t(`download_res.${String(res.value)}`)}</option>
            ))}
          </select>
          <select
            value={selectedExtension}
            onChange={(e) => setSelectedExtension(e.target.value as Extension)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-white"
            aria-label={t('preview.format_aria')}
          >
            {downloadExtensions.map(ext => (
              <option key={ext.value} value={ext.value}>{t(`download_ext.${ext.value}`)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleDownload(selectedExtension, selectedResolution)}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          <span>{t('preview.download_button')}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            {t('preview.save_button')}
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
          >
            <ResetIcon className="w-5 h-5 mr-2" />
            {t('preview.reset_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
