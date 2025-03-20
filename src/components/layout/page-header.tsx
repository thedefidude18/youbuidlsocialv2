'use client';

import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({ title, showBackButton = true, action }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          {showBackButton && (
            <button
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-secondary"
              onClick={() => router.back()}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

