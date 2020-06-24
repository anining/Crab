import React, { useEffect } from 'react';
import { DeviceEventEmitter, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity6 from '../../assets/icon/activity/activity6.png';
import Header from '../../components/Header';

export default function GlossaryPage () {
    useEffect(() => {

    }, []);

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
            <Header color={'#fff'} label={'生词本'} style={{ backgroundColor: '#FED465', borderBottomWidth: 0 }} icon={header3}/>
            <Text>GlossaryPage</Text>
        </SafeAreaView>
    );
}
