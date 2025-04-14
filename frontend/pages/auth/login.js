import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Image from 'next/image';
import { authAPI } from '../../services/api';

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ページ読み込み時にトークンの有効性を確認
  useEffect(() => {
    // 既に有効なトークンがある場合は、ホームページにリダイレクト
    const checkAuth = async () => {
      try {
        if (authAPI.validateToken()) {
          console.log('有効なトークンがあります。ホームページにリダイレクトします。');
          router.replace('/');
        }
      } catch (error) {
        console.error('トークン検証エラー:', error);
      }
    };
    
    checkAuth();
  }, [router]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      console.log('ログイン開始:', data.username);
      
      // ログイン処理
      const result = await authAPI.login(data.username, data.password);
      
      if (result && result.access_token) {
        console.log('ログイン成功');
        
        // 成功ポップアップを表示して、短い遅延後にリダイレクト
        setShowSuccessPopup(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError('ログインに失敗しました。もう一度お試しください。');
      }
    } catch (err) {
      console.error('ログインエラー:', err);
      
      // エラーメッセージの設定
      if (err.detail) {
        setError(err.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('ログインに失敗しました。ユーザー名とパスワードをご確認ください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter={true}>
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-6">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 h-48 relative flex justify-center items-center mb-4">
              <Image
                src="/images/logo.png"
                alt="Miraim ロゴ"
                width={160}
                height={160}
                className="object-contain mx-auto"
              />
            </div>
            <h2 className="text-center text-xl font-bold text-[#FF8551]">
              ログイン
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <Input
                label="ユーザー名"
                type="text"
                register={register('username', { required: true })}
                error={errors.username && 'ユーザー名は必須です'}
              />
              <Input
                label="パスワード"
                type="password"
                register={register('password', { required: true })}
                error={errors.password && 'パスワードは必須です'}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF8551] to-[#FFA46D] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8551] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link href="/auth/register" className="text-sm text-[#FF8551] hover:text-[#FFA46D]">
              アカウントをお持ちでない方はこちら
            </Link>
          </div>
        </div>
      </div>

      {/* 成功ポップアップ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-medium text-[#FF8551] mb-4">ログイン成功</h3>
            <p className="text-gray-600">ログインに成功しました。ホーム画面に移動します。</p>
          </div>
        </div>
      )}
    </Layout>
  );
} 