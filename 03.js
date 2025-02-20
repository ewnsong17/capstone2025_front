import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';

const packageImages = {
    '콘서트': [require('./assets/package 1.png'), require('./assets/package 2.png'), require('./assets/package 3.png')],
    '뮤지컬': [require('./assets/package 4.png'), require('./assets/package 5.png') ,require('./assets/package 9.png')],
    '스포츠': [require('./assets/package 6.png'), require('./assets/package 7.png'), require('./assets/package 8.png')]
};

export default function SearchResults() {
    const [selectedCategory, setSelectedCategory] = useState('콘서트'); // 패키지의 카테고리
    const [showFilter, setShowFilter] = useState(false); // 필터 팝업 상태
    const [selectedFilterCategory, setSelectedFilterCategory] = useState(null); // 필터에서 선택한 카테고리
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const categories = ['콘서트', '뮤지컬', '스포츠'];

    // 필터 적용 후 닫기 (초기화)
    const applyFilter = () => {
        setShowFilter(false);
        setSelectedFilterCategory(null);
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <View style={styles.container}>

            {/* 선택한 여행 장소 */}
            <View style={styles.selectedPlaceContainer}>
                <Text style={styles.selectedPlaceText}>선택한 여행 장소</Text>
                <TouchableOpacity onPress={() => setShowFilter(true)}>
                    <Image source={require('./assets/filter.png')} style={styles.filterIcon} />
                </TouchableOpacity>
            </View>

            {/* 카테고리 선택 */}
            <View style={styles.categoryContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={styles.categoryText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 선택한 카테고리의 패키지 이미지 출력 */}
            <ScrollView style={styles.resultsContainer}>
                {packageImages[selectedCategory].map((imageSource, index) => (
                    <View key={index} style={styles.packageItem}>
                        <Image source={imageSource} style={styles.packageImage} />
                    </View>
                ))}
            </ScrollView>

            {/* 필터 팝업 */}
            {showFilter && (
                <View style={styles.filterContainer}>
                    <View style={styles.filterHeader}>
                        <Text style={styles.filterTitle}>필터</Text>
                        <TouchableOpacity style={styles.resetButton}>
                            <Text style={styles.resetText}>초기화</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 공연 종류 선택 */}
                    <Text style={styles.filterLabel}>공연 종류</Text>
                    <View style={styles.filterCategoryContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.filterCategoryButton,
                                    selectedFilterCategory === category && styles.selectedCategory
                                ]}
                                onPress={() => setSelectedFilterCategory(category)}
                            >
                                <Text style={styles.categoryText}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* 가격 입력 */}
                    <Text style={styles.filterLabel}>가격 (성인 1인당)</Text>
                    <View style={styles.priceInputContainer}>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="금액입력"
                            keyboardType="numeric"
                            value={minPrice}
                            onChangeText={setMinPrice}
                        />
                        <Text style={styles.priceSeparator}> - </Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="금액입력"
                            keyboardType="numeric"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                        />
                    </View>

                    {/* 필터 적용 버튼 */}
                    <TouchableOpacity style={styles.applyFilterButton} onPress={applyFilter}>
                        <Text style={styles.applyFilterText}>필터 적용</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    logo: {
        width: 50,
        height: 50,
    },
    rightIcons: {
        flexDirection: 'row',
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
    selectedPlaceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#5A7E99',
        padding: 15,
        margin: 10,
        borderRadius: 10,
    },
    selectedPlaceText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterIcon: {
        width: 25,
        height: 25,
        tintColor: 'white',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    categoryButton: {
        backgroundColor: '#ADD8E6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    selectedCategory: {
        backgroundColor: '#4682B4',
    },
    resultsContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: '#3E5C76',
        borderRadius: 10,
    },
    packageItem: {
        backgroundColor: '#B0E0E6',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    packageImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },

    // 필터 스타일
    filterContainer: {
        position: 'absolute',
        top: '20%',
        left: '5%',
        width: '90%',
        backgroundColor: '#3C5A6F',
        padding: 20,
        borderRadius: 15,
    },
    filterTitle: {
        fontSize: 20,  
        fontWeight: "bold", 
        color: "#FFFFFF",  
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resetButton: {
        backgroundColor: "#B3E5FC",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    resetText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
    },
    closeButton: {
        backgroundColor: "#FFF",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    closeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    filterLabel: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    filterCategoryContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 5,
    },
    filterCategoryButton: {
        backgroundColor: "#B3E5FC",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    priceInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    priceInput: {
        backgroundColor: "#B3E5FC",
        width: 100,
        height: 40,
        textAlign: "center",
        borderRadius: 10,
    },
    applyFilterButton: {
        backgroundColor: "#B3E5FC",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    applyFilterText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
