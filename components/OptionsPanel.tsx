
import React, { useState, useCallback } from 'react';
import type { QrOptions, QrType, QrData, VCardData, WifiData, Template } from '../types';
import { dotStyleOptions, cornerSquareStyleOptions, cornerDotStyleOptions, errorCorrectionLevelOptions, qrTypeOptions } from '../constants';
import { ChevronDownIcon, UploadIcon, TrashIcon, SaveIcon, TemplateIcon, DesignIcon, TypeIcon } from './Icons';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

// Helper for class names
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- START: Implemented Missing Components ---

// Generic Form Control Components
const TextInput: React.FC<{ label: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-white" 
        />
    </div>
);

const ColorInput: React.FC<{ label: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement> }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="flex items-center bg-gray-700 border border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
            <input type="color" value={value} onChange={onChange} className="w-10 h-10 p-1 bg-transparent border-none cursor-pointer appearance-none" style={{'backgroundColor': 'transparent'}} />
            <input 
                type="text" 
                value={value} 
                onChange={onChange}
                className="w-full bg-transparent p-2 text-sm text-white focus:outline-none" 
            />
        </div>
    </div>
);

const SelectInput: React.FC<{ label: string, value: any, onChange: React.ChangeEventHandler<HTMLSelectElement>, children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-white">
            {children}
        </select>
    </div>
);

const RangeInput: React.FC<{ label: string, value: number, onChange: React.ChangeEventHandler<HTMLInputElement>, min: number, max: number, step: number }> = ({ label, value, onChange, min, max, step }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <span className="text-sm text-gray-400 bg-gray-900/50 px-2 py-1 rounded">{value}</span>
        </div>
        <input 
            type="range"
            min={min}
            max={max}
            step={step}
            value={value} 
            onChange={onChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" 
        />
    </div>
);

const CheckboxInput: React.FC<{ label: string, checked: boolean, onChange: React.ChangeEventHandler<HTMLInputElement> }> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-300">{label}</span>
    </label>
);

// Type-specific Form Components
const InputForm: React.FC<{ placeholder: string, value: string, onChange: (value: string) => void }> = ({ placeholder, value, onChange }) => {
    const { t } = useLanguage();
    return (
        <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-1">{t('form.url.label')}</label>
            <input
                id="url-input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-white"
            />
        </div>
    );
}

const TextareaForm: React.FC<{ placeholder: string, value: string, onChange: (value: string) => void }> = ({ placeholder, value, onChange }) => {
    const { t } = useLanguage();
    return (
        <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-1">{t('form.text.label')}</label>
            <textarea
                id="text-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-white h-24 resize-y"
            />
        </div>
    );
};

const VCardForm: React.FC<{ data: VCardData, setData: (data: VCardData) => void }> = ({ data, setData }) => {
    const { t } = useLanguage();
    const handleChange = (field: keyof VCardData, value: string) => {
        setData({ ...data, [field]: value });
    };

    return (
        <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-200">{t('form.vcard.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput label={t('form.vcard.firstName')} value={data.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                <TextInput label={t('form.vcard.lastName')} value={data.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                <TextInput label={t('form.vcard.phone')} value={data.phone} onChange={e => handleChange('phone', e.target.value)} />
                <TextInput label={t('form.vcard.email')} value={data.email} onChange={e => handleChange('email', e.target.value)} />
                <TextInput label={t('form.vcard.company')} value={data.company} onChange={e => handleChange('company', e.target.value)} />
                <TextInput label={t('form.vcard.title_job')} value={data.title} onChange={e => handleChange('title', e.target.value)} />
            </div>
            <TextInput label={t('form.vcard.website')} value={data.website} onChange={e => handleChange('website', e.target.value)} />
            <TextInput label={t('form.vcard.address')} value={data.address} onChange={e => handleChange('address', e.target.value)} />
        </div>
    );
};

