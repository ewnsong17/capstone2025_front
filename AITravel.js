import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import config from './config';
import { LoginContext } from './LoginContext';


export default function AITravel() {
  const navigation = useNavigation(); // 추가
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [city, setCity] = useState('');
  const [taste, setTaste] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(LoginContext); // ✅ 로그인 상태 확인용
  const text = aiResponse;


  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  };

  const onStartChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowStartPicker(false);
      return;
    }
    if (selectedDate) {
      setTempStartDate(selectedDate);
    }
  };

  const onEndChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowEndPicker(false);
      return;
    }
    if (selectedDate) {
      setTempEndDate(selectedDate);
    }
  };

  const confirmStartDate = () => {
    setStartDate(tempStartDate);
    setShowStartPicker(false);
  };

  const confirmEndDate = () => {
    setEndDate(tempEndDate);
    setShowEndPicker(false);
  };

  const sendToAI = async () => {
    const start_date = formatDate(startDate);
    const end_date = formatDate(endDate);

    if (!city.trim()) {
      setAiResponse('도시를 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.api.base_url}/search/askAI`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: start_date, end_date: end_date, city: city.trim(), taste: taste.trim() }),
      });

      const data = await response.json();
      console.log(data);

      if (data.result) {
        setAiResponse(data.answer);
      } else {
        setAiResponse('응답이 없습니다.');
      }
    } catch (error) {
      setAiResponse('서버 요청 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const extractDateRange = (text) => {
    // (1) "2025-05-27 ~ 2025-05-31" 형식
    const match = text.match(/\((\d{4}-\d{2}-\d{2}) ~ (\d{4}-\d{2}-\d{2})\)/);
    if (match) {
      console.log('✅ 날짜(yyyy-mm-dd ~ yyyy-mm-dd) 추출됨:', match[1], match[2]);
      return { start_date: match[1], end_date: match[2] };
    }

    // (2) "2025년 5월 27일" 형식
    const korDateMatch = text.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (korDateMatch) {
      const [_, y, m, d] = korDateMatch;
      const date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      console.log('✅ 한글 날짜 추출됨:', date);
      return { start_date: date, end_date: date };
    }

    // (3) 본문에 날짜가 흩어져 있을 경우 → 여러 개 추출 후 범위 계산
    const allDates = [...text.matchAll(/\d{4}-\d{2}-\d{2}/g)].map(m => m[0]);
    if (allDates.length >= 1) {
      const sorted = allDates.sort();
      const start_date = sorted[0];
      const end_date = sorted[sorted.length - 1];
      console.log(`✅ 복수 날짜 추출됨: 출발일=${start_date}, 도착일=${end_date}`);
      return { start_date, end_date };
    }

    // (4) 완전 실패
    console.error('❌ 날짜 추출 실패: 어떤 형식도 매칭되지 않음');
    throw new Error('날짜를 추출할 수 없습니다. 형식을 확인하세요.');
  };

  const extractPlaceDatePairs = (text) => {
    const sectionRegex = /\*\*(\d{4}-\d{2}-\d{2})\s*\(.+?\)\**([\s\S]*?)(?=\*\*\d{4}-\d{2}-\d{2}|\Z)/g;
    const itemRegex = /\*\*(.+?)\*\*/g;
    const pairs = [];

    let sectionMatch;
    while ((sectionMatch = sectionRegex.exec(text)) !== null) {
      const date = sectionMatch[1];
      const sectionBody = sectionMatch[2];

      let itemMatch;
      while ((itemMatch = itemRegex.exec(sectionBody)) !== null) {
        const placeName = itemMatch[1].trim();
        if (!/^\d{4}-\d{2}-\d{2}/.test(placeName) && !/^\d+일차/.test(placeName)) {
          pairs.push({ place: placeName, date });
        }
      }
    }

    // ✅ 대체 플랜: 섹션이 없으면 전체 텍스트에서 장소만 추출하여 단일 날짜에 묶기
    if (pairs.length === 0) {
      console.warn("⚠️ 날짜 구간 없음 → 장소만 단일 날짜에 묶어서 처리");

      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      const fallbackDate = dateMatch ? dateMatch[0] : '2025-01-01';

      let itemMatch;
      while ((itemMatch = itemRegex.exec(text)) !== null) {
        const placeName = itemMatch[1].trim();
        if (!/^\d+일차/.test(placeName)) {
          pairs.push({ place: placeName, date: fallbackDate });
        }
      }
    }

    if (pairs.length === 0) {
      throw new Error("날짜별 장소 추출 실패");
    }

    console.log("✅ 날짜-장소 추출 결과:", pairs);
    return pairs;
  };


  const autoSaveFromAIResponse = async () => {
    const cityValue = city.trim();
    console.log("🚨 함수 진입");

    if (!user) {
      console.log("⛔️ 로그인 안 됨");
      Keyboard.dismiss();
      setTimeout(() => {
        Alert.alert('⚠️ 로그인 필요', 'AI 추천 여행을 저장하려면 먼저 로그인하세요.', [
          { text: '확인', style: 'cancel' },
        ]);
      }, 100);
      return;
    }

    console.log("✅ 로그인 확인됨");
    const text = aiResponse;
    console.log('📥 aiResponse 원문:\n', text);

    let dateRange, placeDatePairs;
    try {
      dateRange = extractDateRange(text);
      placeDatePairs = extractPlaceDatePairs(text);
      console.log('✅ 파싱 성공:', dateRange, placeDatePairs);
    } catch (parseError) {
      console.error('❌ 파싱 중 오류 발생:', parseError.message);
      Alert.alert('❌ 파싱 실패', parseError.message);
      return;
    }

    const { start_date, end_date } = dateRange;

    const tripName = `${cityValue} 여행`;
    const country = cityValue;
    try {
      const match = text.match(/##\s*(.+?)(?:추천|여행)/);
      if (match && match[1]) {
        tripName = match[1].trim();
      }
      console.log('✅ tripName 추출:', tripName);
    } catch {
      console.warn('⚠️ tripName 파싱 실패, 기본값 사용');
    }

    const type = 1; // 의미 없는 값, 외래키 제약 통과용

    let tripId;

    try {
      console.log(`📤 여행 등록 요청 시작 → ${start_date} ~ ${end_date}, 국가: ${country}, 이름: ${tripName}`);
      const tripRes = await fetch(`${config.api.base_url}/user/myTripAdd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: tripName,
          type,
          start_date,
          end_date,
          country,
        }),
      });

      const tripRaw = await tripRes.text();
      console.log('📦 여행 등록 응답 내용:', tripRaw);

      let tripData;
      try {
        tripData = JSON.parse(tripRaw);
      } catch {
        throw new Error('❌ 여행 등록 응답을 JSON으로 파싱할 수 없습니다.');
      }

      if (!tripData.result) {
        throw new Error('❌ 여행 추가 실패 (result=false)');
      }

      console.log('✅ 여행 등록 성공');

      // 최신 trip ID 조회
      console.log('📤 여행 ID 조회 요청 시작');
      const listRes = await fetch(`${config.api.base_url}/user/myTripList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const listRaw = await listRes.text();
      console.log('📦 여행 리스트 응답 내용:', listRaw);

      let listData;
      try {
        listData = JSON.parse(listRaw);
      } catch {
        throw new Error('❌ 여행 리스트 응답을 JSON으로 파싱할 수 없습니다.');
      }

      const latestTripId = Math.max(...Object.keys(listData.trip_list).map(Number));
      tripId = latestTripId;
      console.log('✅ 등록된 trip ID:', tripId);
    } catch (err) {
      console.error('❌ 여행 저장 중 오류 발생:', err);
      Alert.alert('❌ 오류 발생', err.message);
      return;
    }

    try {
      for (const { place, date } of placeDatePairs) {
        const cleanPlace = [...place.replace(/[:：]/g, '').trim()].slice(0, 20).join('');

        console.log(`📦 장소 저장 시도 → [${cleanPlace}] @ [${date}]`);
        await new Promise(res => setTimeout(res, 300)); // 300ms 딜레이 추가

        const placeRes = await fetch(`${config.api.base_url}/user/myTripAddPlace`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id: tripId,
            name: cleanPlace,
            place: cleanPlace,
            reg_date: date,
          }),
        });

        const placeRaw = await placeRes.text();
        console.log(`📥 장소 저장 응답 [${cleanPlace}]:`, placeRaw);
      }



      console.log('🎉 모든 장소 저장 완료');
      Alert.alert('✅ 저장 완료', 'AI 추천 여행이 자동으로 등록되었습니다!', [
        { text: '확인', onPress: () => navigation.navigate('MyTripLists') },
      ]);
    } catch (err) {
      console.error('❌ 장소 저장 중 오류 발생:', err);
      Alert.alert('❌ 장소 저장 실패', err.message);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.container}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.responseContainer}>
              <Text style={styles.responseLabel}>추천 여행 계획</Text>
              <View style={styles.aiBox}>
                <Text style={styles.responseText}>{aiResponse}</Text>
              </View>

              {/* 저장 버튼을 ScrollView 안쪽으로 옮김 */}
              {aiResponse ? (
                <TouchableOpacity style={styles.saveButton} onPress={autoSaveFromAIResponse}>
                  <Text style={styles.saveButtonText}>내 여행으로 저장</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <View style={styles.pickerRow}>
              <TouchableOpacity
                onPress={() => {
                  setShowStartPicker(!showStartPicker);
                  setShowEndPicker(false);
                  setTempStartDate(startDate);
                }}
                style={styles.dateButton}
              >
                <Text>출발일: {formatDate(startDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowEndPicker(!showEndPicker);
                  setShowStartPicker(false);
                  setTempEndDate(endDate);
                }}
                style={styles.dateButton}
              >
                <Text>도착일: {formatDate(endDate)}</Text>
              </TouchableOpacity>
            </View>

            {showStartPicker && (
              <View>
                <DateTimePicker
                  value={tempStartDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={onStartChange}
                />
                <Button title="확인" onPress={confirmStartDate} color="#87CEEB" />
              </View>
            )}

            {showEndPicker && (
              <View>
                <DateTimePicker
                  value={tempEndDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={onEndChange}
                />
                <Button title="확인" onPress={confirmEndDate} color="#87CEEB" />
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                placeholder="여행할 도시를 입력하세요"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="취향"
                value={taste}
                onChangeText={setTaste}
              />
            </View>
            <Button
              title={loading ? '응답 중...' : 'S E N D'}
              onPress={sendToAI}
              disabled={loading}
              color="purple"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 200,
  },
  responseContainer: {
    marginBottom: 20,
  },
  responseLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  aiBox: {
    borderWidth: 1,
    borderColor: '#87CEEB',
    borderRadius: 12,
    padding: 12,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderTopWidth: 1,
    borderColor: '#E6E6FA',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#87CEEB',
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  saveButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});