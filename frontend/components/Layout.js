import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Layout({ children }) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/auth/login' || router.pathname === '/auth/register';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    結婚相談所アプリ
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/profile"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  プロフィール
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/auth/login');
                  }}
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
} 