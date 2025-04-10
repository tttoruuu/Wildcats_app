import Head from 'next/head';
import Footer from './common/Footer';

export default function Layout({ children, title = 'アプリケーション', hideFooter = false, hideHeader = false }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <Head>
        <title>{title}</title>
        <meta name="description" content="会話練習アプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow pb-16">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
} 