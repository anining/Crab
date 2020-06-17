import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { css } from '../../assets/style/css';
import Header from '../../components/Header';

export default function PupilInfoPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header/>
        </SafeAreaView>
    );
}
