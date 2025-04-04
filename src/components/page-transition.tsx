'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '@/providers/navigation-provider';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { isFirstLoad } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Skip animation on first load
    if (isFirstLoad) {
      setIsVisible(true);
      return;
    }

    // Trigger animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname, isFirstLoad]);

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstLoad ? "visible" : "hidden"}
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-1 will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
