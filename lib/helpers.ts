import type { VCardData, WifiData } from '../types';

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
}

export function formatVCard(data: VCardData): string {
    return `BEGIN:VCARD
VERSION:3.0
N:${data.lastName};${data.firstName}
FN:${data.firstName} ${data.lastName}
ORG:${data.company}
TITLE:${data.title}
TEL;TYPE=WORK,VOICE:${data.phone}
EMAIL:${data.email}
URL:${data.website}
ADR;TYPE=WORK:;;${data.address}
END:VCARD`;
}

export function formatWifi(data: WifiData): string {
    const password = data.password ? `P:${data.password};` : '';
    const hidden = data.hidden ? 'H:true;' : '';
    return `WIFI:T:${data.encryption};S:${data.ssid};${password}${hidden};`;
}
