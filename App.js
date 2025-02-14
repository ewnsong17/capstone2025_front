import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>첫화면</Text>
      <Image
        source={require('./assets/logo.png')} // 이미지 경로 설정
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // 이미지 크기 조정
    height: 200,
    marginTop: 20,
  },
});
