import React from 'react';
import { Dimensions, Text, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import header1 from '../assets/icon/header/header1.png';
import header2 from '../assets/icon/header/header2.png';

const { width } = Dimensions.get('window');

export default function Header ({ scene, previous, navigation, replace }) {
    const { options } = scene.descriptor;

    return (
        <View style={styles.header}>
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
            <View style={styles.headerRight}/>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        borderBottomColor: 'rgba(221,221,221,1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 63,
        width,
    },
    headerCenter: {
        fontSize: 16,
        fontWeight: '500',
        height: 63,
        lineHeight: 63,
        textAlign: 'center',
        width: width - 140,
    },
    headerLeft: {
        height: 63,
        width: 70,
    },
    headerRight: {
        height: 63,
        lineHeight: 63,
        textAlign: 'center',
        width: 70,
    },
    returnBtn: {
        alignItems: 'center',
        height: 63,
        justifyContent: 'center',
        width: 70,
    },
});
