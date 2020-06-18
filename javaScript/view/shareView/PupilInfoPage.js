import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { css } from '../../assets/style/css';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import Shadow from '../../components/Shadow';

export default function PupilInfoPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header label={'师徒信息'} />
            <ScrollView style={[styles.scrollWrap]}>
                <View style={[styles.infoHeader, css.pr]}>
                    <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.infoHeaderBg]}>
                    </LinearGradient>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    infoHeader: {
        backgroundColor: '#eeeeee',
        height: 200,
        paddingTop: 20
    },
    infoHeaderBg: {
        ...css.pa,
        height: 100,
        width: '100%',
        zIndex: -1
    },
    scrollWrap: {
        backgroundColor: '#f8f8f8',
        flex: 1
    }
});
