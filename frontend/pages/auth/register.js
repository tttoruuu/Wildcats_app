import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import apiService from '../../services/api';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

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

      // apiService.auth.register()を使用してユーザー登録
      const userData = {
        ...data,
        birth_date: formattedBirthDate
      };
      
      const response = await apiService.auth.register(userData);

      // 登録成功時の処理
      setShowSuccessPopup(true);
      // 3秒後にログイン画面にリダイレクト
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      console.error('登録エラー:', err);
      setError('登録に失敗しました。入力内容を確認してください。');
    }
  };

  return (
    <Layout hideFooter={true}>
      <div className="min-h-screen flex flex-col items-center bg-[#F5F5F5] py-12 px-6 relative">
        <div className="w-full max-w-md">
          <button 
            onClick={() => router.push('/auth/login')}
            className="absolute left-6 top-6 text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        
        <div className="max-w-md w-full space-y-8 mt-12">
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
              アカウント登録
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
            <Link href="/auth/login" className="text-sm text-[#FF8551] hover:text-[#FFA46D]">
              すでにアカウントをお持ちの方はこちら
            </Link>
          </div>
        </div>
      </div>

      {/* 成功ポップアップ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-medium text-[#FF8551] mb-4">登録完了</h3>
            <p className="text-gray-600">登録が完了しました。ログイン画面に移動します。</p>
          </div>
        </div>
      )}
    </Layout>
  );
} 