'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

type AuthGuardProps = {
  children: React.ReactNode;
  requireAuth: boolean;
  requiredRole?: 'admin' | 'client';
};

export const AuthGuard = ({ children, requireAuth, requiredRole }: AuthGuardProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Extract user role from Keycloak roles
  const userRoles = session?.user?.roles || [];
  const userRole = userRoles.includes('admin') ? 'admin' : 'client';

  useEffect(() => {
    if (isLoading) return;

    const checkAuth = () => {
      // Si requiere autenticación y no está autenticado
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
        return;
      }

      // Si no requiere autenticación pero está autenticado
      if (!requireAuth && isAuthenticated) {
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user-panel');
        }
        return;
      }

      // Verificar rol si es necesario
      if (requireAuth && isAuthenticated && requiredRole) {
        if (userRole !== requiredRole) {
          // Redirigir al panel correspondiente si el rol no coincide
          if (userRole === 'admin') {
            router.push('/admin');
          } else {
            router.push('/user-panel');
          }
          return;
        }
      }
    };

    checkAuth();
  }, [requireAuth, requiredRole, router, isAuthenticated, isLoading, userRole]);

  // Mostrar loading mientras se carga la sesión
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Si después de cargar, la autenticación no cumple los requisitos, no renderizar
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
