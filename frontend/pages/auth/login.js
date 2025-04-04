import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const onSubmit = async (data) => {
    try {
      console.log('ログイン開始:', data.username);
      const response = await axios.post('http://localhost:8000/login', data);
      console.log('ログイン応答:', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        console.log('トークンをローカルストレージに保存:', response.data.access_token);
        setShowSuccessPopup(true);
        // 3秒後にホーム画面にリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('ログインに失敗しました。ユーザー名とパスワードを確認してください。');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Link href="/auth/register" className="text-sm text-blue-600 hover:text-blue-500">
              アカウントをお持ちでない方はこちら
            </Link>
          </div>
        </div>
      </div>

      {/* 成功ポップアップ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ログイン成功</h3>
            <p className="text-gray-600">ログインに成功しました。ホーム画面に移動します。</p>
          </div>
        </div>
      )}
    </Layout>
  );
} 