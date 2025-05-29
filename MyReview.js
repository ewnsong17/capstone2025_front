import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useReview } from './ReviewContext';
import { Ionicons } from '@expo/vector-icons';

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

        const title = item.place || '장소';
        const date = new Date(item.reg_date);
        const formattedDate = date.toISOString().split('T')[0];

        return (
            <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
                <View style={styles.headerRow}>
                    <Text style={styles.cardTitle}>{title}</Text>

                    <View style={styles.starIconRow}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Ionicons
                                key={i}
                                name={i <= item.rate ? 'star' : 'star-outline'}
                                size={18}
                                color="#FFD700"
                            />
                        ))}
                    </View>
                </View>

                <Text style={styles.cardContent}>{item.comment}</Text>
                <Text style={styles.cardDate}>{formattedDate}</Text>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        fetchReviewsFromServer();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>내 리뷰</Text>

            <FlatList
                data={Object.values(reviews).filter(r => r !== null)}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            {modalVisible && selectedReview && (
                <Modal visible={modalVisible} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>
                                        {selectedReview.place || '리뷰'}
                                    </Text>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // ← 이걸로 오른쪽으로 이동됨
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    starIconRow: {
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
    },


});
