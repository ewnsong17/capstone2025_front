import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 기본은 비회원
  const [user, setUser] = useState(null); // 로그인하면 user 객체 저장

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </LoginContext.Provider>
  );
};
