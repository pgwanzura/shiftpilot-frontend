// lib/providers/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { AuthProvider } from './AuthProvider';
import { User } from '@/lib/api/types/auth';

interface ProvidersProps {
  children: React.ReactNode;
  user: User | null;
}

export function Providers({
  children,
  user,
}: ProvidersProps): React.JSX.Element {
  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
