/** @format */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import config from '@/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAbsoluteUrl(path: string): string {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://${config.domainName}`;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
