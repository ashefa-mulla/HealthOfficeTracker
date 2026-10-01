// Environment configuration for Vite in HO Tracker

export const ENV = {
  PUBLIC_URL: import.meta.env.BASE_URL || '/',
  REACT_APP_DEFAULTAUTH: import.meta.env.VITE_DEFAULTAUTH || 'jwt',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.virtualclinic.md:8443/',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'HO Tracker',
  COMPANY_LOGO: import.meta.env.VITE_COMPANYLOGO || '/src/assets/images/govirtuallogo.svg',
  PROFILE_IMAGE: import.meta.env.VITE_PROFILEIMAGE || '/src/assets/images/profile-img.png',
};
