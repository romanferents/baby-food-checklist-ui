import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from './auth.store';
import { AuthUser } from './types';

export function useAuth(): {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
} {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  return { isAuthenticated, token, user };
}

export function useAuthActions(): {
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
} {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  return { setAuth, logout };
}

export function useLogout(): () => void {
  const logout = useAuthStore((s) => s.logout);
  return useCallback(() => {
    logout();
  }, [logout]);
}

export function useAuthHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(
    () => useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

  return hasHydrated;
}
