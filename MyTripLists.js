import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import axios from 'axios';
import config from './config';

// 날짜 계산 함수 (period에서 시작일과 종료일을 계산)
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 날짜 유효성 검사 (NaN 검사)
    if (isNaN(start) || isNaN(end)) {
        console.log("잘못된 날짜 형식: ", startDate, endDate); // 잘못된 날짜 출력
        Alert.alert("잘못된 날짜", "시작일과 종료일을 올바르게 입력해주세요.");
        return [];
    }

    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // 시작일과 종료일의 차이를 구하고 1일 추가
    return Array.from({ length: dayCount }, (_, index) => {
        const currentDay = new Date(start);
        currentDay.setDate(currentDay.getDate() + index);
        return currentDay.toLocaleDateSQtring(); // 각 날짜 반환
    });
};

const MyTripLists = ({ navigation }) => {
    // 여행 추가된 데이터가 반영될 state
    useEffect(() => {
        const fetchTripList = async () => {
            try {
                console.log("🚀 [fetchTripList] 여행 목록 요청 시작");

                const response = await fetch(`${config.api.base_url}/user/myTripList`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                console.log("🌐 응답 상태 코드:", response.status);
                console.log("📦 받은 데이터:", data);

                if (data.result === true && data.trip_list) {
                    const tripArray = Object.values(data.trip_list);

                    // 날짜 비교해서 분리
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const upcoming = tripArray.filter(trip => new Date(trip.end_date) >= today);
                    const past = tripArray.filter(trip => new Date(trip.end_date) < today);

                    // 상태에 반영
                    setUpcomingTrips(upcoming);
                    setTrips(past);
                    console.log("✅ 여행 목록 상태 업데이트 완료");
                } else {
                    console.warn("❌ 여행 목록 불러오기 실패");
                }
            } catch (error) {
                console.error("🔥 여행 목록 요청 실패:", error);
            }
        };
        fetchTripList();
    }, []);
    const route = useRoute();
    const [trips, setTrips] = useState([
        {
            id: '1',
            title: 'A 여행',
            period: '2023-05-01 ~ 2023-05-03',
            withAI: false,
            type: 'past',
        },
        {
            id: '2',
            title: 'B 여행',
            period: '2023-06-01 ~ 2023-06-05',
            withAI: true,
            type: 'past',
        }
    ]);

    const [upcomingTrips, setUpcomingTrips] = useState([
        // 다가오는 여행을 추가할 수 있음
    ]);

    // 여행 클릭 시 상세 화면으로 이동
    const handleTripClick = (trip) => {
        navigation.navigate('TripDetails', {
            tripTitle: trip.title,
            tripPeriod: trip.period,
        });
    };

    //슬라이드 시 여행 삭제 가능 함수
    const handleDeleteTrip = async (tripToDelete) => {
        const deleted = await deleteTripFromServer(tripToDelete.id);
        if (!deleted) {
            Alert.alert('삭제 실패', '서버에서 여행을 삭제하지 못했습니다.');
            return;
        }

        if (tripToDelete.type === 'past') {
            setTrips((prev) => prev.filter((trip) => trip.id !== tripToDelete.id));
        } else {
            setUpcomingTrips((prev) => prev.filter((trip) => trip.id !== tripToDelete.id));
        }

        console.log("✅ 로컬 상태에서도 삭제 완료");
    };


    //서버에 여행 삭제 요청 보내기
    const deleteTripFromServer = async (id) => {
        try {
            console.log(`🚀 [Trip Delete] 여행 ID ${id} 삭제 요청`);

            const response = await fetch(`${config.api.base_url}/search/myTripRemove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await response.json();
            console.log("🌐 삭제 응답:", data);

            return data.result === true;
        } catch (error) {
            console.error("🔥 [Trip Delete] 삭제 요청 실패:", error);
            return false;
        }
    };


    // 새로운 여행 추가 함수
    const handleAddTrip = (newTrip) => {
        if (newTrip.type === 'past') {
            setTrips((prev) => [...prev, newTrip]); // 과거 여행에 추가
        } else {
            setUpcomingTrips((prev) => [...prev, newTrip]); // 다가오는 여행에 추가
        }
    };

    // 여행 클릭 시 날짜 계산 후 tripDays 전달
    const handleTripPress = (trip) => {
        const [startDate, endDate] = trip.period.split(' ~ ');
        const days = calculateDays(startDate, endDate);
        if (days.length > 0) {
            navigation.navigate('TripDetails', {
                tripTitle: trip.title,
                tripPeriod: trip.period,
                tripDays: days, // 날짜 전달
            });
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            const newTrip = route.params?.newTrip;
            if (newTrip) {
                if (newTrip.type === 'past') {
                    setTrips((prev) => [...prev, newTrip]);
                } else {
                    setUpcomingTrips((prev) => [...prev, newTrip]);
                }
                // 추가 후 다시 들어올 때 중복 방지
                route.params.newTrip = null;
            }
        }, [route.params?.newTrip])
    );


    return (

        <View style={styles.container}>
            {/* 여행 계획 세우기 버튼 */}
            <View style={styles.planSection}>
                <TouchableOpacity
                    style={styles.planButton}
                    onPress={() => navigation.navigate('NewTripPlans', { handleAddTrip })}
                >
                    <Text style={styles.planButtonText}>Create New Trip Plan</Text>
                </TouchableOpacity>
            </View>

            {/* 다가오는 여행 */}
            <View style={styles.upcomingTripsSection}>
                <Text style={styles.upcomingTripsTitle}>다가오는 여행</Text>

                {upcomingTrips.length > 0 ? (
                    <SwipeListView
                        data={upcomingTrips}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleTripPress(item)}>
                                <View style={styles.tripItem}>
                                    <View style={styles.iconContainer}>
                                        <Text style={styles.tripTitleText}>{item.title}</Text>
                                        {item.withAI && (
                                            <Image source={require('./assets/aiIcon.png')} style={styles.aiIcon} />
                                        )}
                                    </View>
                                    <Text style={styles.tripPeriod}>{item.period}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        renderHiddenItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteTrip(item)}
                            >
                                <Text style={styles.deleteText}>삭제</Text>
                            </TouchableOpacity>
                        )}
                        rightOpenValue={-75}
                        disableRightSwipe
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                ) : (
                    <Text style={styles.noTripsText}>No upcoming trips yet.</Text>
                )}
            </View>


            {/* 지난 여행 */}
            <View style={styles.pastTripsSection}>
                <Text style={styles.pastTripsTitle}>지난 여행</Text>

                <SwipeListView
                    data={trips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleTripPress(item)}>
                            <View style={styles.tripItem}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.tripTitleText}>{item.title}</Text>
                                    {item.withAI && (
                                        <Image source={require('./assets/aiIcon.png')} style={styles.aiIcon} />
                                    )}
                                </View>
                                <Text style={styles.tripPeriod}>{item.period}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    renderHiddenItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTrip(item)}
                        >
                            <Text style={styles.deleteText}>삭제</Text>
                        </TouchableOpacity>
                    )}
                    rightOpenValue={-75}
                    disableRightSwipe
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(230, 230, 250, 0.9)',
    },
    planSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    planButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    planButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    upcomingTripsSection: {
        marginTop: 30,
    },
    upcomingTripsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#87CEEB',
        marginBottom: 10,
    },
    noTripsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    pastTripsSection: {
        marginTop: 30,
    },
    pastTripsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#87CEEB',
        marginBottom: 10,
    },
    tripItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    tripTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tripPeriod: {
        fontSize: 14,
        color: '#777',
    },
    aiIcon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        height: '75%',
        width: 75,
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 8,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MyTripLists;
