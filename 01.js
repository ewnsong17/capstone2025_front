import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Font from './font';

export default function App() {
    const fontLoaded = Font(); // 폰트 로드 여부

    if (!fontLoaded) {
        return <Text>Loading...</Text>; // 폰트가 로딩되기 전에는 "Loading..." 메시지를 표시
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('./assets/logo.png')}
                    style={styles.logo}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>CULTURE</Text>
                <Text style={styles.symbols}> & </Text>
                <Text style={styles.text}>TRIP</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // 화면 중앙 정렬
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    textContainer: {
        flexDirection: 'row', // 텍스트 가로로 배치
        alignItems: 'center', // 텍스트 세로 중앙 배치
    },
    text: {
        fontSize: 50,
        fontFamily: 'Ransom',
    },
    symbols: {
        fontSize: 20,
        fontFamily: 'Times New Roman',
        fontWeight: 'bold',
    },
});
