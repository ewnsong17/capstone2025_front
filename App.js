import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from './MainTitle';
import Header from './Header';
import MainPage from './MainPage';
import SearchResults from './SearchResults';
import MyPage from './Inform';
import MyProFile from './MyProFile';
import AITravel from './AITravel';
import { ProfileProvider } from './ProFileContext';
import { ReviewContext, ReviewProvider } from './ReviewContext';
import { LoginProvider } from './LoginContext';
import SignUp from './SignUp';
import MyTripLists from './MyTripLists';
import TripDetails from './TripDetails';
import TripReservation from './TripReservation';
import MyReview from './MyReview'
import NewTripPlans from './NewTripPlans';
import SearchFilteredResults from './SearchFilteredResults';

const Stack = createStackNavigator();

function MainApp({ navigation }) {
    const [currentScreen, setCurrentScreen] = useState('main');
    const [showMyPage, setShowMyPage] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [returnDate, setReturnDate] = useState(null);

    return (
        <View style={styles.container}>
            <Header
                onLogoPress={() => setCurrentScreen('main')}
                onSearchPress={() => setCurrentScreen('search')}
                onOpenMyPage={() => setShowMyPage(true)}
            />

            {currentScreen === 'main' && (
                <MainPage
                    setCurrentScreen={setCurrentScreen}
                    selectedDate={selectedDate}
                    selectedPlace={selectedPlace}
                    returnDate={returnDate}
                    setSelectedDate={setSelectedDate}
                    setSelectedPlace={setSelectedPlace}
                    setReturnDate={setReturnDate}
                />
            )}

            {currentScreen === 'search' && <SearchResults />}
            {currentScreen === 'AITravel' && <AITravel />}
            {currentScreen === 'TripReservation' && (
                <TripReservation
                    selectedDate={selectedDate}
                    selectedPlace={selectedPlace}
                />
            )}
            {currentScreen === 'MyReview' && <MyReview />}

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
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                <LoginProvider>
                    <ProfileProvider>
                        <ReviewProvider>
                            <NavigationContainer>
                                <Stack.Navigator screenOptions={{ headerShown: false }}>
                                    <Stack.Screen name="MainApp" component={MainApp} />
                                    <Stack.Screen name="MyProFile" component={MyProFile} />
                                    <Stack.Screen name="SignUp" component={SignUp} />
                                    <Stack.Screen name="MyTripLists" component={MyTripLists} />
                                    <Stack.Screen name="NewTripPlans" component={NewTripPlans} />
                                    <Stack.Screen name="TripDetails" component={TripDetails} />
                                    <Stack.Screen name="TripReservation" component={TripReservation} />
                                    <Stack.Screen name="MyReview" component={MyReview} />
                                    <Stack.Screen name="SearchFilteredResults" component={SearchFilteredResults} />
                                </Stack.Navigator>
                            </NavigationContainer>
                        </ReviewProvider>
                    </ProfileProvider>
                </LoginProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
