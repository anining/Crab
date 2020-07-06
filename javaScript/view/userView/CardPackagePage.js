import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Header from '../../components/Header';
import Null from '../../components/Null';
import { prop } from '../../utils/api';

function CardPackagePage () {
    const [cards, setCards] = useState([]);
    const [item, setItem] = useState({});
    const headerRight = <Text style={{ color: '#FF6C00' }}>道具记录</Text>;

    useEffect(() => {
        prop().then(r => {
            if (!r.error && r.data.length) {
                setCards(r.data);
                setItem(r.data[0]);
            }
        });
    }, []);

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '道具背包' } }} navigation={N} onPress={() => N.navigate('CardPackageRecordsPage')} headerRight={headerRight}/>
            <RenderView cards={cards} item={item} setItem={setItem}/>
        </SafeAreaView>
    );
}

function RenderView ({ cards, setItem, item }) {
    if (!cards.length) {
        return <Null text='你还没有道具哦～'/>;
    }
    const { label, usage_range, desc, function: f, usage, num } = item;
    return (
        <ScrollView>
            <RenderCard cards={cards} setItem={setItem} item={item}/>
            <View style={styles.detail}>
                <Text style={styles.title} numberOfLines={1}>道具说明：</Text>
                <Text style={styles.text} numberOfLines={1}>道具名称：{label}</Text>
                <Text style={styles.text} numberOfLines={1}>道具数量：{num}</Text>
                <Text style={styles.text} numberOfLines={1}>使用方法：{usage}</Text>
                <Text style={styles.text} numberOfLines={1}>适用范围：{usage_range}</Text>
                <Text style={styles.text}>道具功能：{f}</Text>
                <Text style={styles.text}>道具描述：{desc}</Text>
            </View>
        </ScrollView>
    );
}

function RenderCard ({ cards, setItem, item }) {
    const view = [];
    cards.forEach(card => {
        const { prop_id, label, icon: uri, num } = card;
        const { prop_id: id } = item;
        const value = prop_id === id;
        view.push(
            <TouchableOpacity activeOpacity={1} onPress={() => setItem(card)} key={prop_id} style={[styles.cardItem, { borderColor: value ? '#FFE06F' : '#F1F1F1', backgroundColor: value ? '#FFF6D7' : '#F1F1F1' }]}>
                <Text numberOfLines={1} style={{ color: '#353535', fontWeight: '500' }}>{label}</Text>
                <Image source={{ uri }} style={{ height: 43 / 1.3, width: 34 / 1.3 }}/>
                <Text style={{ color: '#FF6C00' }}>x{num}</Text>
            </TouchableOpacity>
        );
    });
    return (
        <View style={styles.cardView}>
            {view}
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

export default CardPackagePage;
