'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAdminUser, clearAdminUser } from '@/store/backendSlice/adminAuthReducer';

const PUBLIC_PATHS = ['/cubastion-admin/login'];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isSessionExpired(loginTimestamp) {
  if (!loginTimestamp) return false;
  return Date.now() - parseInt(loginTimestamp, 10) > ONE_DAY_MS;
}

function getStoredSession() {
  if (typeof window === 'undefined') return { user: null, expired: false };
  try {
    const userStr = localStorage.getItem('user');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (!userStr) return { user: null, expired: false };
    if (isSessionExpired(loginTimestamp)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('loginTimestamp');
      return { user: null, expired: true };
    }
    return { user: JSON.parse(userStr), expired: false };
  } catch {
    return { user: null, expired: false };
  }
}

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const { user, expired } = getStoredSession();
    if (expired) {
      dispatch(clearAdminUser());
      return;
    }
    if (user) {
      dispatch(setAdminUser(user));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;

    const { user } = getStoredSession();
    const isLoggedIn = Boolean(user);
    const isLoginPage = pathname?.startsWith('/cubastion-admin/login');
    const isAdminRoot =
      pathname === '/cubastion-admin' || pathname === '/cubastion-admin/';

    if (isAdminRoot) {
      router.replace(isLoggedIn ? '/cubastion-admin/dashboard' : '/');
      return;
    }

    if (isLoginPage) {
      if (isLoggedIn) {
        router.replace('/cubastion-admin/dashboard');
      }
      return;
    }

    const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));
    if (isPublic) return;

    if (!isLoggedIn) {
      router.replace('/cubastion-admin/login');
    }
  }, [mounted, pathname, router]);

  return <>{children}</>;
}
