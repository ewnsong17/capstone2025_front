import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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

    const handleSaveTrip = () => {
        if (!destination.trim() || !startDate || !endDate) {
            Alert.alert('빈칸을 채워주세요');
            return;
        }

        const today = new Date();
        const isPast = new Date(endDate) < today;

        const formattedPeriod = `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
        const newTrip = {
            title: `${destination} 여행`,
            period: formattedPeriod,
            withAI: false, // 필요시 변경
            type: isPast ? 'past' : 'upcoming',
        };

        if (route.params?.handleAddTrip) {
            route.params.handleAddTrip(newTrip);
        }

        navigation.goBack();
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
