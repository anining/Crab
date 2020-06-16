import React from 'react';
import { SafeAreaView, Image, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { css } from '../../assets/style/css';
import weChatBindPage1 from '../../assets/icon/weChatBindPage/weChatBindPage1.png';
import weChatBindPage2 from '../../assets/icon/weChatBindPage/weChatBindPage2.png';

const { width } = Dimensions.get('window');
export default function WeChatBindPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Image source={weChatBindPage1} style={styles.image} />
            <TouchableOpacity onPress={() => {

            }} style={styles.btn}>
                <Text style={styles.btnText}>保存图片到本地</Text>
            </TouchableOpacity>
            <View style={styles.titleView}>
                <Image source={weChatBindPage2} style={{ height: 18, width: 22, marginRight: 5 }} />
                <Text style={styles.title}>绑定说明：</Text>
            </View>
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
        textAlign: 'center'
    },
    image: {
        height: 894 / 786 * width * 0.7,
        marginLeft: width * 0.15,
        marginTop: 20,
        width: width * 0.7
    },
    text: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontSize: 16,
        fontWeight: '500'
    },
    titleView: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20
    }
});
