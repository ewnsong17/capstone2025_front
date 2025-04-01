import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './01';
import Header from './Header';
import MainPage from './02';
import SearchResults from './03';
import MyPage from './04';
import MyProFile from './MyProFile'; 
import AITravel from './AITravel';
import { ProfileProvider } from './ProFileContext';

const Stack = createStackNavigator();

function MainApp({navigation}) {
    const [currentScreen, setCurrentScreen] = useState('main');
    const [showMyPage, setShowMyPage] = useState(false);

    return (
        <View style={styles.container}>
            <Header
                onLogoPress={() => setCurrentScreen('main')}
                onSearchPress={() => setCurrentScreen('search')}
                onOpenMyPage={() => setShowMyPage(true)}
            />

            {currentScreen === 'main' && <MainPage setCurrentScreen={setCurrentScreen} />}
            {currentScreen === 'search' && <SearchResults />}
            {currentScreen === 'AITravel' && <AITravel />}


            {showMyPage && (
                <MyPage
                    isVisible={showMyPage}
                    onClose={() => setShowMyPage(false)}
                />
            )}
        </View>
    );
}

export default function App() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <ProfileProvider>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainApp" component={MainApp} />
                <Stack.Screen name="MyProFile" component={MyProFile} options={{ title: '프로필 편집' }} />
            </Stack.Navigator>
        </NavigationContainer>
        </ProfileProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
