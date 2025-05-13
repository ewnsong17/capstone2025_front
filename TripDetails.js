import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';

// 날짜 차이 계산 함수
const getTripDays = (period) => {
    if (!period) return 0;
    const [start, end] = period.split(' ~ ');
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive
    return diffDays;
};

// 날짜 포맷팅 함수 (yyyy-mm-dd 형식)
const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

const TripDetails = () => {
    const route = useRoute();
    const { tripTitle, tripPeriod } = route.params || {};
    const numDays = getTripDays(tripPeriod);

    const [showModal, setShowModal] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);
    const [newLocation, setNewLocation] = useState('');
    const [locations, setLocations] = useState({}); // 장소를 각 Day에 맞게 저장
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    const handleAddLocation = () => {
        if (!newLocation || !currentDay) return;

        setLocations((prev) => ({
            ...prev,
            [currentDay]: prev[currentDay] ? [...prev[currentDay], { name: newLocation, memo: '' }] : [{ name: newLocation, memo: '' }],
        }));
        setNewLocation('');
        setShowModal(false);
    };

    const handleLocationClick = (location) => {
        setCurrentLocation(location); // 클릭한 장소 설정
        setShowLocationModal(true);
    };

    const handleSaveReview = () => {
        Alert.alert("REVIEW", "리뷰가 성공적으로 작성되었습니다.");
        setShowLocationModal(false);
    };

    const handleDeleteLocation = () => {
        if (currentLocation && currentDay) {
            setLocations((prev) => ({
                ...prev,
                [currentDay]: prev[currentDay].filter((loc) => loc.name !== currentLocation.name),
            }));
        }
        setShowLocationModal(false);
    };

    // 여행 시작 날짜 구하기
    const startDate = new Date(tripPeriod.split(' ~ ')[0]);

    // 각 Day에 해당하는 날짜 계산
    const getDateForDay = (dayIndex) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + dayIndex); // 시작일에 dayIndex만큼 더하기
        return formatDate(date);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.title, { backgroundColor: '#E6E6FA' }]}>{tripTitle}</Text>
            <Text style={styles.dayTitle}>{tripPeriod}</Text>
            <View style={styles.separator} />

            <Text style={styles.title}>지도 삽입</Text>
            <View style={styles.separator} />

            {/* 날짜별 Day 생성 */}
            {Array.from({ length: numDays }).map((_, idx) => {
                const day = `Day ${idx + 1}`;
                const date = getDateForDay(idx); // 각 Day의 날짜 계산

                return (
                    <View key={day} style={styles.daySection}>
                        <Text style={styles.dayTitle}>
                            {day} - {date} {/* 날짜 표시 */}
                        </Text>
                        <View style={styles.separator} />
                        {/* 등록된 장소 버튼 */}
                        {locations[day]?.map((location, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => handleLocationClick(location)}
                                style={styles.locationButton}
                            >
                                <Text style={styles.locationButtonText}>{location.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentDay(day);
                                setNewLocation('');
                                setShowModal(true);
                            }}
                            style={styles.addButton}
                        >
                            <Text style={styles.addButtonText}>장소 추가</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}

            {/* 장소 입력 팝업 */}
            <Modal visible={showModal} transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{currentDay}</Text>
                                <TextInput
                                    placeholder="장소명을 입력하세요"
                                    value={newLocation}
                                    onChangeText={setNewLocation}
                                    style={styles.input}
                                />
                                <TouchableOpacity onPress={handleAddLocation} style={styles.reviewButton}>
                                    <Text style={styles.reviewButtonText}>저장</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* 장소별 메모 모달 */}
            <Modal
                visible={showLocationModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLocationModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowLocationModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.locationModalContent}>
                                <Text style={[styles.locationText, { textAlign: 'center' }]}>{currentLocation?.name}</Text>

                                <TouchableOpacity onPress={handleSaveReview} style={styles.reviewButton}>
                                    <Text style={styles.reviewButtonText}>리뷰 작성</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDeleteLocation} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>삭제</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    daySection: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    dayTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6FA',
        marginVertical: 10,
    },
    addButton: {
        backgroundColor: 'rgba(135, 206, 235, 0.8)', // 80% 불투명도
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    locationButton: {
        backgroundColor: '#E6E6FA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    locationButtonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: 300,
    },
    modalDetailContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxHeight: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        height: 40,
    },
    reviewButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: '#e83559',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    locationModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        position: 'absolute', // 화면 하단에 위치
        bottom: 0, // 화면 하단에 고정
        left: 0,
        right: 0,
        zIndex: 10, // 다른 컴포넌트보다 위에 있도록 설정
    },
    locationText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
});

export default TripDetails;