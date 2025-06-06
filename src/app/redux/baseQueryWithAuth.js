import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const VITE_PUBLIC_BASE_URL = import.meta.env.VITE_API_URL || '';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${VITE_PUBLIC_BASE_URL}/api`,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});