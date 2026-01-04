'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Auto-detect theme based on time of day
  useEffect(() => {
    setMounted(true);
    
    const autoDetectTheme = () => {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 20;
      
      // Solo aplicar auto si no hay preferencia guardada
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'system') {
        setTheme(isDaytime ? 'light' : 'dark');
      }
    };

    autoDetectTheme();

    // Check every hour for theme changes
    const interval = setInterval(autoDetectTheme, 3600000);
    return () => clearInterval(interval);
  }, [setTheme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Evitar error de hidratación - no renderizar hasta que esté montado
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0"
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
      aria-label="Toggle theme"
    >
      {currentTheme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
    </Button>
  );
}

export function ThemeScript() {
  // Script to prevent flash of wrong theme
  const themeScript = `
    (function() {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 20;
      const savedTheme = localStorage.getItem('theme');
      
      if (!savedTheme || savedTheme === 'system') {
        const autoTheme = isDaytime ? 'light' : 'dark';
        document.documentElement.classList.add(autoTheme);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
