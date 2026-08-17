import { useState, useEffect } from 'react';

const getCssVariable = (name) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  if (value) return value.trim();
  return null;
};

export const useChartTheme = () => {
  const [theme, setTheme] = useState({
    background: '#0B0F14',
    surface: '#151B23',
    border: '#252B36',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    primary: '#00B8D9',
    secondary: '#FF8A00',
    success: '#22C55E',
    warning: '#FBBF24',
    danger: '#EF4444'
  });

  useEffect(() => {
    const updateTheme = () => {
      setTheme({
        background: getCssVariable('--background') || '#0B0F14',
        surface: getCssVariable('--surface') || '#151B23',
        border: getCssVariable('--border') || '#252B36',
        textPrimary: getCssVariable('--text-primary') || '#FFFFFF',
        textSecondary: getCssVariable('--text-secondary') || '#9CA3AF',
        primary: getCssVariable('--primary') || '#00B8D9',
        secondary: getCssVariable('--secondary') || '#FF8A00',
        success: getCssVariable('--success') || '#22C55E',
        warning: getCssVariable('--warning') || '#FBBF24',
        danger: getCssVariable('--danger') || '#EF4444',
      });
    };

    updateTheme();

    // Observe changes to the html tag for data-theme updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};
