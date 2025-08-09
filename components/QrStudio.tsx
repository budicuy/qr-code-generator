
import React, { useState, useEffect, useRef, useCallback } from 'react';
import OptionsPanel from './OptionsPanel';
import PreviewPanel from './PreviewPanel';
import ConfirmModal from './ConfirmModal';
import type { QrOptions, Extension, QrType, QrData, Project, VCardData, WifiData } from '../types';
import { debounce, formatVCard, formatWifi } from '../lib/helpers';
import { useLanguage } from '../context/LanguageContext';

const defaultOptions: QrOptions = {
    width: 300,
    height: 300,
    data: 'https://react.dev',
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#000000',
      type: 'square',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square',
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square',
    },
    image: null
};

const QrStudio: React.FC<{setFileManagerOpen: (isOpen: boolean) => void}> = ({setFileManagerOpen}) => {
  const { t } = useLanguage();
  const [qrType, setQrType] = useState<QrType>('url');
  const [qrData, setQrData] = useState<QrData>('https://react.dev');
  const [options, setOptions] = useState<QrOptions>(defaultOptions);
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  const [qrInstance, setQrInstance] = useState<any>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const formatDataToString = (type: QrType, data: QrData): string => {
    if (typeof data === 'string') return data;
    if (type === 'vcard') return formatVCard(data as VCardData);
    if (type === 'wifi') return formatWifi(data as WifiData);
    return '';
  }

  const debouncedUpdate = useCallback(
    debounce((newOptions: QrOptions, newQrData: QrData, newQrType: QrType) => {
      if (qrInstance) {
        const dataString = formatDataToString(newQrType, newQrData);
        qrInstance.update({ ...newOptions, data: dataString });
      }
    }, 300),
    [qrInstance] 
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.QRCodeStyling && !qrInstance) {
      const dataString = formatDataToString(qrType, qrData);
      const instance = new window.QRCodeStyling({ ...options, data: dataString });
      setQrInstance(instance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (qrInstance && qrRef.current) {
        qrRef.current.innerHTML = ''; // Clear previous QR code
        qrInstance.append(qrRef.current);
    }
  }, [qrInstance]);

  useEffect(() => {
    debouncedUpdate(options, qrData, qrType);
  }, [options, qrData, qrType, debouncedUpdate]);
  
  const handleDownload = useCallback((extension: Extension, size: number) => {
    if (qrInstance) {
        const downloadOptions = {
            name: 'qr-code',
            extension: extension,
        };
        // Create a temporary options object for download to override size
        const tempOptionsForDownload = {
            ...qrInstance._options,
            width: size,
            height: size,
        };
        const tempInstance = new window.QRCodeStyling(tempOptionsForDownload);
        tempInstance.download(downloadOptions);
    }
  }, [qrInstance]);

  const loadProject = (project: Project) => {
    setQrType(project.qrType);
    setQrData(project.qrData);
    setOptions(project.qrOptions);
    alert(t('studio.project_loaded', { name: project.name }));
  };

  const handleConfirmReset = useCallback(() => {
    setQrType('url');
    setQrData('https://react.dev');
    setOptions(defaultOptions);
    
    if (qrInstance) {
      // Force immediate update with default options, bypassing debounce
      qrInstance.update({
        ...defaultOptions,
        data: 'https://react.dev'
      });
    }
    
    setResetModalOpen(false);
  }, [qrInstance]);
  
  // Expose loadProject to FileManager through window object or context
  useEffect(() => {
    (window as any).loadQrProject = loadProject;
    return () => {
      delete (window as any).loadQrProject;
    }
  }, [t]); // Add `t` to dependencies to ensure the alert uses the correct language

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[45%] xl:w-2/5">
          <OptionsPanel 
              options={options} 
              setOptions={setOptions} 
              qrType={qrType}
              setQrType={setQrType}
              qrData={qrData}
              setQrData={setQrData}
          />
        </div>
        <div className="w-full lg:w-[55%] xl:w-3/5">
          <PreviewPanel 
              qrRef={qrRef}
              handleDownload={handleDownload}
              qrType={qrType}
              qrData={qrData}
              options={options}
              setFileManagerOpen={setFileManagerOpen}
              handleReset={() => setResetModalOpen(true)}
          />
        </div>
      </div>
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title={t('studio.reset_modal.title')}
        confirmButtonText={t('modal.confirm.reset_button')}
      >
        <p>{t('studio.reset_modal.body')}</p>
      </ConfirmModal>
    </>
  );
};

export default QrStudio;
