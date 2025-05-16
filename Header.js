import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header({ onLogoPress, onSearchPress, onOpenMyPage, simple = false }) {
    const [searchQuery, setSearchQuery] = useState("");

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                {/* 왼쪽 로고 */}
                <TouchableOpacity onPress={onLogoPress}>
                    <Image source={require('./assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>

                {/* 오른쪽 아이콘들 */}
                {!simple && (
                    <View style={styles.rightIcons}>
                        <TouchableOpacity onPress={onSearchPress}>
                            <Image source={require('./assets/optionsearch.png')} style={styles.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onOpenMyPage}>
                            <Image source={require('./assets/myInform.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'space-between', // 왼쪽-오른쪽 정렬
        padding: 10,
        backgroundColor: '#F0F8FF',
        height: 50,
    },
    logo: {
        width: 50,
        height: 50,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
});
