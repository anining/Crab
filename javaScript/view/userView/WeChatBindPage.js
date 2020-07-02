import { useState } from 'react';
import * as React from 'karet';
import { SafeAreaView, Image, Text, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import { css } from '../../assets/style/css';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import { requestPermission } from '../../utils/util';
import toast from '../../utils/toast';
import Crab from '../../components/Crab';
import { getter } from '../../utils/store';
import * as U from 'karet.util';

const { width } = Dimensions.get('window');
const { wx_bind_qrcode: uri } = getter(['app.wx_bind_qrcode']);

function WeChatBindPage () {
    const [view, setView] = useState();

    function save () {
        requestPermission(() => {
            if (view) {
                captureRef(view, { format: 'jpg', quality: 1.0 }).then(uri => {
                    CameraRoll.saveToCameraRoll(uri)
                        .then(() => toast('保存成功,请到相册查看'))
                        .catch(() => toast('保存失败'));
                }, () => () => toast('保存失败'));
            }
        });
    }

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Image karet-lift source={U.template({ uri })} style={styles.image} ref={ref => setView(ref)}/>
            <TouchableOpacity activeOpacity={1} onPress={save} style={styles.btn}>
                <Text style={styles.btnText}>保存图片到本地</Text>
            </TouchableOpacity>
            <Crab text="绑定说明："/>
            <Text style={styles.text}>1.保存二维码到本地。</Text>
            <Text style={styles.text}>2.打开微信扫一扫，选择本地图片。</Text>
            <Text style={styles.text}>3.如果绑定失败，请通过“我的 - 帮助中心”加群联系管理员。</Text>
            <Text style={styles.text}>4.绑定微信后请刷新“我的”有您的微信昵称即绑定成功。</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#FF3E00',
        borderRadius: 22,
        height: 44,
        marginBottom: 20,
        marginLeft: width * 0.15,
        marginTop: 20,
        width: width * 0.7,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 44,
        textAlign: 'center',
    },
    image: {
        height: 894 / 786 * width * 0.7,
        marginLeft: width * 0.15,
        marginTop: 20,
        width: width * 0.7,
    },
    text: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 25,
        paddingLeft: 20,
        paddingRight: 20,
    }
});

export default WeChatBindPage;
