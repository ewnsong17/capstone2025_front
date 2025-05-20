import React, { useState } from 'react';
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

export default function AITravel() {
  const navigation = useNavigation(); // 추가
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [city, setCity] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ start_date: start_date, end_date: end_date, city: city.trim() }),
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
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => navigation.navigate('MyTripLists')}
              >
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

          <TextInput
            style={styles.input}
            placeholder="여행할 도시를 입력하세요"
            value={city}
            onChangeText={setCity}
          />
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
