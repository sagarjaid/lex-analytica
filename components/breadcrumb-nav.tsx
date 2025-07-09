/** @format */

'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label='breadcrumb'>
      <ol className='flex items-center w-full gap-1.5 text-sm pb-4 md:pb-2 text-muted-foreground overflow-x-auto whitespace-nowrap transition-colors min-w-0 pr-4'>
        {items.map((item, index) => (
          <li
            key={item.label}
            className='flex items-center flex-shrink-0 min-w-0'>
            {index > 0 && <span className='mx-2 text-border'>&gt;</span>}
            {item.href ? (
              <Link
                href={item.href}
                className='hover:text-foreground transition-colors whitespace-nowrap overflow-hidden text-ellipsis'>
                {item.label}
              </Link>
            ) : (
              <span className='text-foreground/80  whitespace-nowrap overflow-hidden text-ellipsis'>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
