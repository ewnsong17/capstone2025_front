import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';

const screenWidth = Dimensions.get('window').width; // 화면 너비

export default function MyPage({ onClose, isVisible }) {
    const slideAnim = useRef(new Animated.Value(screenWidth)).current; // 초기 위치 (화면 밖)

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

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            {/* 하나의 최상위 요소로 묶음 */}
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
                    {/* 닫기 버튼 */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    {/* 프로필 정보 */}
                    <View style={styles.profileContainer}>
                        <Image source={require('./assets/myInform.png')} style={styles.profileImage} />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName}>Name</Text>
                            <TouchableOpacity>
                                <Text style={styles.editProfile}>프로필 편집 {'>'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 메뉴 섹션 */}
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuText}>내 여행</Text>
                            <Image source={require('./assets/plane.png')} style={styles.menuIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuText}>내 저장</Text>
                            <Image source={require('./assets/heart.png')} style={styles.menuIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuText}>내 리뷰</Text>
                            <Image source={require('./assets/review.png')} style={styles.menuIcon} />
                        </TouchableOpacity>
                    </View>
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
    fontFamily: 'Arial',
    },
    menuIcon: {
        width: 40,
        height: 40,
    },
});