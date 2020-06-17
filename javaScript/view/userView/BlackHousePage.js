import React from 'react';
import { Dimensions, SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import house1 from '../../assets/icon/house/house1.png';

const { height, width } = Dimensions.get('window');
const itemHeight = 100;
const itemMarginTop = 10;
export default function BlackHousePage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Image source={house1} style={{ width, height: 291 / 1125 * width }}/>
            <View style={{ paddingLeft: 15, paddingRight: 15, height: height - 63 - (291 / 1125 * width), backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={async (page, num, callback) => {
                        // eslint-disable-next-line standard/no-callback-literal
                        callback([
                            {
                                avatar: 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090',
                                nickName: 'nickName',
                                time: '2020.01.15',
                                deadline: '永久',
                                reason: '屡次恶意做单'
                            },
                            {
                                avatar: 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090',
                                nickName: '屡次恶意做单屡次恶意做单屡次恶意做单屡次恶意做单',
                                time: '2020.01.15',
                                deadline: '永久',
                                reason: '屡次恶意做单'
                            },
                            {
                                avatar: 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090',
                                nickName: 'nickName',
                                time: '2020.01.15',
                                deadline: '永久',
                                reason: '屡次恶意做单屡次恶意做单屡次恶意做单屡次恶意做单'
                            },
                        ]);
                    }}
                    renderItem={item => {
                        return (
                            <>
                                <View style={styles.itemView} key={item.nickName + item.time}>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: item.avatar }} style={styles.image} />
                                            <Text numberOfLines={1} style={{ fontSize: 14, color: '#222', maxWidth: 130 }}>{item.nickName}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: 13, color: '#999999' }}>封停时间：{item.time}</Text>
                                    </View>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <Text numberOfLines={1} style={[styles.text, { maxWidth: 180 }]}>封停原因：{item.reason}</Text>
                                        <Text numberOfLines={1} style={styles.text}>封停期限：{item.deadline}</Text>
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
    },
});
