import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { AppContextType, Template, Project, Folder, QrOptions } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useLocalStorage<Template[]>('qr_templates', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('qr_projects', []);
  const [folders, setFolders] = useLocalStorage<Folder[]>('qr_folders', [{ id: 'default', name: 'Folder Utama', createdAt: new Date().toISOString() }]);

  const addTemplate = useCallback((name: string, options: Omit<QrOptions, 'width' | 'height' | 'data'>) => {
    const newTemplate: Template = { id: crypto.randomUUID(), name, options };
    setTemplates(prev => [...prev, newTemplate]);
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, [setTemplates]);
  
  const addFolder = useCallback((name: string) => {
    const newFolder: Folder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    setFolders(prev => [...prev, newFolder]);
  }, [setFolders]);

  const deleteFolder = useCallback((id: string) => {
    if (id === 'default') {
      console.warn("Attempted to delete the default folder.");
      return;
    }
    setFolders(prev => prev.filter(f => f.id !== id));
    setProjects(prev => prev.filter(p => p.folderId !== id)); // Also delete projects in the folder
  }, [setFolders, setProjects]);

  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = { ...project, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setProjects(prev => [...prev, newProject]);
  }, [setProjects]);
  
  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  }, [setProjects]);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, [setProjects]);

  const getProjectsInFolder = useCallback((folderId: string) => {
    return projects.filter(p => p.folderId === folderId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [projects]);
  

  const value = {
    templates,
    projects,
    folders,
    addTemplate,
    deleteTemplate,
    addFolder,
    deleteFolder,
    addProject,
    updateProject,
    deleteProject,
    getProjectsInFolder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};