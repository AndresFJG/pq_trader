'use client';

import { usePathname } from 'next/navigation';
import { FloatingButtons } from '@/components/ui/FloatingButtons';
import { CookieBanner } from '@/components/legal/CookieBanner';
import { AIChat } from '@/components/chat/AIChat';

export function ConditionalUI() {
  const pathname = usePathname();
  
  // No mostrar en rutas de admin, login, dashboard
  const hideUI = pathname?.startsWith('/admin') || 
                 pathname?.startsWith('/login') || 
                 pathname?.startsWith('/dashboard');

  if (hideUI) {
    return null;
  }

  return (
    <>
      <FloatingButtons />
      <CookieBanner />
      <AIChat />
    </>
  );
}
