import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import chat2 from '../assets/icon/chat/chat2.png';
/**
 * 使用说明
 * <Crab text="兑换说明：" paddingLeft={0}/>**/
export default function Crab ({ text, paddingLeft = 20 }) {
    return (
        <View style={[styles.titleView, { paddingLeft, }]}>
            <Image source={chat2} style={{ height: 18, width: 22, marginRight: 5 }}/>
            <Text style={styles.title}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    titleView: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 15,
        paddingRight: 20,
    }
});
