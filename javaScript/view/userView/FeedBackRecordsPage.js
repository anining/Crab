import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';

const itemHeight = 250;
const itemMarginTop = 10;
export default function FeedBackRecordsPage () {
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
                                time: '2020.01.15',
                                type: '遇到问题',
                                phone: 'prismslight',
                                reason: '提现遇到问题',
                                images: ['https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090', 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090']
                            },
                            {
                                time: '2020.01.15',
                                type: '遇到问题',
                                phone: 'prismslight',
                                reason: '提现遇到问题',
                                images: ['https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090', 'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090']
                            },
                            {
                                time: '2020.01.15',
                                type: '遇到问题',
                                phone: 'prismslight',
                                reason: '提现遇到问题',
                                images: ['https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1793749814,3186819134&fm=85&app=92&f=JPEG?w=121&h=75&s=EFA40FC07C71108C241C41300300B090']
                            },
                        ]);
                    }}
                    renderItem={item => {
                        return (
                            <>
                                <View style={styles.itemView} key={item.time + item.phone}>
                                    <Text numberOfLines={1} style={styles.time}>反馈时间：{item.time}</Text>
                                    <Text numberOfLines={1} style={styles.type}>反馈类型：<Text style={{ color: '#353535' }}>{item.type}</Text></Text>
                                    <Text numberOfLines={1} style={styles.type}>联系方式：<Text style={{ color: '#353535' }}>{item.phone}</Text></Text>
                                    <Text numberOfLines={1} style={styles.type}>问题描述：<Text style={{ color: '#353535' }}>{item.reason}</Text></Text>
                                    <RenderImage images={item.images}/>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function RenderImage ({ images }) {
    const components = [];
    images.forEach(image => {
        components.push(<Image key={image} source={{ uri: image }} style={styles.image} />);
    });
    return (
        <View style={styles.imageView}>
            {components}
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 6,
        height: 60,
        marginRight: 5,
        width: 60
    },
    imageView: {
        alignItems: 'center',
        borderTopColor: '#EDEDED',
        borderTopWidth: 1,
        flexDirection: 'row',
        marginTop: 10,
        padding: 15
    },
    itemView: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: itemHeight,
        marginTop: itemMarginTop
    },
    time: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        color: '#353535',
        fontSize: 14,
        lineHeight: 50,
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 15
    },
    type: {
        color: '#999',
        fontSize: 14,
        lineHeight: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
});
