import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const onSubmit = async (data) => {
    try {
      // 生年月日をYYYY-MM-DD形式に変換
      const birthDate = new Date(data.birth_date);
      const formattedBirthDate = birthDate.toISOString().split('T')[0];

      const response = await axios.post('http://localhost:8000/register', {
        ...data,
        birth_date: formattedBirthDate
      });

      if (response.status === 200) {
        setShowSuccessPopup(true);
        // 3秒後にログイン画面にリダイレクト
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      setError('登録に失敗しました。入力内容を確認してください。');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              新規登録
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
              <Input
                label="氏名"
                type="text"
                register={register('full_name', { required: true })}
                error={errors.full_name && '氏名は必須です'}
              />
              <Input
                label="メールアドレス"
                type="email"
                register={register('email', { required: true })}
                error={errors.email && 'メールアドレスは必須です'}
              />
              <Input
                label="生年月日"
                type="date"
                register={register('birth_date', { required: true })}
                error={errors.birth_date && '生年月日は必須です'}
              />
              <Input
                label="出身地"
                type="text"
                register={register('hometown')}
              />
              <Input
                label="趣味"
                type="text"
                register={register('hobbies')}
              />
              <Input
                label="所属結婚相談所"
                type="text"
                register={register('matchmaking_agency')}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <Button type="submit" className="w-full">
                登録
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500">
              すでにアカウントをお持ちの方はこちら
            </Link>
          </div>
        </div>
      </div>

      {/* 成功ポップアップ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">登録完了</h3>
            <p className="text-gray-600">登録が完了しました。ログイン画面に移動します。</p>
          </div>
        </div>
      )}
    </Layout>
  );
} 