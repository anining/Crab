import React, { useEffect } from 'react';
import { SafeAreaView, Image, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import activity1 from '../../assets/icon/activity/activity1.png';
import activity2 from '../../assets/icon/activity/activity2.png';
import { N } from '../../utils/router';
import { activity } from '../../utils/api';

const itemHeight = 170;
const itemMarginTop = 10;
const TYPE_DATA = [activity2, activity2, activity1];

export default function ActivityCenterPage () {
    useEffect(() => {
        activity().then(r => {
            console.log(r);
        });
    }, []);
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
                                type: 1,
                                path: '',
                                label: '天天领现金',
                                detail: '天天送红包！提交并且通过指定数量的任务就可以开红包，最低每天天送红包！提交并且通过指定数量的任务就……',
                                deadline: '长期有效',
                                tag: '即将结束'
                            },
                            {
                                type: 2,
                                path: '',
                                label: '天天领现金',
                                detail: '天天送红包！提交并且通过指定数量的任务就可以开红包，最低每天天送红包！提交并且通过指定数量的任务就……',
                                deadline: '长期有效',
                                tag: '即将结束'
                            },
                            {
                                type: 1,
                                path: '',
                                label: '天天领现金',
                                detail: '天天送红包！提交并且通过指定数量的任务就可以开红包，最低每天天送红包！提交并且通过指定数量的任务就……',
                                deadline: '长期有效',
                                tag: '即将结束'
                            },
                        ]);
                    }}
                    renderItem={item => {
                        return (
                            <>
                                <View style={styles.itemView} key={item.type + item.detail}>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={TYPE_DATA[item.type]} style={styles.image} />
                                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: '#353535', maxWidth: 130 }}>{item.label}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            // N.navigate(item.path);
                                        }}>
                                            <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '500', color: '#353535' }}>查看详情 》</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text numberOfLines={2} style={styles.text}>封停期限：{item.detail}</Text>
                                    <View style={[css.flexRCSB, styles.item, { borderTopWidth: 1, borderTopColor: '#EDEDED', marginTop: 20 }]}>
                                        <Text numberOfLines={1} style={{ maxWidth: 180, fontSize: 14, color: '#353535' }}>活动时间：{item.deadline}</Text>
                                        <Text numberOfLines={1} style={{ maxWidth: 180, fontSize: 14, color: '#FA6400', fontWeight: '500' }}>{item.tag}</Text>
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
    },
});
