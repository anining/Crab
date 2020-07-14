import { useState, useEffect } from 'react';
import * as React from 'karet';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Dimensions, View, ImageBackground } from 'react-native';
import { css } from '../../assets/style/css';
import answer17 from '../../assets/icon/answer/answer17.png';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import { _if, requestPermission } from '../../utils/util';
import toast from '../../utils/toast';
import Crab from '../../components/Crab';
import QRCode from 'react-native-qrcode-svg';
import { urlSuo, wxToken } from '../../utils/api';
import { getter } from '../../utils/store';

const { width } = Dimensions.get('window');
const { avatar, openid } = getter(['user.avatar', 'user.openid', 'user']);

function WeChatBindPage () {
    const [view, setView] = useState();
    const [token, setToken] = useState();
    const [value, setValue] = useState();

    useEffect(() => {
        wxToken().then(r => {
            !r.error && setToken(r.data.token);
        });
    }, []);

    useEffect(() => {
        if (token) {
            try {
                (async () => {
                    const URI = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx660a4724f56fdba5&redirect_uri=https%3A%2F%2Fbind.libratb.com&response_type=code&scope=snsapi_userinfo&state=${token}#wechat_redirect`;
                    const ret = await urlSuo(URI);
                    console.log(ret);
                    if (ret && !ret.error && ret.data.url) {
                        setValue(ret.data.url);
                    }
                })();
            } catch (e) {
                console.log(e);
            }
        }
    }, [token]);

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
            <ImageBackground source={answer17} style={[styles.image, { position: 'relative' }]} ref={ref => setView(ref)}>
                <View style={{ position: 'absolute', top: '24.5%', left: '15.5%' }}>
                    {_if(value, res => <Render value={res}/>)}
                </View>
            </ImageBackground>
            <TouchableOpacity onPress={save} style={styles.btn}>
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

function Render ({ value, uri = avatar.get() }) {
    if (uri && openid.get()) {
        return (
            <QRCode
                logo={{ uri }}
                logoSize={50}
                logoBackgroundColor='transparent'
                value={value}
                size={width * 0.48}
                logoMargin={2}
                logoBorderRadius={5}
                color={'#333'}
                backgroundColor={'#fff'}
            />
        );
    }
    return (
        <QRCode
            value={value}
            size={width * 0.48}
            color={'#333'}
            backgroundColor={'#fff'}
        />
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
        backgroundColor: '#fff',
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
