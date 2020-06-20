import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Text, View, ScrollView, Image } from 'react-native';
import { css } from '../../assets/style/css';
import help1 from '../../assets/icon/help/help1.png';
import { N } from '../../utils/router';

const { width } = Dimensions.get('window');
const data = [
    {
        h1: '新手必看',
        h2: [
            {
                title: '如何做单？',
                detail: '如何做单？',
            },
            {
                title: '如何邀请徒弟？',
                detail: '如何邀请徒弟？',
            },
        ]
    },
    {
        h1: '相关活动',
        h2: [
            {
                title: '签到奖励是什么？',
                detail: '签到奖励是什么？',
            },
            {
                title: '收徒奖励获取规则？',
                detail: '收徒奖励获取规则？',
            },
        ]
    },
    {
        h1: '做单教程',
        h2: [
            {
                title: '音符点赞教程',
                detail: '音符点赞教程',
            },
            {
                title: '音符关注教程',
                detail: '音符关注教程',
            },
            {
                title: '音符评论教程',
                detail: '音符评论教程',
            },
            {
                title: '音符套餐教程',
                detail: '音符套餐教程',
            },
            {
                title: '快摄点赞教程',
                detail: '快摄点赞教程',
            },
        ]
    },
];

export default function HelpCenterPage () {
    const helpCenterView = [];
    data.forEach(answer => {
        helpCenterView.push(
            <View style={styles.container} key={answer.h1}>
                <Text style={styles.itemTitle}>{answer.h1}</Text>
                <RenderAnswerItem answers={answer.h2} />
            </View>
        );
    });
    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <ScrollView >
                {helpCenterView}
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderAnswerItem ({ answers }) {
    const answersView = [];
    answers.forEach(answer => {
        answersView.push(
            <TouchableOpacity activeOpacity={1} onPress={() => {
                N.navigate('HelpCenterDetailPage', { detail: answer.detail });
            }} style={styles.item} key={answer.title}>
                <Text style={{ color: '#666', fontSize: 14 }}>{answer.title}</Text>
                <Image source={help1} style={{ height: 13, width: 6 }}/>
            </TouchableOpacity>
        );
    });
    return <>{answersView}</>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 15,
        paddingLeft: 15,
        width
    },
    item: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        paddingRight: 15,
        width: '100%'
    },
    itemTitle: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '500',
        height: 50,
        lineHeight: 50,
        width: '100%'
    }
});
