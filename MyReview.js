import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useReview } from './ReviewContext';

export default function MyReview() {
    const { reviews, fetchReviewsFromServer, updateReview, deleteReview } = useReview();
    const [selectedReview, setSelectedReview] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (review) => {
        if (!review) return;
        setSelectedReview(review);
        setEditContent(review.comment);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectedReview(null);
            setEditContent('');
        }, 300);
    };

    const handleUpdate = () => {
        if (!selectedReview) return;
        updateReview(selectedReview.id, editContent);
        closeModal();
    };

    const handleDelete = () => {
        if (!selectedReview) return;
        deleteReview(selectedReview.id);
        closeModal();
    };

    const renderItem = ({ item }) => {
        if (!item) return null;

        return (
            <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
                <Text style={styles.cardText}>{item.country} | {item.name}</Text>
                <Text style={styles.cardContent} numberOfLines={2} ellipsizeMode="tail">
                    {item.comment}
                </Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        fetchReviewsFromServer();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>내 리뷰</Text>

            <FlatList
                data={reviews.filter(r => r !== null)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            {modalVisible && selectedReview && (
                <Modal visible={modalVisible} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>{selectedReview.title}</Text>
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
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(230, 230, 250, 0.9)',
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
