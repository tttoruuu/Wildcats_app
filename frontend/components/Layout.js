import Head from 'next/head';
import Header from './common/Header';
import Footer from './common/Footer';

export default function Layout({ children, title = 'アプリケーション' }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="会話練習アプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16">
        {children}
      </main>

      <Footer />
    </div>
  );
} 