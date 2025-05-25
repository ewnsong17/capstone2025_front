import React, { useState, useContext } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, navigation } from 'react-native';
import config from './config';
import { ProfileContext } from './ProFileContext';

export default function SignUp({ navigation }) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {
        setName: setContextName,
        setBirthDate: setContextBirthDate,
        setEmail: setContextEmail,
        setImage: setContextImage,
    } = useContext(ProfileContext);

    const handleSignUp = async () => {
        try {
            const response = await axios.post(`${config.api.base_url}/user/signup`, {
                email,
                password,
                birthday: birthDate,
                name,
            });

            if (response.data.result) {
                setContextName(name);
                setContextBirthDate(birthDate);
                setContextEmail(email);

                // 기본 이미지가 없으면 null, 기본 이미지 URL로 대체 가능
                const defaultImageOrUserImage = null; // 필요하면 수정하세요
                setContextImage(defaultImageOrUserImage);

                Alert.alert('회원가입 성공');
                navigation.goBack();
            } else {
                Alert.alert('회원가입 실패', response.data.exception || '이미 존재하는 계정입니다.');
            }

        } catch (err) {
            console.error(err);
            Alert.alert('서버 오류', '통신에 실패했습니다.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>

                <TextInput
                    style={styles.input}
                    placeholder="이름"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="생년월일 (YYYY-MM-DD)"
                    value={birthDate}
                    onChangeText={setBirthDate}
                />
                <TextInput
                    style={styles.input}
                    placeholder="이메일"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6E6FA',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#87CEEB',
        marginBottom: 50,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#87CEEB',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});