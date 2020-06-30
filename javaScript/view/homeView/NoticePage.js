import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import { notice } from '../../utils/api';
import { N } from '../../utils/router';
import { transformTime } from '../../utils/util';
import header3 from '../../assets/icon/header/header3.png';
import Header from '../../components/Header';

const itemHeight = 150;
const itemMarginTop = 10;

function NoticePage () {
    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
            <Header color={'#fff'} label={'系统通知'} style={[{ backgroundColor: '#FED465', borderBottomWidth: 0 }]} icon={header3}/>
            <View style={{ paddingLeft: 15, paddingRight: 15, flex: 1 }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={async (page, num, callback) => {
                        notice(page, num).then(r => {
                            if (!r.error) {
                                callback(r.data);
                            }
                        });
                    }}
                    renderItem={item => {
                        const { updated_at, notice_id, title, content, avatar = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png' } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={notice_id}>
                                    <View style={[css.flexRCSB, styles.item]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: avatar }} style={styles.image} />
                                            <Text numberOfLines={1} style={{ fontSize: 14, color: '#222', maxWidth: 130 }}>{title}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: 13, color: '#999' }}>{transformTime(updated_at)}</Text>
                                    </View>
                                    <Text numberOfLines={2} style={styles.content}>{content}</Text>
                                    <TouchableOpacity onPress={() => {
                                        N.navigate('NoticeDetailPage', { content });
                                    }}>
                                        <Text numberOfLines={1} style={styles.btn}>查看详情 》</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

export default NoticePage;

const styles = StyleSheet.create({
    btn: {
        alignSelf: 'flex-end',
        color: 'rgba(255,71,0,1)',
        fontSize: 12,
        fontWeight: '500'
    },
    content: {
        lineHeight: 25,
        paddingLeft: 45
    },
    image: {
        borderRadius: 45,
        height: 45,
        marginRight: 5,
        width: 45
    },
    item: {
        height: 50,
        width: '100%'
    },
    itemView: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: itemHeight,
        justifyContent: 'space-between',
        marginTop: itemMarginTop,
        padding: 15
    },
    text: {
        color: '#353535',
        fontSize: 14
    }
});
