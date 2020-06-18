import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Header from '../../components/Header';
import card1 from '../../assets/icon/card/card1.png';

const TYPE_DATA = [card1, card1, card1, card1, card1];
export default function CardPackagePage () {
    const [item, setItem] = useState({
        id: 1,
        type: 1,
        number: 10,
        label: '特权卡',
        instructions: '提现时自动使用。',
        scope: '提现要手续费的金额。',
        features: '提现免手续费一次。'
    },);
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>道具记录</Text>;
    const CARDS = [
        {
            id: 1,
            type: 1,
            number: 10,
            label: '特权卡',
            instructions: '提现时自动使用。1',
            scope: '提现要手续费的金额。1',
            features: '提现免手续费一次。1'
        },
        {
            id: 2,
            type: 1,
            number: 10,
            label: '特权卡',
            instructions: '提现时自动使用。2',
            scope: '提现要手续费的金额。2',
            features: '提现免手续费一次。2'
        },
        {
            id: 3,
            type: 1,
            number: 10,
            label: '特权卡',
            instructions: '提现时自动使用。3',
            scope: '提现要手续费的金额。3',
            features: '提现免手续费一次。3'
        },
        {
            id: 4,
            type: 1,
            number: 10,
            label: '特权卡',
            instructions: '提现时自动使用。',
            scope: '提现要手续费的金额。',
            features: '提现免手续费一次。'
        },
        {
            id: 5,
            type: 1,
            number: 10,
            label: '特权卡',
            instructions: '提现时自动使用。',
            scope: '提现要手续费的金额。',
            features: '提现免手续费一次。'
        },
    ];

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '道具背包' } }} navigation={N} onPress={() => {
                N.navigate('CardPackageRecordsPage');
            }} headerRight={headerRight}/>
            <ScrollView>
                <RenderCard cards={CARDS} setItem={setItem} item={item}/>
                <View style={styles.detail}>
                    <Text style={styles.title} numberOfLines={1}>道具说明：</Text>
                    <Text style={styles.text} numberOfLines={1}>道具名称：{item.label}</Text>
                    <Text style={styles.text} numberOfLines={1}>道具数量：{item.number}</Text>
                    <Text style={styles.text} numberOfLines={1}>使用方法：{item.instructions}</Text>
                    <Text style={styles.text} numberOfLines={1}>适用范围：{item.scope}</Text>
                    <Text style={styles.text} numberOfLines={1}>道具功能：{item.features}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderCard ({ cards, setItem, item }) {
    const components = [];
    cards.forEach(card => {
        components.push(
            <TouchableOpacity onPress={() => {
                setItem(card);
            }} style={[styles.cardItem, { borderColor: card.id === item.id ? '#FFE06F' : '#F1F1F1', backgroundColor: card.id === item.id ? '#FFF6D7' : '#F1F1F1' }]}>
                <Text style={{ color: '#353535', fontSize: 14, fontWeight: '500' }}>{card.label}</Text>
                <Image source={TYPE_DATA[card.type]} style={{ height: 43 / 1.3, width: 34 / 1.3 }}/>
                <Text style={{ color: '#FF6C00', fontSize: 14 }}>x{card.number}</Text>
            </TouchableOpacity>
        );
    });
    return (
        <View style={styles.cardView}>
            {components}
        </View>
    );
}

const styles = StyleSheet.create({
    cardItem: {
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        height: 95,
        justifyContent: 'space-between',
        marginLeft: '2%',
        marginRight: '2%',
        marginTop: 15,
        paddingBottom: 7,
        paddingTop: 7,
        width: '21%'
    },
    cardView: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        marginTop: 10,
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        width: '100%'
    },
    detail: {
        backgroundColor: '#fff',
        minHeight: 100,
        padding: 15,
        width: '100%'
    },
    text: {
        color: '#353535',
        fontSize: 13,
        lineHeight: 24
    },
    title: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10
    }
});
