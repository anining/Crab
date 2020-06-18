import React from 'react';
import { Image, Text, View } from 'react-native';
import card3 from '../assets/icon/card/card3.png';
/**
 * 使用说明
 * <Null text="提现说明：" />**/
export default function Null ({ text }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 70 }}>
            <Image source={card3} style={{ height: 122, width: 206 }} />
            <Text style={{ fontSize: 15, color: '#353535', fontWeight: '500', marginTop: 10 }}>{text}</Text>
        </View>
    );
}
