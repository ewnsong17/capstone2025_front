import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

const flightData = [
    { id: '1', name: '항공편 A', date: '2025-05-06', location: '서울', price: 100000 },
    { id: '2', name: '항공편 B', date: '2025-05-06', location: '부산', price: 150000 },
    { id: '3', name: '항공편 C', date: '2025-05-07', location: '제주', price: 130000 },
    { id: '4', name: '항공편 D', date: '2025-05-08', location: '대구', price: 120000 },
    { id: '5', name: '항공편 E', date: '2025-05-09', location: '광주', price: 140000 },
    { id: '6', name: '항공편 F', date: '2025-05-10', location: '인천', price: 110000 },
    { id: '7', name: '항공편 G', date: '2025-05-11', location: '청주', price: 95000 },
    { id: '8', name: '항공편 H', date: '2025-05-12', location: '울산', price: 105000 },
    { id: '9', name: '항공편 I', date: '2025-05-13', location: '서울', price: 115000 },
    { id: '10', name: '항공편 J', date: '2025-05-14', location: '부산', price: 125000 },
];


const hotelData = [
    { id: '11', name: '호텔 A', date: '2025-05-06', location: '제주', price: 80000 },
    { id: '12', name: '호텔 B', date: '2025-05-07', location: '서울', price: 95000 },
    { id: '13', name: '호텔 C', date: '2025-05-08', location: '부산', price: 87000 },
    { id: '14', name: '호텔 D', date: '2025-05-09', location: '대전', price: 91000 },
    { id: '15', name: '호텔 E', date: '2025-05-10', location: '광주', price: 89000 },
    { id: '16', name: '호텔 F', date: '2025-05-11', location: '인천', price: 93000 },
    { id: '17', name: '호텔 G', date: '2025-05-12', location: '청주', price: 86000 },
    { id: '18', name: '호텔 H', date: '2025-05-13', location: '울산', price: 97000 },
    { id: '19', name: '호텔 I', date: '2025-05-14', location: '서울', price: 99000 },
    { id: '20', name: '호텔 J', date: '2025-05-15', location: '제주', price: 92000 },
];

export default function TripReservation({ selectedDate, selectedPlace }) {
    const [currentTab, setCurrentTab] = useState('flight');
    const [sortedData, setSortedData] = useState(flightData);
    const [sortAsc, setSortAsc] = useState(true);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setSortedData(tab === 'flight' ? flightData : hotelData);
    };

    const handleSort = () => {
        const sorted = [...sortedData].sort((a, b) =>
            sortAsc ? a.price - b.price : b.price - a.price
        );
        setSortedData(sorted);
        setSortAsc(!sortAsc);
    };

    return (
        <View style={styles.container}>
            {/* 상단 탭: 항공 / 숙소 */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tab, currentTab === 'flight' && styles.selectedTab]}
                    onPress={() => handleTabChange('flight')}
                >
                    <Text style={styles.tabText}>항공</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, currentTab === 'hotel' && styles.selectedTab]}
                    onPress={() => handleTabChange('hotel')}
                >
                    <Text style={styles.tabText}>숙소</Text>
                </TouchableOpacity>
            </View>

            {/* 날짜 및 필터 */}
            <View style={styles.dateFilterRow}>
                <View style={styles.infoBox}>
                    <Text>선택한 날짜: {selectedDate || '없음'}</Text>
                    <Text>선택한 장소: {selectedPlace || '없음'}</Text>
                </View>
                <TouchableOpacity style={styles.filterIcon}>
                    <Image
                        source={require('./assets/filter.png')}
                        style={styles.filterImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* 정렬 영역 */}
            <View style={styles.sortRow}>
                <Text style={styles.sortLabel}>정렬기준</Text>
                <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
                    <Text style={styles.sortButtonText}>가격순 {sortAsc ? '↓' : '↑'}</Text>
                </TouchableOpacity>
            </View>

            {/* 결과 카드 리스트 */}
            <FlatList
                data={sortedData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardText}>출발일: {item.date}</Text>
                        <Text style={styles.cardText}>출발지: {item.location}</Text>
                        <Text style={styles.cardText}>가격: {item.price.toLocaleString()}원</Text>
                    </View>
                )}
                contentContainerStyle={styles.cardList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        padding: 16,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        backgroundColor: '#87CEEB',
        borderRadius: 12,
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: '#ffc0cb',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateFilterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoBox: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
    },
    filterIcon: {
        padding: 10,
        backgroundColor: '#87CEEB',
        borderRadius: 10,
    },
    icon: {
        fontSize: 18,
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sortLabel: {
        fontSize: 16,
        marginRight: 8,
    },
    sortButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#ffc0cb',
        borderRadius: 8,
    },
    sortButtonText: {
        fontSize: 14,
    },
    cardList: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardText: {
        fontSize: 14,
        color: '#555',
    },
    filterImage: {
        width: 24,
        height: 24,
    },
});