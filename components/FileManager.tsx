import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { FolderIcon, CloseIcon, FolderPlusIcon, TrashIcon, EditIcon } from './Icons';
import type { Project, Folder } from '../types';
import { useLanguage } from '../context/LanguageContext';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const FileManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { folders, getProjectsInFolder, addFolder, deleteFolder, addProject, deleteProject } = useAppContext();
  const { t } = useLanguage();
  const [activeFolderId, setActiveFolderId] = useState('default');
  const [newFolderName, setNewFolderName] = useState('');
  const [projectName, setProjectName] = useState('');

  // Make default folder name dynamic
  const localizedFolders = useMemo(() => {
    return folders.map(folder => 
        folder.id === 'default' ? { ...folder, name: t('fileManager.default_folder_name') } : folder
    );
  }, [folders, t]);
  
  const activeFolder = useMemo(() => localizedFolders.find(f => f.id === activeFolderId), [localizedFolders, activeFolderId]);

  const projectsInActiveFolder = useMemo(() => getProjectsInFolder(activeFolderId), [activeFolderId, getProjectsInFolder]);
  
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName);
      setNewFolderName('');
    }
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) {
        alert(t('fileManager.alert.name_required'));
        return;
    }
    const qrToSave = (window as any).qrToSave;
    if (qrToSave) {
        addProject({
            name: projectName,
            folderId: activeFolderId,
            qrType: qrToSave.qrType,
            qrData: qrToSave.qrData,
            qrOptions: qrToSave.options
        });
        alert(t('fileManager.alert.project_saved', { name: projectName, folderName: activeFolder?.name ?? '' }));
        setProjectName('');
        delete (window as any).qrToSave;
    } else {
        alert(t('fileManager.alert.no_qr'));
    }
  };

  const handleLoadProject = (project: Project) => {
    if ((window as any).loadQrProject) {
        (window as any).loadQrProject(project);
        onClose();
    }
  };

  const handleDeleteFolder = (folder: Folder) => {
    if (folder.id === 'default') {
        alert(t('fileManager.folder.cannot_delete_default'));
        return;
    }
    if (window.confirm(t('fileManager.confirm_delete_folder', { name: folder.name }))) {
        deleteFolder(folder.id);
        setActiveFolderId('default');
    }
  };
  
  const handleDeleteProject = (project: Project) => {
    if(window.confirm(t('fileManager.project.confirm_delete', { name: project.name }))) {
        deleteProject(project.id)
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">{t('fileManager.title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('fileManager.close_aria')}><CloseIcon className="w-6 h-6"/></button>
        </header>
        
        <div className="flex-grow flex overflow-hidden">
          <aside className="w-1/3 xl:w-1/4 bg-gray-900/50 p-4 overflow-y-auto border-r border-gray-700">
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder={t('fileManager.new_folder_placeholder')}
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button onClick={handleAddFolder} className="bg-blue-600 p-2 rounded-md hover:bg-blue-700"><FolderPlusIcon className="w-5 h-5"/></button>
            </div>
            <nav className="space-y-1">
              {localizedFolders.map(folder => (
                <button 
                  key={folder.id} 
                  onClick={() => setActiveFolderId(folder.id)}
                  className={cn(
                      'w-full flex items-center justify-between gap-2 p-2 rounded-md text-left text-sm font-medium transition-colors',
                      activeFolderId === folder.id ? 'bg-blue-600/30 text-white' : 'text-gray-300 hover:bg-white/10'
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FolderIcon className="w-5 h-5 flex-shrink-0"/>
                    <span className="truncate">{folder.name}</span>
                  </div>
                  {folder.id !== 'default' && (
                    <button onClick={(e) => {e.stopPropagation(); handleDeleteFolder(folder)}} className="text-red-500/70 hover:text-red-500 flex-shrink-0"><TrashIcon className="w-4 h-4"/></button>
                  )}
                </button>
              ))}
            </nav>
          </aside>
          
          <main className="w-2/3 xl:w-3/4 p-4 flex flex-col overflow-y-auto">
             {!!(window as any).qrToSave && (
                 <div className="bg-green-900/50 border border-green-700 p-3 rounded-lg mb-4 flex-shrink-0">
                    <h3 className="font-semibold text-green-200 mb-2">{t('fileManager.save_prompt.title')}</h3>
                     <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder={t('fileManager.save_prompt.placeholder')}
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-white"
                        />
                        <button onClick={handleSaveProject} className="bg-green-600 px-4 rounded-md hover:bg-green-700 text-sm font-bold">{t('fileManager.save_prompt.button')}</button>
                     </div>
                 </div>
             )}
             
            <h3 className="text-white text-lg font-semibold mb-3 flex-shrink-0">{t('fileManager.folder_title', { name: activeFolder?.name ?? '' })}</h3>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                {projectsInActiveFolder.length === 0 ? (
                    <div className="text-center text-gray-500 pt-10">
                        <p>{t('fileManager.empty_folder.title')}</p>
                        <p className="text-sm">{t('fileManager.empty_folder.body')}</p>
                    </div>
                ) : (
                    projectsInActiveFolder.map(project => (
                        <div key={project.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700/80 transition-colors">
                            <div className="overflow-hidden">
                                <p className="text-white font-medium truncate">{project.name}</p>
                                <p className="text-xs text-gray-400">{t('fileManager.project.type')}: {project.qrType.toUpperCase()} | {t('fileManager.project.created')}: {new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                <button onClick={() => handleLoadProject(project)} className="bg-blue-600 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-700 flex items-center gap-1"><EditIcon className="w-4 h-4"/> {t('fileManager.project.load')}</button>
                                <button onClick={() => handleDeleteProject(project)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FileManager;