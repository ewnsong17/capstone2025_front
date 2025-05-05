import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// 여행 데이터
const trips = [
    {
        title: 'A 여행',
        period: '2023-05-01 ~ 2023-05-03',
        withAI: false
    },
    {
        title: 'B 여행',
        period: '2023-06-01 ~ 2023-06-05',
        withAI: true
    }
];

// 날짜 계산 함수 (period에서 시작일과 종료일을 계산)
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // 시작일과 종료일의 차이를 구하고 1일 추가
    return Array.from({ length: dayCount }, (_, index) => {
        const currentDay = new Date(start);
        currentDay.setDate(currentDay.getDate() + index);
        return currentDay.toLocaleDateString(); // 각 날짜 반환
    });
};

const MyTripLists = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* 여행 계획 세우기 버튼 */}
            <View style={styles.planSection}>
                <TouchableOpacity style={styles.planButton}>
                    <Text style={styles.planButtonText}>Create New Trip Plan</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.pastTripsSection}>
                <Text style={styles.pastTripsTitle}>지난 여행</Text>

                {/* 반복문으로 여행 목록 렌더링 */}
                {trips.map((trip, index) => {
                    const [startDate, endDate] = trip.period.split(' - '); // period에서 시작일과 종료일 분리
                    const days = calculateDays(startDate, endDate); // 날짜 계산

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() =>
                                navigation.navigate('TripDetails', {
                                    tripTitle: trip.title,
                                    tripPeriod: trip.period,
                                    tripDays: days // 계산된 날짜 전달
                                })
                            }
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
    tripTitle: {
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
    tripTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default MyTripLists;
