import React from 'react';
import { Dimensions, Text, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import header1 from '../assets/icon/header/header1.png';
import header2 from '../assets/icon/header/header2.png';

const { width } = Dimensions.get('window');
const HEIGHT = 50;

function RenderHeaderRight ({ headerRight, onPress }) {
    if (headerRight) {
        return (
            <TouchableOpacity style={[styles.headerRight, { alignItems: 'center', justifyContent: 'center' }]} onPress={() => {
                onPress();
            }} >
                {headerRight}
            </TouchableOpacity>
        );
    }
    return <View style={styles.headerRight}/>;
}

export default function Header ({ scene, previous, navigation, replace, headerRight, onPress, style }) {
    const { options } = scene.descriptor;

    // 自定义导航
    if (['FeedBackPage', 'PupilInfoPage'].includes(scene.route.name)) {
        return <></>;
    }
    return (
        <View style={[styles.header, ...style || {}]}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => {
                    replace ? navigation.replace('MaterialTopTabNavigator') : navigation.goBack();
                }} style={styles.returnBtn}>
                    <Image source={replace ? header1 : header2} style={{
                        width: replace ? 17 : 10,
                        height: replace ? 17 : 20,
                    }}/>
                </TouchableOpacity>
            </View>
            <Text style={styles.headerCenter}>{options.title || scene.route.name}</Text>
            <RenderHeaderRight headerRight={headerRight} onPress={onPress}/>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        borderBottomColor: 'rgba(221,221,221,1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: HEIGHT,
        width,
    },
    headerCenter: {
        fontSize: 16,
        fontWeight: '500',
        height: HEIGHT,
        lineHeight: HEIGHT,
        textAlign: 'center',
        width: width - 140,
    },
    headerLeft: {
        height: HEIGHT,
        width: 70,
    },
    headerRight: {
        height: HEIGHT,
        lineHeight: HEIGHT,
        textAlign: 'center',
        width: 70
    },
    returnBtn: {
        alignItems: 'center',
        height: HEIGHT,
        justifyContent: 'center',
        width: 70,
    },
});
