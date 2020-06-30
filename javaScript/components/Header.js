import React from 'react';
import { Dimensions, Text, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import header1 from '../assets/icon/header/header1.png';
import header2 from '../assets/icon/header/header2.png';
import { N } from '../utils/router';
import ImageAuto from './ImageAuto';

const { width } = Dimensions.get('window');
export const MAIN_HEADER_HEIGHT = 63;

function RenderHeaderRight ({ headerRight, onPress }) {
    if (headerRight) {
        return (
            <TouchableOpacity activeOpacity={1} style={[styles.headerRight, { alignItems: 'center', justifyContent: 'center' }]} onPress={() => {
                try {
                    onPress && onPress();
                } catch (e) {
                    console.log(e);
                }
            }} >
                {headerRight}
            </TouchableOpacity>
        );
    }
    return <View style={styles.headerRight}/>;
}

/**
 * @return {null}
 */
export default function Header ({ scene = { descriptor: { options: {} }, route: { name: '-' } }, previous, navigation = N, replace, headerRight, onPress, style, label, icon, color, backOnPress }) {
    try {
        const { options } = scene.descriptor;
        // 自定义导航
        if (['RightProPage', 'GamePage', 'GlossaryPage', 'FeedBackPage', 'TaskDetailPage', 'AccountBindPage', 'AccountHomePage', 'FundingRecordsPage', 'WithdrawRecordsPage', 'WithdrawPage', 'PupilInfoPage', 'CardPackagePage', 'DailyMoneyPage', 'DailyRedPackagePage', 'OpenMoneyPage', 'PassGamePage'].includes(scene.route.name)) {
            return <></>;
        }
        return (
            <View style={[styles.header, (style || {})]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        if (backOnPress && typeof backOnPress === 'function') {
                            backOnPress();
                        } else {
                            replace ? navigation.replace('MaterialTopTabNavigator') : navigation.goBack();
                        }
                    }} style={styles.returnBtn}>
                        <ImageAuto source={icon || (replace ? header1 : header2)} style={{
                            width: replace ? 16 : 9,
                        }}/>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.headerCenter, {
                    color: color || '#353535'
                }]}>{label || options.title || scene.route.name}</Text>
                <RenderHeaderRight headerRight={headerRight} onPress={onPress}/>
            </View>
        );
    } catch (e) {
        console.log(e);
        return null;
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        borderBottomColor: 'rgba(221,221,221,1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: MAIN_HEADER_HEIGHT,
        paddingTop: 7,
        width
    },
    headerCenter: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        height: MAIN_HEADER_HEIGHT,
        lineHeight: MAIN_HEADER_HEIGHT,
        textAlign: 'center'
    },
    headerLeft: {
        height: MAIN_HEADER_HEIGHT,
        width: 70,
    },
    headerRight: {
        height: MAIN_HEADER_HEIGHT,
        lineHeight: MAIN_HEADER_HEIGHT,
        paddingRight: 10,
        textAlign: 'center',
        width: 70
    },
    returnBtn: {
        alignItems: 'flex-start',
        height: MAIN_HEADER_HEIGHT,
        justifyContent: 'center',
        paddingLeft: 20,
        width: 70,
    },
});
