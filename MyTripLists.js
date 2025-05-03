import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

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

                {/* 지난 여행 1 */}
                <View style={styles.tripItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('TripDetails')}>
                        <Text style={styles.tripTitle}>A 여행</Text>
                        <Text style={styles.tripPeriod}>2023년 5월 1일 - 2023년 5월 10일</Text>
                    </TouchableOpacity>
                </View>

                {/* 지난 여행 2 with AI */}
                <View style={styles.tripItem}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.tripTitleText}>B 여행</Text>
                        <Image source={require('./assets/aiIcon.png')} style={styles.aiIcon} />
                    </View>
                    <Text style={styles.tripPeriod}>2023년 6월 1일 - 2023년 6월 7일</Text>
                </View>
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
        backgroundColor: '#87CEEB',  // 메인 컬러
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
        color: '#87CEEB',  // 메인 컬러
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

