import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker'; // expo 환경이라면 이거 사용
import Header from './Header'; 
import { ProfileContext } from './ProFileContext';

export default function MyProFile({ navigation }) {
    const { name, setName, birthDate, setBirthDate, profileImage, setProfileImage } = useContext(ProfileContext);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleImagePick = async () => {
    // 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('사진 접근 권한이 필요합니다.');
        return;
    }

    // 이미지 선택 모듈 실행
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
    }
    };

    return (
        <View style={styles.container}>
            {/* Header 고정 */}
                <View style={styles.headerWrapper}>
                <Header
                    onLogoPress={() => navigation.navigate('MainApp')}
                    simple={true}
                />
            </View>

            {/* 프로필 이미지 */}
            <TouchableOpacity onPress={handleImagePick}>
                <Image
                    source={
                        profileImage
                            ? { uri: profileImage }
                            : require('./assets/myInform.png')
                    }
                    style={styles.profileImage}
                />
            </TouchableOpacity>

            {/* 이름 수정 */}
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
            />

            {/* 생년월일 */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.birthText}>생년월일: {birthDate}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={(date) => {
                    setBirthDate(date.toISOString().split('T')[0]);
                    setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
    },
    input: {
        width: 200,
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#999',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
    },
    birthText: {
        fontSize: 16,
        color: 'gray',
    },
});
