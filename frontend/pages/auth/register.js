import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Input from '../../components/common/Input';
// 一時的にBirthDateInputのインポートをコメントアウト
// import BirthDateInput from '../../components/common/BirthDateInput';
import Button from '../../components/common/Button';
import apiService from '../../services/api';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const onSubmit = async (data) => {
    try {
      console.log('フォームデータ:', data);
      
      // 生年月日の形式を確認
      if (!data.birth_date || !data.birth_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setError('生年月日の形式が正しくありません。例: 1990-01-01');
        return;
      }
      
      // 日付が有効かチェック
      try {
        const birthDate = new Date(data.birth_date);
        if (isNaN(birthDate.getTime())) {
          setError('無効な日付です。正しい日付を入力してください。');
          return;
        }
        console.log('変換された日付オブジェクト:', birthDate);
      } catch (dateError) {
        console.error('日付変換エラー:', dateError);
        setError('日付の形式が正しくありません。YYYY-MM-DD形式で入力してください。');
        return;
      }
      
      // apiService.auth.register()を使用してユーザー登録
      const userData = {
        ...data,
      };
      
      console.log('送信データ:', userData);
      const response = await apiService.auth.register(userData);
      console.log('登録成功:', response);

      // 登録成功時の処理
      setShowSuccessPopup(true);
      // 3秒後にログイン画面にリダイレクト
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      console.error('登録エラー:', err);
      let errorMessage = '登録に失敗しました。入力内容を確認してください。';
      
      // エラーの詳細情報があれば表示
      if (err.detail) {
        errorMessage = `エラー: ${err.detail}`;
      }
      
      // オブジェクト型のエラーの場合、全てのエラーメッセージを表示
      if (err && typeof err === 'object') {
        console.error('詳細なエラー情報:', JSON.stringify(err, null, 2));
        const errorDetails = Object.entries(err)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
          
        if (errorDetails) {
          errorMessage = `エラー: ${errorDetails}`;
        }
      }
      
      setError(errorMessage);
    }
  };

  // BirthDateInputはもう使用しないため、この関数は必要なくなる
  // const handleBirthDateChange = (date) => {
  //   console.log('生年月日が変更されました:', date);
  //   setValue('birth_date', date);
  // };

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
              {/* BirthDateInputコンポーネントの代わりに直接テキスト入力を使用 */}
              <Input
                label="生年月日"
                type="text"
                register={register('birth_date', { required: true })}
                error={errors.birth_date && '生年月日は必須です。YYYY-MM-DD形式（例: 1990-01-01）で入力してください。'}
                placeholder="YYYY-MM-DD（例: 1990-01-01）"
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