const WifiForm: React.FC<{ data: WifiData, setData: (data: WifiData) => void }> = ({ data, setData }) => {
    const { t } = useLanguage();
    const handleChange = <K extends keyof WifiData>(field: K, value: WifiData[K]) => {
        setData({ ...data, [field]: value });
    };

    return (
        <div className="space-y-4">
             <h3 className="text-base font-medium text-gray-200">{t('form.wifi.title')}</h3>
            <TextInput label={t('form.wifi.ssid')} value={data.ssid} onChange={e => handleChange('ssid', e.target.value)} />
            <SelectInput 
                label={t('form.wifi.encryption')}
                value={data.encryption} 
                onChange={e => handleChange('encryption', e.target.value as any)}
            >
                <option value='WPA'>{t('form.wifi.encryption_wpa')}</option>
                <option value='WEP'>{t('form.wifi.encryption_wep')}</option>
                <option value='nopass'>{t('form.wifi.encryption_none')}</option>
            </SelectInput>
            {data.encryption !== 'nopass' && (
                 <TextInput label={t('form.wifi.password')} value={data.password || ''} onChange={e => handleChange('password', e.target.value)} />
            )}
            <CheckboxInput label={t('form.wifi.hidden')} checked={data.hidden} onChange={e => handleChange('hidden', e.target.checked)} />
        </div>
    );
};

const ComingSoon: React.FC<{ type: string }> = ({ type }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center p-8 bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white">{t('comingSoon.title')}</h3>
            <p className="text-gray-400 mt-2">{t('comingSoon.body', { type })}</p>
        </div>
    );
};

