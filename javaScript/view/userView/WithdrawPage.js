import React from 'react';
import { SafeAreaView, ScrollView, ImageBackground, StyleSheet, Text, View, Dimensions } from 'react-native';
import { css } from '../../assets/style/css';
import withdrawPage1 from '../../assets/icon/withdrawPage/withdrawPage1.png';

const { width } = Dimensions.get('window');
export default function WithdrawPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <ScrollView style={{
                flex: 1,
                backgroundColor: '#F8F8F8',
                paddingRight: 10,
                paddingLeft: 10,
                paddingTop: 10
            }}>
                <ImageBackground source={withdrawPage1} style={styles.moneyView}>
                    <View style={styles.moneyViewTop}>
                        <Text style={{ fontWeight: '600', fontSize: 31, color: '#fff' }}>1520.5</Text>
                        <Text style={{ fontSize: 11, color: '#fff' }}>可提现收益(金币)</Text>
                    </View>
                    <View style={styles.moneyViewBottom}>
                        <View style={[styles.moneyViewItem, {
                            borderRightWidth: 1,
                            borderRightColor: '#FFF'
                        }]}>
                            <Text style={{ fontWeight: '800', fontSize: 14, color: '#fff' }}>500W</Text>
                            <Text style={{ fontSize: 11, color: '#fff' }}>今日收益(金币)</Text>
                        </View>
                        <View style={styles.moneyViewItem}>
                            <Text style={{ fontWeight: '800', fontSize: 14, color: '#fff' }}>500W</Text>
                            <Text style={{ fontSize: 11, color: '#fff' }}>今日收益(金币)</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View></View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    moneyView: {
        height: (width - 20) * 468 / 1089,
        width: width - 20
    },
    moneyViewBottom: {
        flexDirection: 'row',
        height: '25%',
        marginTop: '5%',
        width: '100%',
    },
    moneyViewItem: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        width: '50%',
    },
    moneyViewTop: {
        alignItems: 'center',
        height: '50%',
        justifyContent: 'flex-end',
        marginLeft: '25%',
        width: '50%'
    }
});
