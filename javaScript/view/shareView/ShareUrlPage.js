import React, { useState, useEffect } from 'react';
import { SafeAreaView, Share, Text, TouchableOpacity, StyleSheet, View, TextInput } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { css } from '../../assets/style/css';
import toast from '../../utils/toast';
import { childrenLink } from '../../utils/api';

function ShareUrlPage () {
    const [links, setLink] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const view = [];

    useEffect(() => {
        childrenLink().then(r => {
            if (!r.error) {
                const { invite_code, link_list } = r.data;
                setInviteCode(invite_code);
                setLink(link_list);
            }
            console.log(r);
        });
    }, []);

    function onShare (title = 'xxx', message = 'xxx') {
        try {
            Share.share({ title, message }).then(result => {
                if (result.action === Share.sharedAction) {

                } else if (result.action === Share.dismissedAction) {

                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    links.forEach(link => {
        const { link_id, url, info } = link;
        const message = `${info}${url}${inviteCode}`;
        view.push(
            <View style={styles.itemView} key={link_id}>
                <TextInput
                    value={info}
                    editable={false}
                    multiline={true}
                    numberOfLines={2}
                    style={styles.input} />
                <View style={[css.flexRCSB, { height: 50 }]}>
                    <TouchableOpacity activeOpacity={1} style={styles.lBtn} onPress={() => {
                        Clipboard.setString(message.toString());
                        toast('复制成功');
                    }}>
                        <Text style={{ color: '#fff' }}>复制文案</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.lBtn, { backgroundColor: '#FF6C00' }]} onPress={() => {
                        onShare(info, message);
                    }}>
                        <Text style={{ color: '#fff' }}>邀请好友</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FF9C00', padding: 15 }]}>{view}</SafeAreaView>;
}

const styles = StyleSheet.create({
    input: {
        borderBottomColor: '#F2F2F2',
        borderBottomWidth: 1,
        height: 60,
        width: '100%'
    },
    itemView: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 120,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        width: '100%'
    },
    lBtn: {
        alignItems: 'center',
        backgroundColor: '#FF9C00',
        borderRadius: 22,
        height: 28,
        justifyContent: 'center',
        width: 92
    }
});

export default ShareUrlPage;
