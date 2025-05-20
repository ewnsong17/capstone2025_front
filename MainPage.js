import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Font from './font';
import config from './config';

const { width, height } = Dimensions.get('window'); // 화면 크기 가져오기
const IMAGE_WIDTH = width; // 이미지 너비를 화면 전체로 설정
const IMAGE_HEIGHT = height * 0.4; // 이미지 높이를 화면 높이의 40%로 설정

const App = ({ setCurrentScreen, selectedDate, selectedPlace, setSelectedDate, setSelectedPlace }) => {
  const fontLoaded = Font();
  const [showPopup, setShowPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [packageList, setPackageList] = useState([]);

  useEffect(() => {
    fetch(`${config.api.base_url}/main/banners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application.json'
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setBannerList(data.banner_list);
        }
      })
      .catch(err => {
        console.error("배너 이미지 불러오기 실패:", err);
      });
  }, []);

  useEffect(() => {
    fetch(`${config.api.base_url}/main/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application.json'
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setPackageList(data.package_list);
        }
      })
      .catch(err => console.error("추천 패키지 이미지 불러오기 실패:", err));
  }, []);

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* 가로 스크롤 가능한 상단 사진 영역 */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.photoScrollContainer}>
        {bannerList.map((image, index) => (
          <View key={index} style={styles.photoArea}>
            <Image source={{ uri: image }} style={styles.photoImage} resizeMode="cover" />
          </View>
        ))}

      </ScrollView>

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


      {/* 항공 및 숙소 예약 */}
      <TouchableOpacity
        style={[
          styles.buttonWithoutBack,
          (!selectedPlace || !selectedDate) && { opacity: 0.5 }
        ]}
        disabled={!selectedPlace || !selectedDate}
        onPress={() => setCurrentScreen('TripReservation')}
      >
        <Image
          source={
            !selectedPlace || !selectedDate
              ? require('./assets/plane.png')
              : require('./assets/plane_fill.png')
          }
          style={styles.searchImage}
        />
      </TouchableOpacity>

      {/* ai와 같이 여행계획 세우기 */}
      <View style={styles.planButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('AITravel')}>
          <Text style={styles.text}>Planning Travel with...</Text>
          <Text style={[styles.text, { fontSize: 20 }]}>A I</Text>
        </TouchableOpacity>
      </View>

      {/* 가로 스크롤 가능한 하단 사진 영역 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScrollContainer}>
        {packageList.map((img, index) => (
          <View key={index} style={styles.photoArea}>
            <Image source={{ uri: img }} style={styles.photoImage} resizeMode="cover" />
          </View>
        ))}

      </ScrollView>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 20,
  },
  photoScrollContainer: {
    width: '100%',
    height: IMAGE_HEIGHT + 20,
    marginBottom: 30,
  },
  photoArea: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  buttonGroup: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 350,
    padding: 15,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  searchImage: {
    width: 70,
    height: 80,
    resizeMode: 'contain',
  },
  textButton: {
    width: 250,
    padding: 20,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  imageButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popup: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderColor: '#87CEEB',
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0000004D',
    zIndex: 5,
  },
  placeGroup: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#87CEEB',
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
    borderColor: '#FFC0CB',
    width: '30%',
  },
  popupText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#FFC0CBCC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default App;