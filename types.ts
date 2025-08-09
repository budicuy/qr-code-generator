
import React from 'react';

// QR Code Styling Library Types
export type DotType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
export type CornerSquareType = "square" | "dot" | "extra-rounded";
export type CornerDotType = "square" | "dot";
export type GradientType = "radial" | "linear";
export type Extension = "png" | "jpeg" | "webp" | "svg";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface ColorStops {
  offset: number;
  color: string;
}

export interface Gradient {
  type: GradientType;
  rotation?: number;
  colorStops: ColorStops[];
}

export interface QrOptions {
  width: number;
  height: number;
  data: string;
  margin: number;
  qrOptions: {
    errorCorrectionLevel: ErrorCorrectionLevel;
    typeNumber: number;
    mode: "Numeric" | "Alphanumeric" | "Byte" | "Kanji";
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin?: "anonymous" | "use-credentials";
  };
  dotsOptions: {
    color: string;
    type: DotType;
    gradient?: Gradient;
  };
  backgroundOptions: {
    color: string;
    gradient?: Gradient;
  };
  cornersSquareOptions: {
    color: string;
    type: CornerSquareType | null;
    gradient?: Gradient;
  };
  cornersDotOptions: {
    color: string;
    type: CornerDotType | null;
    gradient?: Gradient;
  };
  image?: string | null;
}

// Application-specific Types
export type QrType = 'url' | 'text' | 'vcard' | 'wifi' | 'pdf' | 'social' | 'app';

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

export interface WifiData {
    ssid: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    password?: string;
    hidden: boolean;
}

export type QrData = string | VCardData | WifiData;

// State Management Types
export interface Template {
    id: string;
    name: string;
    options: Omit<QrOptions, 'width' | 'height' | 'data'>;
}

export interface Project {
    id: string;
    name: string;
    folderId: string;
    qrType: QrType;
    qrData: QrData;
    qrOptions: QrOptions;
    createdAt: string;
}

export interface Folder {
    id: string;
    name: string;
    createdAt: string;
}

export interface AppContextType {
    templates: Template[];
    projects: Project[];
    folders: Folder[];
    addTemplate: (name: string, options: Omit<QrOptions, 'width' | 'height' | 'data'>) => void;
    deleteTemplate: (id: string) => void;
    addFolder: (name: string) => void;
    deleteFolder: (id: string) => void;
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: string) => void;
    getProjectsInFolder: (folderId: string) => Project[];
}

// Manually declare the QRCodeStyling class from the CDN for TypeScript
declare global {
  interface Window {
    QRCodeStyling: any;
  }
}
