import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './01'; // 스플래시 화면 (01.js)
import Header from './Header';
import MainPage from './02';  // 메인 페이지 (02.js)
import SearchResults from './03'; // 검색 결과 페이지 (03.js)
import MyPage from './04'; // 마이페이지 (04.js)

export default function App() {
    const [showSplash, setShowSplash] = useState(true); // 스플래시 화면 상태
    const [currentScreen, setCurrentScreen] = useState('main'); // 기본 화면: 메인(02.js)
    const [showMyPage, setShowMyPage] = useState(false); // 마이페이지 슬라이드 상태

    useEffect(() => {
        // 2초 후에 스플래시 화면 숨기고 메인 화면으로 이동
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        return () => clearTimeout(timer); // 메모리 누수 방지
    }, []);

    if (showSplash) {
        return <SplashScreen />; // 스플래시 화면 표시
    }

    return (
        <View style={styles.container}>
            {/* 공통 헤더 */}
            <Header 
                onLogoPress={() => setCurrentScreen('main')} 
                onSearchPress={() => setCurrentScreen('search')} 
                onOpenMyPage={() => setShowMyPage(true)} 
            />


            {/* 현재 화면 표시 */}
            {currentScreen === 'main' && <MainPage />}
            {currentScreen === 'search' && <SearchResults />}

            {/* 마이페이지 (04.js) - 오른쪽에서 슬라이드 */}
            {showMyPage && <MyPage isVisible={showMyPage} onClose={() => setShowMyPage(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
