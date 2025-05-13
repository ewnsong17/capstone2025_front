import React, { createContext, useState } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([
        {
          id: '4',
          location: '서울',
          title: '좋았어요',
          content: '서울의 야경은 정말 감탄이 절로 나올 정도였습니다. 특히 남산 타워에서 내려다보는 도심은 사진으로 담기 아까울 정도로 아름다웠어요. 음식도 맛있고 대중교통도 편리해서 이동이 쉬웠어요.'
        },
        {
          id: '5',
          location: '부산',
          title: '추천해요',
          content: '광안리 해변에서 석양을 보는 순간, 정말 여행 오길 잘했다는 생각이 들었어요. 조용한 분위기에서 바다를 보며 걷는 산책은 잊을 수 없는 경험이었고, 해산물도 정말 신선했어요'
        },
        {
          id: '6',
          location: '제주',
          title: '또 가고 싶어요',
          content: '제주는 자연과 도시가 잘 어우러진 완벽한 여행지였어요. 특히 성산일출봉에서 본 일출은 평생 기억에 남을 장면이었고, 귤 농장에서 직접 딴 귤도 정말 달고 맛있었습니다..'
        },
        {
          id: '7',
          location: '강릉',
          title: '힐링 그 자체',
          content: '강릉은 조용하고 여유로운 분위기 속에서 진짜 힐링을 할 수 있는 장소였어요. 바다소리를 들으며 커피 한 잔 마시는 그 시간만큼은 세상 모든 걱정을 잊을 수 있었어요'
        },
        {
          id: '8',
          location: '여수',
          title: '낭만적인 밤',
          content: '여수 밤바다를 직접 보니 왜 그렇게 유명한지 알겠더라고요. 조명이 비친 해변과 거리 음악은 정말 로맨틱했고, 여수 특산물로 만든 음식들도 모두 만족스러웠어요.'
        }
      ]);

  const updateReview = (id, newContent) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, content: newContent } : r))
    );
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ReviewContext.Provider value={{ reviews, updateReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
};
