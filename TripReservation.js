import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { getAmadeusAccessToken, searchFlights, searchHotels } from './amadeus';

export default function TripReservation({ route }) {
    const { originPlace, destinationPlace, selectedDate, returnDate } = route.params;
    const [currentTab, setCurrentTab] = useState('flight');
    const [sortAsc, setSortAsc] = useState(true);
    const [flightResults, setFlightResults] = useState([]);
    const [hotelResults, setHotelResults] = useState([]);
    const [sortType, setSortType] = useState('price'); // 정렬 기준: 'price'만 사용 중
    const rawData = currentTab === 'flight' ? flightResults : hotelResults;
    const [filterOption, setFilterOption] = useState('전체');

    const cityToIATACode = {
        서울: 'ICN',
        인천: 'ICN',
        부산: 'PUS',
        제주: 'CJU',
        대구: 'TAE',
        광주: 'KWJ',
        대전: 'ICN',     // 대전은 공항이 없으므로 인천으로 처리
        미국: 'JFK',
        일본: 'NRT',
        프랑스: 'CDG',
        영국: 'LHR',
        독일: 'FRA',
        이탈리아: 'FCO'
    };

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setSortType('price');       // 정렬 기준 초기화
        setSortAsc(true);           // 정렬 방향 초기화
    };

    const sortedFlightResults = [...flightResults].sort((a, b) => {
        const priceA = parseFloat(a.price?.total || 0);
        const priceB = parseFloat(b.price?.total || 0);
        return sortAsc ? priceA - priceB : priceB - priceA;
    });

    const sortedHotelResults = [...hotelResults]
        .sort((a, b) => {
            const priceA = parseFloat(a.offers?.[0]?.price?.total || 0);
            const priceB = parseFloat(b.offers?.[0]?.price?.total || 0);
            return sortAsc ? priceA - priceB : priceB - priceA;
        });

    const handleSort = (type) => {
        if (sortType === type) {
            setSortAsc(!sortAsc); // 같은 항목이면 오름/내림 토글
        } else {
            setSortType(type);     // 새로운 정렬 항목이면 교체
            setSortAsc(true);      // 초기엔 오름차순
        }
    };

    useEffect(() => {
        const originCode = cityToIATACode[originPlace];
        const destinationCode = cityToIATACode[destinationPlace];

        const fetchData = async () => {
            const token = await getAmadeusAccessToken();
            if (!token) return;

            if (currentTab === 'flight') {
                const results = await searchFlights(originCode, destinationCode, selectedDate, token);
                console.log("✈️ 항공 검색 결과:", results);
                setFlightResults(results?.data || [])
            } else {
                const results = await searchHotels(destinationCode, selectedDate, returnDate, token);
                console.log("🏨 숙소 검색 결과:", results);
                setHotelResults(results?.data || []);

            }
        };

        if (originCode && destinationCode && selectedDate && returnDate) {
            fetchData();
        }
    }, [currentTab, originPlace, destinationPlace, selectedDate, returnDate]);



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
                    <Text>선택한 출발 날짜: {selectedDate || '없음'}</Text>
                    <Text>선택한 도착 날짜: {returnDate || '없음'}</Text>
                    <Text>선택한 출발지: {originPlace || '없음'}</Text>
                    <Text>선택한 도착지: {destinationPlace || '없음'}</Text>
                </View>
            </View>
            <View style={styles.filterSortRow}>
                {/* 정렬 기준: 가격*/}
                <View style={styles.sortRow}>
                    <Text style={styles.sortLabel}>정렬기준</Text>
                    <TouchableOpacity
                        style={[
                            styles.sortButton,
                            sortType === 'price' && { backgroundColor: '#ffc0cb' }  // 선택된 상태 강조
                        ]}
                        onPress={() => handleSort('price')}
                    >
                        <Text style={styles.sortButtonText}>
                            가격 {sortType === 'price' ? (sortAsc ? '▲' : '▼') : ''}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 결과 카드 리스트 */}
            {currentTab === 'flight' ? (
                Array.isArray(flightResults) && flightResults.length > 0 ? (
                    <FlatList
                        data={sortedFlightResults}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={({ item }) => {
                            const firstSegment = item.itineraries?.[0]?.segments?.[0];
                            const lastSegment = item.itineraries?.[0]?.segments?.slice(-1)[0];
                            const departIATA = firstSegment?.departure?.iataCode || '알 수 없음';
                            const arriveIATA = lastSegment?.arrival?.iataCode || '알 수 없음';
                            const departureDate = firstSegment?.departure?.at?.split('T')[0] || '알 수 없음';
                            const airlineCode = item.validatingAirlineCodes?.[0] || '알 수 없음';
                            const currency = item.price?.currency || '알 수 없음';
                            const price = parseFloat(item.price?.total || 0);


                            return (
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>항공사 코드: {airlineCode}</Text>
                                    <Text>출발 공항: {departIATA}</Text>
                                    <Text>도착 공항: {arriveIATA}</Text>
                                    <Text>출발 날짜: {departureDate}</Text>
                                    <Text>가격: {price.toLocaleString()} {currency}</Text>
                                </View>
                            );
                        }}
                    />
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
                        조건에 맞는 항공권이 없습니다.
                    </Text>
                )
            ) : (
                Array.isArray(sortedHotelResults) && sortedHotelResults.length >= 0 ? (
                    <FlatList
                        data={sortedHotelResults}
                        keyExtractor={(item, index) => item.hotel?.hotelId || index.toString()}
                        renderItem={({ item }) => {
                            if (!item.hotel) return null;

                            const name = item.hotel?.name || '이름 없음';

                            const rawAddress = item.hotel?.address || {};
                            const address = rawAddress?.lines?.join(', ')
                                || [rawAddress?.cityName, rawAddress?.postalCode, rawAddress?.countryCode]
                                    .filter(Boolean)
                                    .join(' ')
                                || '주소 없음';

                            const offer = item.offers?.[0];
                            const price = parseFloat(offer?.price?.total || 0);
                            const currency = offer?.price?.currency || '알 수 없음';

                            const imageUrl = item.hotel?.media?.[0]?.uri;

                            return (
                                <View style={styles.card}>
                                    {imageUrl ? (
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={{
                                                width: '100%',
                                                height: 120,
                                                borderRadius: 8,
                                                marginBottom: 8
                                            }}
                                        />
                                    ) : (
                                        <Text style={{ fontSize: 12, color: 'gray', marginBottom: 8 }}>
                                            📷 이미지 없음
                                        </Text>
                                    )}
                                    <Text style={styles.cardTitle}>{name}</Text>
                                    <Text>{address}</Text>
                                    <Text>가격: {price.toLocaleString()} {currency}</Text>
                                </View>
                            );
                        }}
                    /> 
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
                        조건에 맞는 숙소가 없습니다.
                    </Text>
                )
            )}
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
    icon: {
        fontSize: 18,
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
    sortGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 8,
        marginBottom: 10,
    },
    filterSortRow: {
        marginVertical: 10,
        gap: 10,
    },
    filterGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        gap: 8,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#87CEEB',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    sortButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#87CEEB',
        borderRadius: 8,
    },
    sortButtonText: {
        fontSize: 14,
    },
    sortLabel: {
        fontSize: 16,
        marginRight: 4,
    },

});