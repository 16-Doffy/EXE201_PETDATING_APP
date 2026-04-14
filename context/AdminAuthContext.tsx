import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AdminCredentials, clearStoredAdminCredentials, getStoredAdminCredentials, setStoredAdminCredentials } from '@/services/adminAuth';

type AdminAuthContextValue = {
  credentials: AdminCredentials | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (credentials: AdminCredentials) => void;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCredentials(getStoredAdminCredentials());
    setIsReady(true);
  }, []);

  const signIn = (nextCredentials: AdminCredentials) => {
    setStoredAdminCredentials(nextCredentials);
    setCredentials(nextCredentials);
  };

  const signOut = () => {
    clearStoredAdminCredentials();
    setCredentials(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        credentials,
        isAuthenticated: Boolean(credentials),
        isReady,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
}
