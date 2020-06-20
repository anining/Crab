import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import { getFeedback } from '../../utils/api';
import { transformTime } from '../../utils/util';

const itemHeight = 250;
const itemMarginTop = 10;
const TYPE = ['功能建议', '发现bug'];
export default function FeedBackRecordsPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <View style={{ paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={async (page, num, callback) => {
                        getFeedback(page, num).then(r => {
                            if (!r.error) {
                                callback(r.data);
                            }
                        });
                    }}
                    renderItem={item => {
                        const { feedback_id, created_at, images, feedback_type, contact, content } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={feedback_id}>
                                    <Text numberOfLines={1} style={styles.time}>反馈时间：{transformTime(created_at)}</Text>
                                    <Text numberOfLines={1} style={styles.type}>反馈类型：<Text style={{ color: '#353535' }}>{TYPE[feedback_type - 1]}</Text></Text>
                                    <Text numberOfLines={1} style={styles.type}>联系方式：<Text style={{ color: '#353535' }}>{contact}</Text></Text>
                                    <Text numberOfLines={1} style={styles.type}>问题描述：<Text style={{ color: '#353535' }}>{content}</Text></Text>
                                    <RenderImage images={images}/>
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
