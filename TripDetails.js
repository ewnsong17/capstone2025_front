import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TripDetails() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>여행 상세 페이지</Text>
            <Text style={styles.details}>여기에 여행 세부 정보가 표시됩니다.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 18,
        marginTop: 20,
    },
});
