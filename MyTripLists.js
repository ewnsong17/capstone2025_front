import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

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
        return currentDay.toLocaleDateString(); // 각 날짜 반환
    });
};

const MyTripLists = ({ navigation }) => {
    // 여행 추가된 데이터가 반영될 state
    const [trips, setTrips] = useState([
        {
            title: 'A 여행',
            period: '2023-05-01 ~ 2023-05-03',
            withAI: false,
            type: 'past',
        },
        {
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

                {/* 다가오는 여행 목록 렌더링 */}
                {upcomingTrips.length > 0 ? (
                    upcomingTrips.map((trip, index) => {
                        const [startDate, endDate] = trip.period.split(' ~ '); // period에서 시작일과 종료일 분리
                        const days = calculateDays(startDate, endDate); // 날짜 계산

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleTripPress(trip)}
                            >
                                <View style={styles.tripItem}>
                                    <View style={styles.iconContainer}>
                                        <Text style={styles.tripTitleText}>{trip.title}</Text>
                                        {trip.withAI && (
                                            <Image source={require('./assets/aiIcon.png')} style={styles.aiIcon} />
                                        )}
                                    </View>
                                    <Text style={styles.tripPeriod}>{trip.period}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text style={styles.noTripsText}>No upcoming trips yet.</Text>
                )}
            </View>

            {/* 지난 여행 */}
            <View style={styles.pastTripsSection}>
                <Text style={styles.pastTripsTitle}>지난 여행</Text>

                {/* 반복문으로 여행 목록 렌더링 */}
                {trips.map((trip, index) => {
                    const [startDate, endDate] = trip.period.split(' ~ '); // period에서 시작일과 종료일 분리
                    const days = calculateDays(startDate, endDate); // 날짜 계산

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleTripPress(trip)}
                        >
                            <View style={styles.tripItem}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.tripTitleText}>{trip.title}</Text>
                                    {trip.withAI && (
                                        <Image source={require('./assets/aiIcon.png')} style={styles.aiIcon} />
                                    )}
                                </View>
                                <Text style={styles.tripPeriod}>{trip.period}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
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
});

export default MyTripLists;
