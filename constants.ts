
import type { DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel, Extension, QrType } from './types';
import { UrlIcon, TextIcon, VCardIcon, WifiIcon, PdfIcon, SocialIcon, AppIcon } from './components/Icons';

export const dotStyleOptions: { value: DotType }[] = [
  { value: "square" },
  { value: "dots" },
  { value: "rounded" },
  { value: "extra-rounded" },
  { value: "classy" },
  { value: "classy-rounded" },
];

export const cornerSquareStyleOptions: { value: CornerSquareType }[] = [
  { value: "square" },
  { value: "dot" },
  { value: "extra-rounded" },
];

export const cornerDotStyleOptions: { value: CornerDotType }[] = [
  { value: "square" },
  { value: "dot" },
];

export const errorCorrectionLevelOptions: { value: ErrorCorrectionLevel }[] = [
  { value: "L" },
  { value: "M" },
  { value: "Q" },
  { value: "H" },
];

export const downloadExtensions: { value: Extension }[] = [
    { value: "png" },
    { value: "jpeg" },
    { value: "webp" },
    { value: "svg" },
];

export const qrTypeOptions: { value: QrType, icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { value: 'url', icon: UrlIcon },
    { value: 'text', icon: TextIcon },
    { value: 'vcard', icon: VCardIcon },
    { value: 'wifi', icon: WifiIcon },
    { value: 'pdf', icon: PdfIcon },
    { value: 'social', icon: SocialIcon },
    { value: 'app', icon: AppIcon },
];

export const downloadResolutions: { value: number }[] = [
    { value: 512 },
    { value: 1024 },
    { value: 2048 },
    { value: 4096 },
];
