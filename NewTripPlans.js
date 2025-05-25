import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import config from './config';

const NewTripPlans = ({ navigation, route }) => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    const [isEndPickerVisible, setEndPickerVisible] = useState(false);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 두 자리로 맞추기
        const day = date.getDate().toString().padStart(2, '0'); // 두 자리로 맞추기
        return `${year}-${month}-${day}`;
    };

    const handleSaveTrip = async () => {
        if (!destination.trim() || !startDate || !endDate) {
            Alert.alert('빈칸을 채워주세요');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        const isPast = end < today;

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const requestBody = {
            name: `${destination} 여행`,
            type: 1,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            country: destination || 'Korea'
        };

        try {
            console.log("🚀 [Trip Add] 여행 추가 요청:", requestBody);

            const response = await fetch(`${config.api.base_url}/user/myTripAdd`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log("🌐 응답:", data);

            if (data.result === true) {
                Alert.alert('여행이 성공적으로 추가되었습니다!');
                navigation.navigate('MyTripLists'); // 목록 화면으로 이동
            } else {
                Alert.alert('여행 추가 실패', '서버 응답이 실패로 표시됨');
            }
        } catch (error) {
            console.error("🔥 [Trip Add] 여행 추가 요청 실패:", error);
            Alert.alert('서버 통신 오류', '여행을 추가할 수 없습니다.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>New Trip Plan</Text>

                <Text style={styles.label}>여행 장소</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Travel Destination"
                    value={destination}
                    onChangeText={setDestination}
                />

                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setStartPickerVisible(true)}
                >
                    <Text>{formatDate(startDate)}</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isStartPickerVisible}
                    mode="date"
                    onConfirm={(date) => {
                        setStartDate(date);
                        setStartPickerVisible(false);
                    }}
                    onCancel={() => setStartPickerVisible(false)}
                />

                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setEndPickerVisible(true)}
                >
                    <Text>{formatDate(endDate)}</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isEndPickerVisible}
                    mode="date"
                    onConfirm={(date) => {
                        setEndDate(date);
                        setEndPickerVisible(false);
                    }}
                    onCancel={() => setEndPickerVisible(false)}
                />

                <TouchableOpacity style={styles.completeButton} onPress={handleSaveTrip}>
                    <Text style={styles.completeButtonText}>완료</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(230, 230, 250, 0.9)',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#87CEEB',
        marginBottom: 50,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    completeButton: {
        marginTop: 40,
        backgroundColor: '#87CEEB',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NewTripPlans;