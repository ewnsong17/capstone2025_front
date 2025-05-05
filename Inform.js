import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback, TextInput, Modal, Alert } from 'react-native';
import { ProfileContext } from './ProFileContext'; // Context import
const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // 화면 너비와 높이 가져오기

export default function MyPage({ onClose, isVisible }) {
    const navigation = useNavigation();
    const slideAnim = useRef(new Animated.Value(screenWidth)).current; // 초기 위치 (화면 밖)
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginModalVisible, setLoginModalVisible] = useState(false);
    const { name, birthDate, profileImage } = useContext(ProfileContext);

    useEffect(() => {
        if (isVisible) {
            // 오른쪽에서 슬라이드 인
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // 오른쪽으로 슬라이드 아웃
            Animated.timing(slideAnim, {
                toValue: screenWidth,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    // 로그인 버튼 클릭 시 로그인 팝업 표시
    const handleLoginClick = () => {
        setLoginModalVisible(true); // 로그인 팝업 열기
    };

    // 로그인 팝업 외부를 클릭했을 때
    const handleOverlayPress = () => {
        setEmail('');
        setPassword('');
        setLoginModalVisible(false); // 팝업 닫기
    };

    // 로그인 처리 함수
    const handleLoginSubmit = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !password) {
            Alert.alert("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
        } else if (!emailPattern.test(email)) {
            Alert.alert("이메일 오류", "유효한 이메일 형식을 입력해주세요.");
        } else {
            setIsLoggedIn(true);
            setLoginModalVisible(false); // 로그인 후 팝업 닫기
        }
    };

    // 회원가입 버튼 클릭 시 SignUp.js 페이지로 이동
    const handleSignUpClick = () => {
        navigation.navigate('SignUp'); // SignUp.js로 이동
    };

    return (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
                    {/* 닫기 버튼 */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    {/* 프로필 정보 */}
                    <View style={styles.profileContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('MyProFile')}>
                            <Image
                                source={profileImage ? { uri: profileImage } : require('./assets/myInform.png')}
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>

                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName}>{name}</Text>
                            <Text style={styles.editProfile}>생년월일: {birthDate}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('MyProFile')}>
                                <Text style={styles.editProfile}>프로필 편집 {'>'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 메뉴 섹션 */}
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyTripLists')}>
                            <Text style={styles.menuText}>내 여행</Text>
                            <Image source={require('./assets/plane.png')} style={styles.menuIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuText}>내 저장</Text>
                            <Image source={require('./assets/heart.png')} style={styles.menuIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyReview')}>
                            <Text style={styles.menuText}>내 리뷰</Text>
                            <Image source={require('./assets/review.png')} style={styles.menuIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* 로그인/회원가입 버튼 */}
                    <View style={styles.authContainer}>
                        <View style={styles.authButtonWrapper}>
                            <TouchableOpacity style={styles.authButton} onPress={handleLoginClick}>
                                <Text style={styles.authButtonText}>Log In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.authButton} onPress={handleSignUpClick}>
                                <Text style={styles.authButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 로그인 팝업 */}
                    {isLoginModalVisible && (
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Log In</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="이메일"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="비밀번호"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit}>
                                    <Text style={styles.loginButtonText}>로그인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000080', // 배경을 어두운 반투명으로 덮기
    },
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '75%',  // 화면의 75%만 차지
        height: '100%',
        backgroundColor: '#E6E6FA',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        padding: 20,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    closeText: {
        fontSize: 24,
        color: '#87CEEB',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#87CEEB',
        paddingBottom: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#87CEEB',
    },
    profileTextContainer: {
        marginLeft: 15,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    editProfile: {
        fontSize: 14,
        color: '#808080',
        marginTop: 5,
    },
    menuContainer: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#87CEEB',
    },
    menuText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuIcon: {
        width: 40,
        height: 40,
    },
    authContainer: {
        flexDirection: 'row',  // 버튼들을 가로로 배치
        justifyContent: 'center',  // 버튼들을 수평 중앙 배치
        alignItems: 'center',  // 버튼들을 세로 중앙 배치
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        width: '100%',  // 전체 화면 너비
        paddingHorizontal: 20,  // 좌우 여백
    },
    authButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',  // 버튼들 간격을 균등하게
        alignItems: 'center',  // 버튼들을 세로 중앙 배치
        width: 240,  // 버튼들이 차지할 고정된 너비 (두 버튼 크기 합)
    },
    authButton: {
        backgroundColor: '#87CEEB',
        height: 40, 
        width: 115,  
        marginHorizontal: 10, 
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authButtonText: {
        fontSize: 15,  
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    modalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalContainer: {
        width: '80%',
        height: '40%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 40,
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

