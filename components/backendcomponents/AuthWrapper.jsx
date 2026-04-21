'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/store/backendSlice/authAPISlice';
import { setAdminUser, clearAdminUser } from '@/store/backendSlice/adminAuthReducer';

const PUBLIC_PATHS = ['/cubastion-admin/login'];

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    try {
      const userStr = localStorage.getItem('user');
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (userStr && loginTimestamp) {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (Date.now() - parseInt(loginTimestamp, 10) > oneDayInMs) {
          localStorage.removeItem('user');
          localStorage.removeItem('loginTimestamp');
          dispatch(clearAdminUser());
          return;
        }
        // Valid session — rehydrate Redux store
        dispatch(setAdminUser(JSON.parse(userStr)));
      }
    } catch (e) {
      console.error('AuthWrapper rehydration error:', e);
    }
  }, [dispatch]);
  useEffect(() => {
    if (!mounted) return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));
    if (isPublic) return;
    const userStr = localStorage.getItem('user');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (!userStr) {
      router.replace('/cubastion-admin/login');
      return;
    }
    if (loginTimestamp) {
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(loginTimestamp, 10) > oneDayInMs) {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        dispatch(clearAdminUser());
        router.replace('/cubastion-admin/login');
      }
    }
  }, [mounted, pathname, router, dispatch]);

  return <>{children}</>;
}
