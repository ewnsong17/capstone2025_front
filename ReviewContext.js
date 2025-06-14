import React, { createContext, useContext, useState } from 'react';
import config from './config';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviewsFromServer = async () => {
    try {
      const response = await fetch(`${config.api.base_url}/user/reviewList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ state: 'mine' }) // 혹은 state: 2 등 조건 변경 가능
      });

      const data = await response.json();
      if (data.result) {
        const reviewList = data.review_list;

        // reviewList가 배열이 아니라 객체일 경우: Object.values로 변환
        const parsedList = Array.isArray(reviewList)
          ? reviewList
          : Object.values(reviewList);

        setReviews(parsedList);
        console.log("✅ 리뷰 목록 불러오기 성공", parsedList);
      } else {
        console.warn("❌ 리뷰 목록 불러오기 실패", data.review_list);
      }
    } catch (err) {
      console.error("🔥 서버 연결 실패 (리뷰 목록):", err);
    }
  };

  const updateReview = async (id, content) => {
    try {
      const response = await fetch(`${config.api.base_url}/user/reviewModify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, comment: content })
      });

      const data = await response.json();
      if (data.result) {
        setReviews(prev =>
          prev.map(r => (r.id === id ? { ...r, comment: content } : r))
        );
        console.log("✅ 리뷰 수정 완료");
      } else {
        console.warn("❌ 리뷰 수정 실패", data);
      }
    } catch (err) {
      console.error("🔥 리뷰 수정 요청 실패:", err);
    }
  };

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`${config.api.base_url}/user/reviewRemove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.result) {
        setReviews(prev => prev.filter(r => r.id !== id));
        console.log("✅ 리뷰 삭제 완료");
      } else {
        console.warn("❌ 리뷰 삭제 실패", data);
      }
    } catch (err) {
      console.error("🔥 리뷰 삭제 요청 실패:", err);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        fetchReviewsFromServer,
        updateReview,
        deleteReview
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => useContext(ReviewContext);
