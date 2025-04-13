import { useState, useEffect } from 'react';

export default function BirthDateInput({ register, onChange, error }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [internalError, setInternalError] = useState('');

  // 年の選択肢（現在から100年前まで）
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  // 月の選択肢
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // 日の選択肢（月と年によって変わる）
  const [days, setDays] = useState([]);
  
  // 選択された年と月に基づいて、日の選択肢を更新
  useEffect(() => {
    if (year && month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
      
      // 選択された日が月の日数より大きい場合、日をリセット
      if (day && parseInt(day) > daysInMonth) {
        setDay('');
      }
    } else {
      setDays(Array.from({ length: 31 }, (_, i) => i + 1));
    }
  }, [year, month, day]);
  
  // 値が変更されたときに、親コンポーネントに通知
  useEffect(() => {
    if (year && month && day) {
      try {
        // YYYY-MM-DD形式に変換
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        const dateString = `${year}-${formattedMonth}-${formattedDay}`;
        
        // 日付が有効かどうかを確認
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) {
          console.error('無効な日付:', dateString);
          setInternalError('無効な日付です');
          return;
        }
        
        // 日付の検証：年、月、日が一致するか確認
        const actualYear = dateObj.getFullYear();
        const actualMonth = dateObj.getMonth() + 1; // JavaScriptの月は0から始まる
        const actualDay = dateObj.getDate();
        
        if (actualYear !== parseInt(year) || 
            actualMonth !== parseInt(month) || 
            actualDay !== parseInt(day)) {
          console.error('日付の不一致:', dateString, actualYear, actualMonth, actualDay);
          setInternalError('無効な日付です');
          return;
        }
        
        // エラーをクリア
        setInternalError('');
        
        // 日付値を更新
        setDateValue(dateString);
        
        // 親コンポーネントに通知
        if (onChange) {
          onChange(dateString);
        }
      } catch (err) {
        console.error('日付変換エラー:', err);
        setInternalError('日付変換エラー');
      }
    } else {
      // 必須フィールドが入力されていない場合
      setDateValue('');
      setInternalError('');
    }
  }, [year, month, day, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        生年月日
      </label>
      <div className="grid grid-cols-3 gap-2">
        {/* 年の選択 */}
        <div>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`appearance-none block w-full px-3 py-2 border ${
              internalError ? 'border-red-300' : 'border-gray-300'
            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF8551] focus:border-[#FF8551] sm:text-sm`}
            required
          >
            <option value="">年</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>
        
        {/* 月の選択 */}
        <div>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={`appearance-none block w-full px-3 py-2 border ${
              internalError ? 'border-red-300' : 'border-gray-300'
            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF8551] focus:border-[#FF8551] sm:text-sm`}
            required
          >
            <option value="">月</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
        
        {/* 日の選択 */}
        <div>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={`appearance-none block w-full px-3 py-2 border ${
              internalError ? 'border-red-300' : 'border-gray-300'
            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF8551] focus:border-[#FF8551] sm:text-sm`}
            required
          >
            <option value="">日</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 内部エラーメッセージ */}
      {internalError && (
        <p className="mt-1 text-sm text-red-600">{internalError}</p>
      )}
      
      {/* 隠しフィールド - フォーム送信用 */}
      <input 
        type="hidden" 
        value={dateValue}
        {...register}
      />
      
      {/* 外部エラーメッセージ */}
      {error && !internalError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 