'use client';

import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="w-auto h-9 px-3 gap-2"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-semibold uppercase">
        {language === 'es' ? 'ES' : 'EN'}
      </span>
    </Button>
  );
}
