import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Font from './font';
import Header from './Header';  // 공통 헤더 컴포넌트 불러오기
import MyPage from './04';  // 마이페이지 UI

export default function App() {
    const fontLoaded = Font();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 상태
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
    const [showDatePicker, setShowDatePicker] = useState(false);

    if (!fontLoaded) {
        return <Text>Loading...</Text>;
    }

    const handlePopupClose = () => {
        setShowPopup(false); // 팝업 닫기
    };

    const handlePlaceSelect = (place) => {
        setSelectedPlace(place); // 선택된 장소 설정
        setShowPopup(false); // 팝업 닫기
    };

    const handleResetPlace = () => {
        setSelectedPlace(null); // 장소 초기화
        setShowPopup(false);
    };

    return (
        <ScrollView style={styles.container}>

            {/* 슬라이더 */}
            <View style={styles.sliderContainer}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Image source={require('./assets/p1.jpg')} style={styles.sliderImage} />
                    <Image source={require('./assets/p2.jpg')} style={styles.sliderImage} />
                    <Image source={require('./assets/p3.jpg')} style={styles.sliderImage} />
                    <Image source={require('./assets/p4.jpg')} style={styles.sliderImage} />
                    <Image source={require('./assets/p5.jpg')} style={styles.sliderImage} />
                </ScrollView>
            </View>

            {/* PLACE & DATE 버튼 */}
            <View style={styles.buttonContainer}>
                {/* PLACE 버튼 */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowPopup(true)} // PLACE 버튼 클릭 시 팝업 열기
                >
                    <Text
                        style={[
                            styles.text,
                            { color: selectedPlace ? 'purple' : 'black' },
                        ]}
                    >
                        {selectedPlace ? selectedPlace : 'P L A C E'} {/* 선택된 장소가 있으면 그걸 표시 */}
                    </Text>
                </TouchableOpacity>

                {/* DATE 버튼 */}
                <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                    <Text style={[styles.text, { color: selectedDate ? 'purple' : 'black' }]}>
                        {selectedDate ? selectedDate : 'D A T E'}
                    </Text>
                </TouchableOpacity>

                {/* 날짜 선택 모달 */}
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={(date) => {
                        setSelectedDate(date.toISOString().split('T')[0]); // YYYY-MM-DD 형식 저장
                        setShowDatePicker(false);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                />
            </View>

            {/* PLACE 팝업 */}
            {showPopup && (
                <View style={styles.popup}>
                    <Text style={styles.popupTitle}>choose a place to TRAVEL</Text>

                    <View style={styles.placeGroup}>
                        <Text style={styles.groupTitle}>국내</Text>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('서울')}>
                            <Text style={styles.popupText}>서울</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('인천')}>
                            <Text style={styles.popupText}>인천</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('대전')}>
                            <Text style={styles.popupText}>대전</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('대구')}>
                            <Text style={styles.popupText}>대구</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('광주')}>
                            <Text style={styles.popupText}>광주</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('부산')}>
                            <Text style={styles.popupText}>부산</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('제주')}>
                            <Text style={styles.popupText}>제주</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.placeGroup}>
                        <Text style={styles.groupTitle}>해외</Text>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('미국')}>
                            <Text style={styles.popupText}>미국</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('프랑스')}>
                            <Text style={styles.popupText}>프랑스</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('영국')}>
                            <Text style={styles.popupText}>영국</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('이탈리아')}>
                            <Text style={styles.popupText}>이탈리아</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('독일')}>
                            <Text style={styles.popupText}>독일</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={() => handlePlaceSelect('일본')}>
                            <Text style={styles.popupText}>일본</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.resetButton} onPress={handleResetPlace}>
                        <Text style={[styles.text, { fontWeight: 'normal' }]}>초기화</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 팝업 이외 영역 클릭 시 팝업 닫기 */}
            {showPopup && (
                <TouchableOpacity style={styles.overlay} onPress={handlePopupClose} />
            )}

            {/* 나머지 페이지 내용 */}
            <View style={styles.searchButtonContainer}>
                <TouchableOpacity style={styles.buttonWithoutBack} onPress={() => alert('Search clicked!')}>
                    <Image source={require('./assets/plane.png')} style={styles.searchImage} />
                </TouchableOpacity>
            </View>

            <View style={styles.planButtonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => alert('Plan your trip clicked!')}>
                    <Text style={styles.text}>Planning Travel with...</Text>
                    <Text style={[styles.text, { fontSize: 20 }]}>A I</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sliderContainer}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Image source={require('./assets/r1.jpg')} style={styles.sliderImage} />
                    <Image source={require('./assets/r2.jpg')} style={styles.sliderImage} />
                    <Image source={require('./assets/r3.jpg')} style={styles.sliderImage} />
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 10,
        height: 80,
    },
    logo: {
        width: 50,
        height: 50,
    },
    rightIcons: {
        flexDirection: 'row',
    },
    icon: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },
    sliderContainer: {
        marginHorizontal: 20,
        height: 250,
        borderWidth: 2,
        borderColor: 'skyblue',
        borderRadius: 10,
    },
    sliderImage: {
        width: 800,
        height: 250,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'column',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'skyblue',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        padding: 10,
    },
    button: {
        backgroundColor: 'pink',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '100%',
    },
    buttonWithoutBack: {
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '100%',
    },
    text: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    searchButtonContainer: {
        alignSelf: 'center',
        width: '30%',
    },
    searchImage: {
        width: '100%',
        height: 40,
    },
    planButtonContainer: {
        alignSelf: 'center',
        width: '80%',
        marginTop: 5,
        marginBottom: 10,
    },
    popup: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderColor: 'skyblue',
        borderWidth: 2,
        alignItems: 'center',
        zIndex: 10,
    },
    popupTitle: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    popupButton: {
        marginBottom: 10,
    },
    popupText: {
        fontSize: 18,
        color: 'black',
    },
    resetButton: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 5,
    },
    placeGroup: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'skyblue',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    groupTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    popupButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'pink',
        width: '30%',
    },
    popupText: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    resetButton: {
        backgroundColor: 'rgba(255, 192, 203, 0.8)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
});