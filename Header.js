import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TextInput, Alert, SafeAreaView } from 'react-native';

export default function Header({ onLogoPress, onSearchPress, onOpenMyPage, simple = false }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        Alert.alert("알림", `\"${searchQuery}\"이(가) 입력되었습니다`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onLogoPress}>
                    <Image source={require('./assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>

                {!simple && (
                    <>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="검색어를 입력하세요..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <TouchableOpacity onPress={handleSearch}>
                                <Image source={require('./assets/search.png')} style={styles.icon} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={onSearchPress}>
                            <Image source={require('./assets/optionsearch.png')} style={styles.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onOpenMyPage}>
                            <Image source={require('./assets/myInform.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 0,
        backgroundColor: '#F0F8FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#F0F8FF',
    },
    logo: {
        width: 50,
        height: 50,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginLeft: 10,
        paddingHorizontal: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
});
