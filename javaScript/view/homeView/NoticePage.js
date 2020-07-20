import React, { Component } from 'react';
import { TouchableOpacity, SafeAreaView, Image, Text, StyleSheet, View, InteractionManager } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import { notice } from '../../utils/api';
import { N } from '../../utils/router';
import { _if, transformTime } from '../../utils/util';
import header3 from '../../assets/icon/header/header3.png';
import Header from '../../components/Header';

const itemHeight = 150;
const itemMarginTop = 10;
export default class NoticePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            readList: [],
        };
    }

    static _getStr (content) {
        try {
            return content.replace(/<[^>]*>|/g, '');
        } catch (e) {
            return content;
        }
    }

    render () {
        return (
            <View style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <Header color={'#fff'} label={'系统通知'} style={[{ backgroundColor: '#FED465', borderBottomWidth: 0 }]} icon={header3}/>
                <View style={{ paddingLeft: 15, paddingRight: 15, flex: 1 }}>
                    <ListGeneral
                        itemHeight={itemHeight}
                        itemMarginTop={itemMarginTop}
                        getList={async (page, num, callback) => {
                            InteractionManager.runAfterInteractions(() => {
                                notice(page, num).then(r => {
                                    if (r && !r.error) {
                                        callback(r.data.notices);
                                    }
                                });
                            });
                        }}
                        renderItem={item => {
                            const { updated_at, notice_id, title, content, is_read: isRead } = item;
                            return (
                                <>
                                    <View style={styles.itemView} key={notice_id}>
                                        <View style={[css.flexRCSB, styles.item]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {_if(!this.state.readList.includes(notice_id) && !isRead, res => <Text numberOfLines={1} style={{ fontSize: 12, color: '#e33a16' }}>【未读】</Text>)}
                                                <Text numberOfLines={1} style={{ fontSize: 13, color: '#222', maxWidth: 130 }}>{title}</Text>
                                            </View>
                                            <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>{transformTime(updated_at)}</Text>
                                        </View>
                                        <Text numberOfLines={2} style={styles.content}>{NoticePage._getStr(content)}</Text>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            N.navigate('NoticeDetailPage', { content, notice_id });
                                            this.setState({
                                                readList: [...this.state.readList, notice_id]
                                            });
                                        }}>
                                            <Text numberOfLines={1} style={styles.btn}>查看详情 》</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btn: {
        alignSelf: 'flex-end',
        color: 'rgba(255,71,0,1)',
        fontSize: 12,
        fontWeight: '500'
    },
    content: {
        lineHeight: 25,
        paddingLeft: 15,
        width: '100%'
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
