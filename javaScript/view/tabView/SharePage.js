import React from 'react';
import { SafeAreaView, Text, Image, View, Dimensions, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { css } from '../../assets/style/css';
import share1 from '../../assets/icon/share/share1.png';
import share2 from '../../assets/icon/share/share2.png';
import share3 from '../../assets/icon/share/share3.png';
import Shadow from '../../components/Shadow';
import ImageAuto from '../../components/ImageAuto';

const { height, width } = Dimensions.get('window');
const SHARE_ITEM_WIDTH = width * 0.9;
const SHARE_ITEM_RADIUS = 10; // welfare
const WALFARE_ONE_height = 160;
export default function SharePage () {
    console.log(Image.resolveAssetSource(share1), '??');
    return (
        <SafeAreaView style={css.safeAreaView}>
            <ScrollView style={styles.scrollWrap}>
                <View source={share1} style={[styles.shareBgWrap, css.pr]}>
                    <ImageAuto source={share1} style={[css.pa, styles.shareBg]}/>
                    <View style={[css.flex, styles.codeWrap, css.auto, css.sp]}>
                        <Text style={styles.inviteCode}>我的邀请码：<Text style={styles.codeNumber}>A32321</Text> </Text>
                        <Text style={styles.copyBtn}>复制</Text>
                    </View>
                    <View style={[styles.inviteWrap, css.auto]}>

                    </View>
                    <View style={[styles.welfareWrap, css.auto, css.flex, css.fw]}>
                        <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                            <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                <Text style={styles.shareTitleText}>福利一</Text>
                            </ImageBackground>
                            <Shadow style={styles.welfareInner}>
                                <View style={[styles.welfareInner, { backgroundColor: '#fff' }]}>
                                </View>
                            </Shadow>
                        </View>
                        <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                            <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                <Text style={styles.shareTitleText}>福利二</Text>
                            </ImageBackground>
                            <Shadow style={styles.welfareInner}>
                                <View style={[styles.welfareInner, { backgroundColor: '#fff' }]}>
                                </View>
                            </Shadow>
                        </View>
                        <Image source={share3} style={styles.shareInfoImage}/>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    codeNumber: {
        color: '#FF4400',
        fontSize: 16,
    },
    codeWrap: {
        height: width * 0.2,
        paddingHorizontal: 15,
        width: width * 0.75,
    },
    copyBtn: {
        borderColor: '#FF3B00',
        borderRadius: 15,
        borderWidth: 1,
        color: '#FF3B00',
        fontSize: 13,
        height: 30,
        lineHeight: 30,
        overflow: 'hidden',
        textAlign: 'center',
        width: 60,
    },
    inviteCode: {
        color: '#353535',
        fontSize: 13,
    },
    inviteWrap: {
        height: width * 0.35,
        paddingHorizontal: 15,
        width: width * 0.75,
    },
    scrollWrap: {
        backgroundColor: '#FF9331',
    },
    shareBg: {
        width,
        zIndex: -1,
    },
    shareBgWrap: {
        height: 'auto',
        paddingTop: width * 0.6,
        width,
    },
    shareInfoImage: {
        height: width * 0.93 * 951 / 1065,
        width: width * 0.93,
        // eslint-disable-next-line react-native/sort-styles
        marginTop: 20,
    },
    shareTitle: {
        height: width * 0.45 * 93 / 522,
        top: 0,
        width: width * 0.45,
        zIndex: 10,
    },
    shareTitleText: {
        color: '#803000',
        fontSize: 15,
        fontWeight: '900',
    },
    welfareInner: {
        borderRadius: SHARE_ITEM_RADIUS,
        height: WALFARE_ONE_height,
        width: SHARE_ITEM_WIDTH
    },
    welfareItemWrap: {
        height: 'auto',
        marginTop: 20,
        paddingTop: 5,
        width: 'auto',
    },
    welfareWrap: {
        height: 'auto',
        paddingHorizontal: 15,
        width: SHARE_ITEM_WIDTH,
    },
});
