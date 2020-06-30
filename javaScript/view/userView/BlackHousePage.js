import React from 'react';
import { Dimensions, SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import house1 from '../../assets/icon/house/house1.png';
import { userBaned } from '../../utils/api';
import { transformTime } from '../../utils/util';

const { height, width } = Dimensions.get('window');
const itemHeight = 100;
const itemMarginTop = 10;

function BlackHousePage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Image source={house1} style={{ width, height: 291 / 1125 * width }}/>
            <View style={{ paddingLeft: 15, paddingRight: 15, height: height - 63 - (291 / 1125 * width), backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={ (page, num, callback) => {
                        userBaned(page, num).then(r => {
                            !r.error && callback(r.data);
                        });
                    }}
                    renderItem={item => {
                        const { updated_at, nickname, avatar, baned_reason, baned_time } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={nickname + updated_at}>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: avatar }} style={styles.image} />
                                            <Text numberOfLines={1} style={{ fontSize: 14, color: '#222', maxWidth: 130 }}>{nickname}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: 13, color: '#999' }}>封停时间：{transformTime(updated_at)}</Text>
                                    </View>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <Text numberOfLines={1} style={[styles.text, { maxWidth: 150 }]}>封停原因：{baned_reason || '错误使用账号'}</Text>
                                        <Text numberOfLines={1} style={styles.text}>解封时间：{transformTime(baned_time)}</Text>
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
        borderRadius: 15,
        height: 30,
        marginRight: 5,
        width: 30
    },
    item: {
        height: '40%',
        width: '100%'
    },
    itemView: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: itemHeight,
        justifyContent: 'center',
        marginTop: itemMarginTop,
        paddingLeft: 15,
        paddingRight: 15
    },
    text: {
        color: '#353535',
        fontSize: 14
    }
});

export default BlackHousePage;
