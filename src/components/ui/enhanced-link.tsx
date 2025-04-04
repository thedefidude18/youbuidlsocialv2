'use client';

import { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface EnhancedLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exactMatch?: boolean;
}

const EnhancedLink = forwardRef<HTMLAnchorElement, EnhancedLinkProps>(
  ({ children, className, activeClassName, exactMatch = false, onClick, ...props }, ref) => {
    const router = useRouter();

    // Prefetch the route on hover
    const handleMouseEnter = () => {
      if (props.href) {
        router.prefetch(props.href.toString());
      }
    };

    // Handle click with custom navigation
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call the original onClick if provided
      if (onClick) {
        onClick(e);
      }

      // If it's an external link or has target="_blank", let the default behavior happen
      if (
        props.target === '_blank' ||
        (typeof props.href === 'string' && (props.href.startsWith('http') || props.href.startsWith('mailto:')))
      ) {
        return;
      }

      // Prevent default for internal navigation
      if (!e.defaultPrevented) {
        e.preventDefault();

        if (props.href) {
          // Use router.push for programmatic navigation
          router.push(props.href.toString());
        }
      }
    };

    return (
      <Link
        {...props}
        ref={ref}
        className={className}
        prefetch={true}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }
);

EnhancedLink.displayName = 'EnhancedLink';

export { EnhancedLink };
