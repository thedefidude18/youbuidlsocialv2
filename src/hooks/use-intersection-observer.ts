'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook to observe when an element enters the viewport
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}): [
  RefObject<HTMLDivElement>,
  boolean,
  IntersectionObserverEntry | null
] {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const frozen = isIntersecting && freezeOnceVisible;

  useEffect(() => {
    // Skip if SSR, no ref, or frozen
    if (typeof window === 'undefined' || !observerRef.current || frozen) {
      return;
    }

    const node = observerRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return [observerRef, isIntersecting, entry];
}
