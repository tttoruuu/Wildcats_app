import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Footer() {
  const router = useRouter();
  
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center">
      <footer className="max-w-sm w-full bg-white border-t border-gray-200 rounded-t-lg shadow-lg">
        <div className="flex justify-around items-center h-12 px-2">
          <Link href="/">
            <div className={`flex flex-col items-center ${router.pathname === '/' ? 'text-orange-500' : 'text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px]">Home</span>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className={`flex flex-col items-center ${router.pathname.startsWith('/profile') ? 'text-orange-500' : 'text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px]">Profile</span>
            </div>
          </Link>
        </div>
      </footer>
    </div>
  );
} 