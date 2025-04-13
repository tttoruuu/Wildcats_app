'use client';

import React, { useState, useEffect } from 'react';
import { useSpring, animated, AnimatedProps } from '@react-spring/web';
import Confetti from 'react-confetti';

interface Feedback {
  goodPoints?: string[];
  improvementPoints?: string[];
  practicePoints?: string[];
  summary?: string;
  rating?: number;
  encouragement?: string[];
  advice?: string[];
  score?: number;
  chatHistory?: any[];
}

interface FeedbackModalProps {
  feedback: Feedback;
  onClose: () => void;
}

interface SelectedPoint {
  id: string;
  category: string;
  text: string;
  date: string;
}

const feedbackTypes = {
  happy: {
    emoji: "😊",
    title: "すごく自然な会話だった〜！その調子！",
    message: "次はもうちょし踏み込んだ質問にチャレンジしてみよう！",
    color: "#4ade80"
  },
  thinking: {
    emoji: "🤔",
    title: "会話の流れはいい感じ！もう少し深掘りしてみよう！",
    message: "会話の流れはいい感じ！でももう少し相手に関心を持って質問してみよう！",
    color: "#60a5fa"
  },
  shy: {
    emoji: "😅",
    title: "緊張してたけど頑張ってたね！次はリラックスしてみよう！",
    message: "リラックスして話すともっと自然な会話になりそう！",
    color: "#fbbf24"
  },
  confident: {
    emoji: "😎",
    title: "落ち着いて話せていてGood！とてもスムーズな会話だったよ。",
    message: "自信を持って会話を進められていましたね！",
    color: "#f472b6"
  },
  surprised: {
    emoji: "😮",
    title: "面白い発言で場が盛り上がったね！意外性がいい感じ！",
    message: "spontaneousな会話展開ができていて素晴らしいです！",
    color: "#a78bfa"
  }
};

