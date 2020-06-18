import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import card2 from '../../assets/icon/card/card2.png';

const itemHeight = 130;
const itemMarginTop = 10;

const TYPE_DATA = [card2, card2, card2, card2, card2];
export default function CardPackageRecordsPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <View style={{ paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={async (page, num, callback) => {
                        // eslint-disable-next-line standard/no-callback-literal
                        callback([
                            {
                                id: 1,
                                type: 1,
                                cardType: 1,
                                number: 10,
                                label: '特权卡',
                                instructions: '提现时自动使用。',
                                time: '2020.01.15 15:1'
                            },
                            {
                                id: 1,
                                type: 1,
                                cardType: 1,
                                number: 10,
                                label: '特权卡',
                                instructions: '提现时自动使用。',
                                time: '2020.01.15 15:1'
                            },
                            {
                                id: 1,
                                type: 2,
                                cardType: 1,
                                number: 10,
                                label: '特权卡',
                                instructions: '提现时自动使用。',
                                time: '2020.01.15 15:1'
                            },
                        ]);
                    }}
                    renderItem={item => {
                        return (
                            <>
                                <View style={styles.itemView} key={item.id}>
                                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={TYPE_DATA[item.cardType]} style={styles.image} />
                                            <Text numberOfLines={1} style={{ fontSize: 14, color: '#353535', maxWidth: 130 }}>{item.label}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: 14, color: item.type === 1 ? '#FF3B00' : '#53C23B' }}>{item.type === 1 ? '使用道具' : '获得道具'}</Text>
                                    </View>
                                    <View style={ [styles.item, styles.itemBottom]}>
                                        <View style={css.flexRCSB}>
                                            <Text numberOfLines={1} style={[styles.text, { maxWidth: 180 }]}>{item.type === 1 ? '道具用途：' : '道具来源：'}{item.instructions}</Text>
                                            <Text numberOfLines={1} style={styles.text}>使用数量：{item.number}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>获得时间：{item.time}</Text>
                                    </View>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 30,
        marginRight: 5,
        width: 30
    },
    item: {
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    itemBottom: {
        height: 70,
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingTop: 15
    },
    itemView: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: itemHeight,
        marginTop: itemMarginTop
    },
    text: {
        color: '#353535',
        fontSize: 14
    },
});
