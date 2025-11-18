'use client';

import { Home, PlusCircle, User, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/search', icon: Search, label: '검색' },
  { href: '/new-course', icon: PlusCircle, label: '코스 생성' },
  { href: '/profile', icon: User, label: '프로필' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-t-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full">
              <item.icon
                className={cn(
                  'h-6 w-6 mb-1',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )}
              />
              <span
                className={cn(
                  'text-xs',
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