// 会話内容に基づいてフィードバックを生成する関数
const generateFeedback = async (chatHistory: any[]) => {
  try {
    console.log('Sending chat history to API:', chatHistory);
    
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatHistory }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate feedback: ${response.statusText}`);
    }

    const feedback = await response.json();
    console.log('Received feedback from API:', feedback);
    return feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw error;
  }
};

// animatedコンポーネントの型を定義
const AnimatedDiv = animated.div as React.FC<AnimatedProps<React.HTMLAttributes<HTMLDivElement>>>;

export default function FeedbackModal({ feedback, onClose }: FeedbackModalProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>(feedback);
  const [isLoading, setIsLoading] = useState(false);

  // デバッグログ
  useEffect(() => {
    console.log('Received feedback:', feedback);
    console.log('Chat history:', feedback.chatHistory);
  }, [feedback]);

  const getFeedbackType = (score: number) => {
    if (score >= 90) return feedbackTypes.happy;
    if (score >= 70) return feedbackTypes.confident;
    if (score >= 50) return feedbackTypes.thinking;
    if (score >= 30) return feedbackTypes.shy;
    return feedbackTypes.surprised;
  };

  const toggleItemCheck = (category: number, index: number, text: string) => {
    const itemId = `${category}-${index}`;
    
    setCheckedItems(prev => {
      const newChecked = { ...prev };
      newChecked[itemId] = !prev[itemId];
      return newChecked;
    });
    
    setSelectedPoints(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemId);
      
      if (existingIndex >= 0 && prev[existingIndex]) {
        // 項目が既に選択されていれば削除
        return prev.filter(item => item.id !== itemId);
      } else {
        // 新しい項目を追加
        const categoryName = category === 0 ? '良かった点' : category === 1 ? '改善点' : '練習ポイント';
        return [...prev, {
          id: itemId,
          category: categoryName,
          text,
          date: new Date().toISOString()
        }];
      }
    });
  };

  // 初期チェックの設定
  useEffect(() => {
    const newCheckedItems: { [key: string]: boolean } = {};
    const newSelectedPoints: SelectedPoint[] = [];
    
    // 良かった点の設定
    currentFeedback.goodPoints?.forEach((point, i) => {
      const itemId = `0-${i}`;
      newCheckedItems[itemId] = true;
      newSelectedPoints.push({
        id: itemId,
        category: '良かった点',
        text: point,
        date: new Date().toISOString()
      });
    });
    
    // 無ければ代替としてencouragementを使用
    if (!currentFeedback.goodPoints && currentFeedback.encouragement) {
      currentFeedback.encouragement.forEach((point, i) => {
        const itemId = `0-${i}`;
        newCheckedItems[itemId] = true;
        newSelectedPoints.push({
          id: itemId,
          category: '良かった点',
          text: point,
          date: new Date().toISOString()
        });
      });
    }
    
    // 改善点の設定
    currentFeedback.improvementPoints?.forEach((point, i) => {
      const itemId = `1-${i}`;
      newCheckedItems[itemId] = true;
      newSelectedPoints.push({
        id: itemId,
        category: '改善点',
        text: point,
        date: new Date().toISOString()
      });
    });
    
    // 無ければ代替としてadviceを使用
    if (!currentFeedback.improvementPoints && currentFeedback.advice) {
      currentFeedback.advice.forEach((point, i) => {
        const itemId = `1-${i}`;
        newCheckedItems[itemId] = true;
        newSelectedPoints.push({
          id: itemId,
          category: '改善点',
          text: point,
          date: new Date().toISOString()
        });
      });
    }
    
    // 練習ポイントの設定
    currentFeedback.practicePoints?.forEach((point, i) => {
      const itemId = `2-${i}`;
      newCheckedItems[itemId] = true;
      newSelectedPoints.push({
        id: itemId,
        category: '練習ポイント',
        text: point,
        date: new Date().toISOString()
      });
    });
    
    setCheckedItems(newCheckedItems);
    setSelectedPoints(newSelectedPoints);
  }, [currentFeedback]);

  const feedbackType = currentFeedback.rating
    ? getFeedbackType(currentFeedback.rating * 20) // 5段階を100段階に変換
    : currentFeedback.score
      ? getFeedbackType(currentFeedback.score)
      : (currentFeedback.goodPoints?.length ?? 0) >= 5 || (currentFeedback.encouragement?.length ?? 0) >= 5
        ? feedbackTypes.happy
        : feedbackTypes.thinking;

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

  const popIn = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 300, friction: 15 },
    delay: 300
  });

  const slideIn = useSpring({
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: { tension: 280, friction: 20 },
    delay: 500
  });

  const buttonAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
    delay: 800
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const isHighScore = currentFeedback.rating 
      ? currentFeedback.rating >= 4 
      : currentFeedback.score 
        ? currentFeedback.score >= 80 
        : (currentFeedback.goodPoints?.length ?? 0) >= 5 || (currentFeedback.encouragement?.length ?? 0) >= 5;

    if (isHighScore) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentFeedback]);

  // フィードバックの生成
  useEffect(() => {
    const generateAndSetFeedback = async () => {
      try {
        setIsLoading(true);
        // 会話履歴が存在する場合のみフィードバックを生成
        if (feedback.chatHistory && feedback.chatHistory.length > 0) {
          console.log('Generating feedback with chat history:', feedback.chatHistory);
          const newFeedback = await generateFeedback(feedback.chatHistory);
          console.log('Generated feedback details:', {
            rating: newFeedback.rating,
            score: newFeedback.score,
            summary: newFeedback.summary,
            goodPoints: newFeedback.goodPoints?.length,
            improvementPoints: newFeedback.improvementPoints?.length,
            practicePoints: newFeedback.practicePoints?.length,
            encouragement: newFeedback.encouragement?.length,
            advice: newFeedback.advice?.length
          });
          // フィードバック項目の実際の内容を確認
          console.log('Good points:', newFeedback.goodPoints);
          console.log('Improvement points:', newFeedback.improvementPoints);
          console.log('Practice points:', newFeedback.practicePoints);
          setCurrentFeedback({...feedback, ...newFeedback});
        } else {
          console.log('No chat history available for feedback generation');
          throw new Error('No chat history available');
        }
      } catch (error) {
        console.error('Error generating feedback:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    generateAndSetFeedback();
  }, [feedback]);

  // チェックリストに保存する関数
  const saveToChecklist = () => {
    // ローカルストレージに保存（実際のアプリではAPIに送信する）
    const existingData = JSON.parse(localStorage.getItem('feedbackChecklist') || '[]');
    const newData = [...existingData, ...selectedPoints];
    localStorage.setItem('feedbackChecklist', JSON.stringify(newData));
    
    // 保存完了のメッセージ表示などがあると良い
    alert('選択した項目をチェックリストに保存しました！');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">フィードバックを生成中...</p>
        </div>
      </div>
    );
  }

  // フィードバック項目の作成
  const feedbackItems = [
    {
      title: '良かった点',
      emoji: '✨',
      color: 'yellow-50',
      hoverColor: 'yellow-100',
      points: currentFeedback.goodPoints || currentFeedback.encouragement || []
    },
    {
      title: '改善点',
      emoji: '📝',
      color: 'blue-50',
      hoverColor: 'blue-100',
      points: currentFeedback.improvementPoints || currentFeedback.advice || []
    },
    {
      title: '今後の練習ポイント',
      emoji: '🎯',
      color: 'green-50',
      hoverColor: 'green-100',
      points: currentFeedback.practicePoints || []
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#f472b6', '#4ade80', '#60a5fa', '#fbbf24', '#a78bfa']}
        />
      )}

      <AnimatedDiv style={fadeIn} className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2
          className="text-2xl font-bold text-center mb-4"
          style={{ color: feedbackType.color }}
        >
          フィードバック
        </h2>

        <AnimatedDiv style={popIn} className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-2 transform transition-all duration-500 hover:scale-125">
              <div className="text-6xl">{feedbackType.emoji}</div>
            </div>
            <p className="text-lg font-bold text-black">{feedbackType.title}</p>
            <p className="text-sm text-black">{feedbackType.message}</p>
          </div>
        </AnimatedDiv>

        {/* 評価サマリー */}
        {(currentFeedback.summary || currentFeedback.rating) && (
          <AnimatedDiv style={slideIn} className="bg-amber-50 rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">全体評価</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`w-4 h-4 mx-0.5 ${star <= (currentFeedback.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700">
              {currentFeedback.summary || '自然な会話の流れを作ることができていました。相手に興味を示し、適切な質問をすることで会話を発展させることができています。'}
            </p>
          </AnimatedDiv>
        )}

        <p className="text-center text-sm text-black mb-4">気に入った内容はチェックリストに登録して後から見直そう</p>

        {/* フィードバック項目 */}
        {feedbackItems.map((item, categoryIndex) => (
          item.points && item.points.length > 0 && (
            <AnimatedDiv key={categoryIndex} style={slideIn} className={`bg-${item.color} rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <h3 className="text-base font-semibold text-black mb-2 flex items-center">
                <span className="mr-2">{item.emoji}</span>{item.title}
              </h3>
              <div className="space-y-2">
                {item.points.map((point, pointIndex) => (
                  <div 
                    key={pointIndex} 
                    className={`flex items-start gap-2 hover:bg-${item.hoverColor} p-1 rounded transition-colors duration-200`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={!!checkedItems[`${categoryIndex}-${pointIndex}`]}
                      onChange={() => toggleItemCheck(categoryIndex, pointIndex, point)}
                    />
                    <span className="text-sm text-black">{point}</span>
                  </div>
                ))}
              </div>
            </AnimatedDiv>
          )
        ))}

        {/* 選択中の項目数表示 */}
        <div className="text-center text-sm text-gray-600 mb-4">
          選択中: <span className="font-bold text-indigo-600">{selectedPoints.length}</span> 項目
        </div>

        <div className="flex justify-between mt-4">
          <AnimatedDiv style={buttonAnimation}>
            <button
              onClick={saveToChecklist}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition-colors duration-200"
              disabled={selectedPoints.length === 0}
            >
              チェックリストに保存
            </button>
          </AnimatedDiv>
          
          <AnimatedDiv style={buttonAnimation}>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-200 transition-colors duration-200"
            >
              閉じる
            </button>
          </AnimatedDiv>
        </div>
      </AnimatedDiv>
    </div>
  );
} 