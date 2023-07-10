import { ConfigService } from '@nestjs/config';

export const isProduction = () =>
  new ConfigService().get('NODE_ENV') === 'production';
export const isDevelopment = () =>
  new ConfigService().get('NODE_ENV') === 'development';

export const REFRESH_TOKEN_KEY = 'Refresh';
export const REFRESH_TOKEN_OPTION = () => ({
  ...(isProduction() ? { domain: process.env.SERVICE_DOMAIN } : {}),
  httpOnly: isProduction(),
  secure: isProduction(),
  maxAge: 2592000000,
});

export function isNumeric(value: any): boolean {
  return !isNaN(value) && !isNaN(parseInt(value));
}