const TemplatesPanel: React.FC<{
  currentOptions: QrOptions;
  applyTemplate: React.Dispatch<React.SetStateAction<QrOptions>>;
}> = ({ currentOptions, applyTemplate }) => {
  const { templates, addTemplate, deleteTemplate } = useAppContext();
  const { t } = useLanguage();
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert(t('templates.alert.name_required'));
      return;
    }
    const { width, height, data, ...designOptions } = currentOptions;
    addTemplate(templateName, designOptions);
    alert(t('templates.alert.saved', { name: templateName }));
    setTemplateName('');
  };

  const handleApplyTemplate = (template: Template) => {
    applyTemplate(prev => Object.assign({}, prev, template.options));
    alert(t('templates.alert.applied', { name: template.name }));
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('templates.save.title')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t('templates.save.placeholder')}
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-white"
          />
          <button onClick={handleSaveTemplate} className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm px-4 whitespace-nowrap">
            <SaveIcon className="w-5 h-5" /> {t('templates.save.button')}
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('templates.saved.title')}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {templates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">{t('templates.saved.empty')}</p>
          ) : (
            templates.map(template => (
              <div key={template.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                <p className="text-white font-medium truncate">{template.name}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleApplyTemplate(template)} className="text-blue-400 hover:text-blue-300 text-sm font-bold">{t('templates.saved.apply')}</button>
                  <button onClick={() => deleteTemplate(template.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- END: Implemented Missing Components ---


// Accordion Component
const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-200 hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 bg-gray-800/60">{children}</div>}
    </div>
  );
};

// Main OptionsPanel Component
interface ExtendedOptionsPanelProps {
    options: QrOptions;
    setOptions: React.Dispatch<React.SetStateAction<QrOptions>>;
    qrType: QrType;
    setQrType: (type: QrType) => void;
    qrData: QrData;
    setQrData: React.Dispatch<React.SetStateAction<QrData>>;
}

const OptionsPanel: React.FC<ExtendedOptionsPanelProps> = ({ options, setOptions, qrType, setQrType, qrData, setQrData }) => {
  const [activeTab, setActiveTab] = useState<'type' | 'design' | 'templates'>('type');
  const { t } = useLanguage();

  const handleOptionChange = useCallback(<K extends keyof QrOptions>(key: K, value: QrOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, [setOptions]);

  const handleNestedOptionChange = useCallback(<T extends keyof QrOptions, K extends keyof QrOptions[T]>(
    topKey: T,
    nestedKey: K,
    value: QrOptions[T][K]
  ) => {
    setOptions(prev => {
      const optionValue = prev[topKey];
      if (typeof optionValue === 'object' && optionValue !== null) {
        return {
          ...prev,
          [topKey]: {
            ...optionValue,
            [nestedKey]: value
          }
        };
      }
      return prev;
    });
  }, [setOptions]);
  
  const handleQrTypeChange = (type: QrType) => {
      setQrType(type);
      // Reset data to default for the new type
      switch(type) {
          case 'url': setQrData('https://'); break;
          case 'text': setQrData(''); break;
          case 'vcard': setQrData({firstName: '', lastName: '', phone: '', email: '', company: '', title: '', website: '', address: ''}); break;
          case 'wifi': setQrData({ssid: '', encryption: 'WPA', password: '', hidden: false}); break;
          default: setQrData(''); break;
      }
  }

  const forms: Record<QrType, React.ReactNode> = {
      url: <InputForm placeholder={t('form.url.placeholder')} value={qrData as string} onChange={setQrData} />,
      text: <TextareaForm placeholder={t('form.text.placeholder')} value={qrData as string} onChange={setQrData} />,
      vcard: typeof qrData === 'object' && qrData && 'firstName' in qrData ? <VCardForm data={qrData} setData={(d) => setQrData(d)} /> : null,
      wifi: typeof qrData === 'object' && qrData && 'ssid' in qrData ? <WifiForm data={qrData} setData={(d) => setQrData(d)} /> : null,
      pdf: <ComingSoon type={t('qrType.pdf')} />,
      social: <ComingSoon type={t('qrType.social')} />,
      app: <ComingSoon type={t('qrType.app')} />,
  }
  
  const tabs = [
    { id: 'type', label: t('tabs.type'), icon: TypeIcon },
    { id: 'design', label: t('tabs.design'), icon: DesignIcon },
    { id: 'templates', label: t('tabs.templates'), icon: TemplateIcon },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="grid grid-cols-3 gap-1 bg-gray-900/50 p-1 rounded-md">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-300 hover:bg-white/10'
              )}
            >
              <tab.icon className="w-5 h-5"/>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'type' && <TypePanel qrType={qrType} setQrType={handleQrTypeChange} formNode={forms[qrType]} />}
      {activeTab === 'design' && <DesignPanel options={options} handleNestedOptionChange={handleNestedOptionChange} handleOptionChange={handleOptionChange} />}
      {activeTab === 'templates' && <TemplatesPanel currentOptions={options} applyTemplate={setOptions}/>}
    </div>
  );
};

// Type Panel Component
const TypePanel: React.FC<{qrType: QrType, setQrType: (type: QrType) => void, formNode: React.ReactNode}> = ({qrType, setQrType, formNode}) => {
    const { t } = useLanguage();
    return (
        <div>
            <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('typePanel.title')}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 text-center">
                    {qrTypeOptions.map(opt => (
                        <button key={opt.value} onClick={() => setQrType(opt.value)} className={cn('flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200', qrType === opt.value ? 'bg-blue-600 text-white scale-105 shadow-lg' : 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white')}>
                            <opt.icon className="w-6 h-6"/>
                            <span className="text-xs font-medium">{t(`qrType.${opt.value}`)}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4 border-t border-gray-700">
                {formNode}
            </div>
        </div>
    );
};


// Design Panel Component
const DesignPanel: React.FC<{options: QrOptions, handleNestedOptionChange: Function, handleOptionChange: Function}> = ({options, handleNestedOptionChange, handleOptionChange}) => {
  const { t } = useLanguage();
    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleOptionChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

    return (
        <div>
            <AccordionItem title={t('design.accordion.colors')} defaultOpen>
                <div className="grid grid-cols-2 gap-4">
                    <ColorInput label={t('design.colors.background')} value={options.backgroundOptions.color} onChange={(e) => handleNestedOptionChange('backgroundOptions', 'color', e.target.value)} />
                    <ColorInput label={t('design.colors.dots')} value={options.dotsOptions.color} onChange={(e) => handleNestedOptionChange('dotsOptions', 'color', e.target.value)} />
                    <ColorInput label={t('design.colors.cornerSquare')} value={options.cornersSquareOptions.color} onChange={(e) => handleNestedOptionChange('cornersSquareOptions', 'color', e.target.value)} />
                    <ColorInput label={t('design.colors.cornerDot')} value={options.cornersDotOptions.color} onChange={(e) => handleNestedOptionChange('cornersDotOptions', 'color', e.target.value)} />
                </div>
            </AccordionItem>
            <AccordionItem title={t('design.accordion.shapes')}>
                <div className="space-y-4">
                    <SelectInput label={t('design.shapes.dotStyle')} value={options.dotsOptions.type} onChange={(e) => handleNestedOptionChange('dotsOptions', 'type', e.target.value)}>
                        {dotStyleOptions.map(opt => <option key={opt.value} value={opt.value}>{t(`dot_style.${opt.value.replace('-', '_')}`)}</option>)}
                    </SelectInput>
                    <SelectInput label={t('design.shapes.cornerSquareStyle')} value={options.cornersSquareOptions.type ?? ''} onChange={(e) => handleNestedOptionChange('cornersSquareOptions', 'type', e.target.value)}>
                        {cornerSquareStyleOptions.map(opt => <option key={opt.value} value={opt.value}>{t(`corner_square_style.${opt.value.replace('-', '_')}`)}</option>)}
                    </SelectInput>
                    <SelectInput label={t('design.shapes.cornerDotStyle')} value={options.cornersDotOptions.type ?? ''} onChange={(e) => handleNestedOptionChange('cornersDotOptions', 'type', e.target.value)}>
                        {cornerDotStyleOptions.map(opt => <option key={opt.value} value={opt.value}>{t(`corner_dot_style.${opt.value.replace('-', '_')}`)}</option>)}
                    </SelectInput>
                </div>
            </AccordionItem>
            <AccordionItem title={t('design.accordion.logo')}>
                <div className="space-y-4">
                    <label htmlFor="file-upload" className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        <span>{options.image ? t('design.logo.change') : t('design.logo.upload')}</span>
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" />
                    {options.image && <button onClick={() => handleOptionChange('image', null)} className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"><TrashIcon className="w-4 h-4"/>{t('design.logo.remove')}</button>}
                    <RangeInput label={t('design.logo.size')} value={options.imageOptions.imageSize} onChange={(e) => handleNestedOptionChange('imageOptions', 'imageSize', parseFloat(e.target.value))} min={0.1} max={0.7} step={0.05} />
                    <RangeInput label={t('design.logo.margin')} value={options.imageOptions.margin} onChange={(e) => handleNestedOptionChange('imageOptions', 'margin', parseInt(e.target.value))} min={0} max={20} step={1} />
                    <CheckboxInput label={t('design.logo.hideDots')} checked={options.imageOptions.hideBackgroundDots} onChange={(e) => handleNestedOptionChange('imageOptions', 'hideBackgroundDots', e.target.checked)} />
                </div>
            </AccordionItem>
            <AccordionItem title={t('design.accordion.advanced')}>
                 <div className="space-y-4">
                    <RangeInput label={t('design.advanced.margin')} value={options.margin} onChange={(e) => handleOptionChange('margin', Number(e.target.value))} min={0} max={50} step={2}/>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">{t('design.advanced.errorCorrection')}</label>
                      <select value={options.qrOptions.errorCorrectionLevel} onChange={(e) => handleNestedOptionChange('qrOptions', 'errorCorrectionLevel', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-white">
                        {errorCorrectionLevelOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{t(`ecl.${opt.value}`)}</option>
                         ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-2">{t(`ecl.${options.qrOptions.errorCorrectionLevel}.desc`)}</p>
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default OptionsPanel;
