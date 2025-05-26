import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from './Header';
import config from './config';

export default function SearchFilteredResults() {
    const route = useRoute();
    const navigation = useNavigation();
    const { filterData } = route.params;
    const [packageList, setPackageList] = useState([]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`; // 원하면 구분자 '.' 등으로 변경 가능
    };


    useEffect(() => {
        const fetchFilteredResults = async () => {
            try {
                const response = await fetch(`${config.api.base_url}/search/results`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filterData)
                });

                const data = await response.json();

                if (data.result) {
                    const updatedList = data.result_list.map(pkg => ({
                        ...pkg,
                        image: pkg.image || "http://tkfile.yes24.com/upload2/PerfBlog/202505/20250508/20250508-53433.jpg"
                    }));

                    setPackageList(updatedList);
                } else {
                    console.warn("❌ [fetch] 서버 에러:", data.exception);
                }
            } catch (error) {
                console.error("🔥 [fetch] API 요청 실패:", error);
            }
        };

        fetchFilteredResults();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>검 색 결 과</Text>
            <ScrollView style={styles.resultsContainer}>
                {packageList.length === 0 ? (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.text}>결과가 없습니다.</Text>
                    </View>
                ) : (
                    packageList.map((pkg, index) => (
                        <View key={index} style={styles.packageItem}>
                            <Text style={styles.text}>{pkg.name}</Text>
                            {pkg.image && (
                                <Image
                                    source={{ uri: pkg.image }}
                                    style={styles.packageImage}
                                    resizeMode="cover"
                                />
                            )}
                            <Text>{pkg.country}</Text>
                            <Text>
                                {formatDate(pkg.start_date)} ~ {formatDate(pkg.end_date)}
                            </Text>
                            <Text>{pkg.price.toLocaleString()}원</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#000',
    },
    resultsContainer: {
        backgroundColor: '#87CEEB',
        borderRadius: 10,
        padding: 10,
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
        borderRadius: 10,
        marginVertical: 5,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'

    },
});