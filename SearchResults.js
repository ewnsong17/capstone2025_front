import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback, Linking } from 'react-native';
import config from './config';
import { useNavigation } from '@react-navigation/native';

export default function SearchResults() {
    const [selectedCategory, setSelectedCategory] = useState('전체'); // 선택된 버튼에는 영향 없음
    const [showFilter, setShowFilter] = useState(false); // 필터 팝업 상태
    const [selectedFilterCategory, setSelectedFilterCategory] = useState(null); // 필터에서 선택한 카테고리
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigation = useNavigation();
    const categories = ['전체', '콘서트', '뮤지컬', '스포츠'];
    const [packageList, setPackageList] = useState([]); // 패키지 리스트 (필터링된 결과를 저장할 상태)

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`; // 원하면 구분자 '.' 등으로 변경 가능
    };

    const fetchPackages = async (type) => {
        const requestBody = {
            type: type, // ✅ 올바르게 매개변수 사용
            min_price: 0,
            max_price: 9999999
        };

        try {
            console.log("🚀 [fetchPackages] 서버로 요청 시작");
            console.log("📤 [fetch] 요청 바디:", JSON.stringify(requestBody));

            const response = await fetch(`${config.api.base_url}/search/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log("🌐 [fetch] 응답 상태 코드:", response.status);
            console.log("📦 [fetch] 응답 데이터:", data);

            if (data.result) {
                const updatedList = data.result_list.map(pkg => ({
                    ...pkg,
                    image: pkg.image  // 그대로 사용 (가공 없이)
                }));

                setPackageList(updatedList);
                console.log("✅ [fetch] 패키지 리스트 상태 업데이트 완료");
            } else {
                console.warn("❌ [fetch] 서버 에러:", data.exception);
            }
        } catch (err) {
            console.error("🔥 [fetch] API 요청 실패:", err);
        }
    };

    // 필터 적용 후 닫기 (초기화)
    const applyFilter = () => {
        console.log("💡 [applyFilter] 필터 적용 버튼 클릭됨");
        console.log("👉 선택된 카테고리:", selectedFilterCategory);
        console.log("👉 가격 범위:", minPrice, "-", maxPrice);

        const typeMap = {
            '뮤지컬': 1,
            '콘서트': 2,
            '스포츠': 3
        };

        const mappedType = typeMap[selectedFilterCategory];

        const filterData = {
            type: mappedType,
            min_price: parseInt(minPrice) || 0,
            max_price: parseInt(maxPrice) || 9999999
        };

        // SearchFilteredResults 화면으로 이동하면서 필터 정보 전달
        navigation.navigate('SearchFilteredResults', { filterData });

        setShowFilter(false);
    };
    const handleResetPlace = () => { // 초기화 버튼
        setSelectedFilterCategory(null);
        setMinPrice('');
        setMaxPrice('');
    };

    // 🔥 useEffect 밖에서 먼저 정의
    const fetchAllPackages = async () => {
        const allTypes = [1, 2, 3];
        let allResults = [];

        for (let type of allTypes) {
            try {
                const response = await fetch(`${config.api.base_url}/search/results`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: type,
                        min_price: 0,
                        max_price: 9999999
                    })
                });

                const data = await response.json();
                if (data.result) {
                    const updatedList = data.result_list.map(pkg => ({
                        ...pkg,
                        image: pkg.image || "http://tkfile.yes24.com/upload2/PerfBlog/202505/20250508/20250508-53433.jpg"
                    }));
                    allResults = [...allResults, ...updatedList];
                }
            } catch (err) {
                console.error(`🔥 [fetchAllPackages] 타입 ${type} 요청 실패:`, err);
            }
        }

        setPackageList(allResults);
        console.log("✅ 모든 타입의 패키지 합쳐서 로딩 완료", allResults.length);
    };

    // 👇 컴포넌트 처음 로드 시 1번 실행
    useEffect(() => {
        fetchAllPackages();
    }, []);

    return (
        <View style={styles.container}>

            {/* 선택한 여행 장소 */}
            <View style={styles.selectedPlaceContainer}>
                <Text style={styles.text}>Travel Place</Text>
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
                        onPress={() => {
                            setSelectedCategory(category);

                            const typeMap = {
                                '뮤지컬': 1,
                                '콘서트': 2,
                                '스포츠': 3,
                            };
                            if (category === '전체') {
                                // 전체 클릭 시, 모든 패키지 다시 불러오기
                                fetchAllPackages();
                            } else {
                                const mappedType = typeMap[category];
                                fetchPackages(mappedType);
                            }
                        }}
                    >
                        <Text style={[styles.text, { fontWeight: 'normal' }]}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 선택한 카테고리의 패키지 이미지 출력 */}
            <ScrollView style={styles.resultsContainer}>
                {packageList.length === 0 ? (
                    <Text style={styles.text}>🔎 결과가 없습니다.</Text>
                ) : (
                    packageList.map((pkg, index) => {
                        console.log("🖼 렌더링 중인 패키지:", pkg);
                        return (
                            <View key={index} style={styles.packageItem}>
                                <Text style={styles.text}>{pkg.name}</Text>
                                {pkg.image && (
                                    <>
                                        <Image
                                            source={{ uri: pkg.image }}
                                            style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 10 }}
                                            resizeMode="cover"
                                        />

                                    </>
                                )}
                                <Text>{pkg.country}</Text>
                                <Text>
                                    {formatDate(pkg.start_date)} ~ {formatDate(pkg.end_date)}
                                </Text>
                                <Text style={{ marginBottom: 5 }}>{pkg.price.toLocaleString()}원</Text>
                                <TouchableOpacity onPress={() => Linking.openURL(pkg.url)}>
                                    <Text style={styles.categoryButton}>상세보기</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* 필터 팝업 */}
            {showFilter && (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.filterContainer}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterTitle}>필터</Text>
                            <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeButton}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 공연 종류 선택 */}
                        <View style={styles.filterBackground}>
                            <Text style={[styles.text, { alignSelf: 'flex-start', marginBottom: 10 }]}>공연 종류</Text>
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
                                        <Text style={[styles.text, { fontWeight: 'normal', fontSize: 13 }]}>{category}</Text>

                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 가격 입력 */}
                        <View style={styles.filterBackground}>
                            <Text style={[styles.text, { alignSelf: 'flex-start', marginBottom: 10 }]}>가격</Text>
                            <View style={styles.priceInputContainer}>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="최소 금액"
                                    keyboardType="numeric"
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                />
                                <Text style={styles.priceSeparator}>     -     </Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="최대 금액"
                                    keyboardType="numeric"
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                />
                            </View>
                        </View>

                        {/* 필터 적용 버튼 */}
                        <TouchableOpacity style={styles.applyFilterButton} onPress={applyFilter}>
                            <Text style={styles.text}>필터 적용</Text>
                        </TouchableOpacity>

                        {/* 초기화 버튼 */}
                        <TouchableOpacity style={styles.resetButton} onPress={handleResetPlace}>
                            <Text style={[styles.text, { fontWeight: 'normal' }]}>초기화</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
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
        backgroundColor: '#87CEEB',
        padding: 15,
        margin: 10,
        borderRadius: 10,
    },
    text: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    filterIcon: {
        width: 25,
        height: 25,
        tintColor: 'black',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    categoryButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    selectedCategory: {
        backgroundColor: '#FFC0CB',
    },
    resultsContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: '#87CEEB',
        borderRadius: 10,
    },
    packageItem: {
        backgroundColor: '#F0F8FF',
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
        top: '10%',
        left: '5%',
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#FFC0CBCC',
        borderWidth: 3,
        padding: 20,
        borderRadius: 15,
    },
    filterTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resetButton: {
        backgroundColor: '#FFC0CBCC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButton: {
        backgroundColor: "#FFC0CB",
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
    filterBackground: {
        backgroundColor: '#87CEEB',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
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
        width: 110,
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
});