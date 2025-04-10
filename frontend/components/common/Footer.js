import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, User } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100/70 py-4 shadow-sm">
      <div className="max-w-md mx-auto px-6">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center">
            <HomeIcon className={`w-6 h-6 ${router.pathname === '/' ? 'text-[#FF8551]' : 'text-gray-400'}`} />
            <span className={`text-xs mt-1 ${router.pathname === '/' ? 'text-[#FF8551]' : 'text-gray-400'}`}>ホーム</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center">
            <User className={`w-6 h-6 ${router.pathname.startsWith('/profile') ? 'text-[#FF8551]' : 'text-gray-400'}`} />
            <span className={`text-xs mt-1 ${router.pathname.startsWith('/profile') ? 'text-[#FF8551]' : 'text-gray-400'}`}>プロフィール</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 