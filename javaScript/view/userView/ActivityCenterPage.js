import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import { N } from '../../utils/router';
import { activity } from '../../utils/api';
import { transformTime } from '../../utils/util';

const itemHeight = 170;
const itemMarginTop = 10;

export default function ActivityCenterPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <View style={{ paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={async (page, num, callback) => {
                        activity(page, num).then(r => {
                            if (!r.error) {
                                callback(r.data);
                            }
                        });
                    }}
                    renderItem={item => {
                        const { activity_id, des, path, icon, start_datetime, title } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={activity_id}>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: icon }} style={styles.image} />
                                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: '#353535', maxWidth: 130 }}>{title}</Text>
                                        </View>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            N.navigate(path);
                                        }}>
                                            <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '500', color: '#353535' }}>查看详情 》</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text numberOfLines={2} style={styles.text}>{des}</Text>
                                    <View style={[css.flexRCSB, styles.item, { borderTopWidth: 1, borderTopColor: '#EDEDED', marginTop: 20 }]}>
                                        <Text numberOfLines={1} style={{ maxWidth: 250, fontSize: 14, color: '#353535' }}>活动时间：{transformTime(start_datetime)}</Text>
                                        <Text numberOfLines={1} style={{ maxWidth: 180, fontSize: 14, color: '#FA6400', fontWeight: '500' }}>即将结束</Text>
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
        height: 20,
        marginRight: 5,
        width: 20
    },
    item: {
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    itemView: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: itemHeight,
        marginTop: itemMarginTop
    },
    text: {
        color: '#999',
        fontSize: 12,
        lineHeight: 25,
        paddingLeft: 15,
        paddingRight: 15
    }
});
