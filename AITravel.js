import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome 아이콘 사용

const AITravel = () => {
  const [messages, setMessages] = useState([]);  // 채팅 메시지 상태
  const [message, setMessage] = useState('');     // 입력한 메시지 상태

  // 봇의 초기 메시지 추가
  useEffect(() => {
    setMessages([{ 
      text: 'AI를 활용해 여행 계획을 세워보세요!', 
      sender: 'bot', 
      icon: 'plane' // 아이콘 추가
    }]);
  }, []);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
    }
  };

  // 버튼 클릭 시 메시지 출력
  const handleButtonPress = (destination) => {
    setMessages([...messages, { text: `${destination} clicked!`, sender: 'bot', icon: 'plane' }]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          {/* 채팅 화면 */}
          <ScrollView contentContainerStyle={styles.chatContainer}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[styles.messageContainer, msg.sender === 'user' ? styles.userMessage : styles.aiMessage]}
              >
                {msg.sender === 'bot' && (
                  <Icon name={msg.icon} size={30} color="#4D616B" style={styles.botIcon} /> // 아이콘 표시
                )}
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 버튼들 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.roundedButton} onPress={() => handleButtonPress('추천 국내 여행지')}>
              <Text style={styles.buttonText}>추천 국내 여행지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundedButton} onPress={() => handleButtonPress('추천 해외 여행지')}>
              <Text style={styles.buttonText}>추천 해외 여행지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundedButton} onPress={() => handleButtonPress('추천 공연')}>
              <Text style={styles.buttonText}>추천 공연</Text>
            </TouchableOpacity>
          </View>

          {/* 메시지 입력 부분 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={sendMessage}>
              <Image source={require('./assets/send.png')} style={styles.sendButton} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roundedButton: {
    backgroundColor: 'skyblue',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatContainer: {
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#87CEEB',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'pink',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageText: {
    marginTop : 5,
    color: '#333',
    fontSize: 16,
  },
  botIcon: {
    marginRight: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 30,
    height: 30,
  },
});

export default AITravel;
