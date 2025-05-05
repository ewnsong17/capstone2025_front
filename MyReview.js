import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { ReviewContext } from './ReviewContext';

export default function MyReview() {
    const { reviews, updateReview, deleteReview } = useContext(ReviewContext);
    const [selectedReview, setSelectedReview] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (review) => {
        setSelectedReview(review);
        setEditContent(review.content);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedReview(null);
        setEditContent('');
    };

    const handleUpdate = () => {
        updateReview(selectedReview.id, editContent);
        closeModal();
    };

    const handleDelete = () => {
        deleteReview(selectedReview.id);
        closeModal();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
          <Text style={styles.cardText}>{item.location} | {item.title}</Text>
          <Text style={styles.cardContent} numberOfLines={2} ellipsizeMode="tail">
            {item.content}
          </Text>
        </TouchableOpacity>
      );
      

    console.log("리뷰 데이터:", reviews);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>내 리뷰</Text>

            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedReview?.title}</Text>
                        <TextInput
                            style={styles.modalInput}
                            multiline
                            value={editContent}
                            onChangeText={setEditContent}
                        />


                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={handleUpdate} style={styles.modalButton}>
                                <Text>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={styles.modalButton}>
                                <Text>삭제</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                                <Text>뒤로가기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f7ff',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    cardText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        marginBottom: 15,
      },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#aee1f9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
});
