'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function DebugNavigation() {
  const pathname = usePathname();
  const [clicks, setClicks] = useState(0);
  const [lastClick, setLastClick] = useState('');

  // Log navigation events
  useEffect(() => {
    console.log('Navigation state:', {
      pathname,
      clicks,
      lastClick
    });
  }, [pathname, clicks, lastClick]);

  // Add click event listener to all links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        setClicks(prev => prev + 1);
        setLastClick(link.getAttribute('href') || 'unknown');
        console.log('Link clicked:', {
          href: link.getAttribute('href'),
          target: link.getAttribute('target'),
          rel: link.getAttribute('rel'),
          onClick: link.onclick ? 'defined' : 'undefined'
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 bg-black/80 text-white p-2 text-xs rounded">
      <div>Path: {pathname}</div>
      <div>Clicks: {clicks}</div>
      <div>Last: {lastClick}</div>
    </div>
  );
}
