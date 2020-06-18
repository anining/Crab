import React, { Component } from 'react';
import { SafeAreaView, Text, Image, View, Dimensions, ScrollView, StyleSheet, ImageBackground, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import share1 from '../../assets/icon/share/share1.png';
import share2 from '../../assets/icon/share/share2.png';
import share3 from '../../assets/icon/share/share3.png';
import share4 from '../../assets/icon/share/share4.png';
import share5 from '../../assets/icon/share/share5.png';
import share6 from '../../assets/icon/share/share6.png';
import share7 from '../../assets/icon/share/share7.png';
import share8 from '../../assets/icon/share/share8.png';
import pop1 from '../../assets/icon/pop/pop1.png';
import Shadow from '../../components/Shadow';
import ImageAuto from '../../components/ImageAuto';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Choice from '../../components/Choice';
import { N } from '../../utils/router';

const { height, width } = Dimensions.get('window');
const SHARE_ITEM_WIDTH = width * 0.9;
const SHARE_ITEM_RADIUS = 10; // welfare
const WALFARE_ONE_height = 160;
const WALFARE_TWO_height = 600;
const cashBack = [{
    title: '徒弟首次提现到账',
    label: '师傅送1元'
}, {
    title: '徒弟第二次提现到账',
    label: '师傅送2元'
}, {
    title: '徒弟第三次提现到账',
    label: '师傅送3元'
}];
export default class SharePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {};
    }

    _renderWelfare () {
        const view = [];
        const shareLevel = [{
            icon: share4,
            title: '高级推手',
            label: <Text numberOfLine={2} style={styles.welfareLabelText}>送<Text style={{ color: '#FF8353' }}>80-120元</Text>现金红包，永久获得<Text style={{ color: '#FF8353' }}>2%</Text>徒弟<Text style={{ color: '#FF8353' }}>1%</Text>徒孙提现返佣。</Text>,
            target: <Text numberOfLine={1} style={styles.welfareTargetText}>要求500徒弟提现，已提现的徒弟 80/100</Text>,
        }, {
            icon: share5,
            title: '钻石推手',
            label: <Text numberOfLine={2} style={styles.welfareLabelText}>送<Text style={{ color: '#FF8353' }}>300-520</Text>元现金红包，永久获得<Text style={{ color: '#FF8353' }}>2%</Text>徒弟<Text style={{ color: '#FF8353' }}>1%</Text>徒孙提现返佣。</Text>,
            target: <Text numberOfLine={1} style={styles.welfareTargetText}>要求500徒弟提现，已提现的徒弟 80/100</Text>,
        }, {
            icon: share6,
            title: '顶级推手',
            label: <Text numberOfLine={2} style={styles.welfareLabelText}>送<Text style={{ color: '#FF8353' }}>1888元</Text>现金红包，永久获得2%徒弟1%徒孙提现返佣。</Text>,
            target: <Text numberOfLine={1} style={styles.welfareTargetText}>要求500徒弟提现，已提现的徒弟 80/100</Text>,
        }];
        shareLevel.forEach((item, index) => {
            view.push(<View style={[styles.welfareProgressWrap, css.flex, css.fw, css.afs]} key={`shareLevel${index}`}>
                <View style={[css.flex, css.js, styles.wpiTitleWrap]}>
                    <ImageAuto source={item.icon} style={{ width: 32, marginRight: 10 }}/>
                    <Text style={[styles.welfareTitleText]}>{item.title}</Text>
                </View>
                {item.label}
                {this._renderProgress()}
                {item.target}
            </View>);
        });
        return view;
    }

    _renderProgress () {
        try {
            return <View style={[css.flex, css.js, styles.progressWrap, css.auto]}>
                <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.progressInner]} />
            </View>;
        } catch (e) {
            return null;
        }
    }

    _renderShareTitle (title) {
        return <View style={[styles.wShareTitle, css.pr]}>
            <ImageAuto source={share8} style={{
                width: 20,
                ...css.pa,
            }}/>
            {title || <Text>自定义标题</Text>}
        </View>;
    }

    _renderCashBack () {
        try {
            const view = [];
            cashBack.forEach((item, index) => {
                view.push(<Animatable.View useNativeDriver={true} iterationDelay={4000} delay={(index + 1) * 2000} iterationCount="infinite" animation="bounce" style={[css.pr, styles.cashBackItem]}>
                    <ImageAuto source={share7} style={{
                        width: width * 0.9 * 0.25,
                        ...css.pa,
                    }}/>
                    <Text style={[css.pa, styles.cashTitle]}>{item.title}</Text>
                    <Text style={[css.pa, styles.cashLabel]}>{item.label}</Text>
                </Animatable.View>);
            });
            return view;
        } catch (e) {
            return null;
        }
    }

    render () {
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
                            <Animatable.View useNativeDriver={true} iterationDelay={5000} iterationCount="infinite" animation="tada" style={[css.auto]}>
                                <Shadow style={[styles.shareBtn]}>
                                    <LinearGradient colors={['#FEE581', '#FDC34A']} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.shareBtnTextWrap]}>
                                        <Text style={styles.shareBtnText} onPress={() => {
                                            // tips={'您有一个任务'}
                                            DeviceEventEmitter.emit('showPop', <Choice info={{
                                                icon: pop1,
                                                tips: '您有一个任务',
                                                minTips: '你好。。。。',
                                                lt: '放弃任务',
                                                lc: () => {},
                                                rt: '继续任务',
                                                rc: () => {},
                                            }} />);
                                        }}>立即收徒</Text>
                                    </LinearGradient>
                                </Shadow>
                            </Animatable.View>
                            <TouchableOpacity activeOpacity={1} style={[css.flex, css.sp, styles.tipsWrap]} onPress={() => {
                                N.navigate('PupilInfoPage');
                            }}>
                                <Text numberOfLines={1} style={styles.shareInfoTips}>
                                    当前提现返佣：徒弟提现反10%，徒孙提现反5%
                                </Text>
                                <Text style={styles.tipsBtn}>师徒信息</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.welfareWrap, css.auto, css.flex, css.fw]}>
                            <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                                <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                    <Text style={styles.shareTitleText}>福利一</Text>
                                </ImageBackground>
                                <Shadow style={styles.welfareInner}>
                                    <View style={[styles.welfareInner, css.flex, css.sp, { backgroundColor: '#fff', padding: 10 }]}>
                                        {this._renderShareTitle()}
                                        {this._renderCashBack()}
                                    </View>
                                </Shadow>
                            </View>
                            <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                                <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                    <Text style={styles.shareTitleText}>福利二</Text>
                                </ImageBackground>
                                <Shadow style={[styles.welfareInner, { height: WALFARE_TWO_height }]}>
                                    <View style={[styles.welfareInner, { backgroundColor: '#fff', padding: 10, height: WALFARE_TWO_height }]}>
                                        {this._renderWelfare()}
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
}
const styles = StyleSheet.create({
    cashBackItem: {
        height: width * 0.9 * 0.25 * 294 / 273,
        overflow: 'hidden',
        width: width * 0.9 * 0.25,
    },
    cashLabel: {
        bottom: 0,
        color: '#fff',
        fontSize: 11,
        lineHeight: 45,
        textAlign: 'center',
        width: '100%'
    },
    cashTitle: {
        color: '#FF4A0A',
        fontSize: 11,
        left: '15%',
        lineHeight: 15,
        textAlign: 'center',
        top: '20%',
        width: '70%'
    },
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
        paddingTop: 10,
        width: width * 0.9
    },
    progressInner: {
        borderRadius: 6,
        height: '100%',
        overflow: 'hidden',
        width: '60%'
    },
    progressWrap: {
        backgroundColor: '#FFE4B8',
        borderRadius: 6,
        height: 12,
        marginVertical: 8,
        overflow: 'hidden',
        width: '94%'
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
    shareBtn: {
        borderRadius: 25,
        height: 50,
        width: width * 0.65
    },
    shareBtnText: {
        color: '#E51E00',
        fontSize: 18,
        fontWeight: '600',
        height: '100%',
        lineHeight: 50,
        textAlign: 'center',
        width: '100%'
    },
    shareBtnTextWrap: {
        ...css.flex,
        borderRadius: 25,
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    shareInfoImage: {
        height: width * 0.93 * 951 / 1065,
        width: width * 0.93,
        // eslint-disable-next-line react-native/sort-styles
        marginTop: 20,
    },
    shareInfoTips: {
        color: '#fff',
        fontSize: 10,
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
    tipsBtn: {
        color: '#FED567',
        fontSize: 12,
    },
    tipsWrap: {
        marginTop: width * 0.09,
        overflow: 'hidden'
    },
    wShareTitle: {
        height: 50,
        marginTop: 15,
        paddingLeft: 15,
        width: '100%',
    },
    welfareInner: {
        borderRadius: SHARE_ITEM_RADIUS,
        height: WALFARE_ONE_height,
        width: SHARE_ITEM_WIDTH,
    },
    welfareItemWrap: {
        height: 'auto',
        marginTop: 20,
        paddingTop: 5,
        width: 'auto',
    },
    welfareLabelText: {
        color: '#734209',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'left',
        width: '100%',
    },
    welfareProgressWrap: {
        backgroundColor: '#FFF8E7',
        borderRadius: 6,
        height: 160,
        marginTop: 15,
        overflow: 'hidden',
        padding: 10,
        width: '96%',
        ...css.auto
    },
    welfareTargetText: {
        color: '#734209',
        fontSize: 12,
        lineHeight: 24,
        textAlign: 'right',
        width: '100%',
    },
    welfareTitleText: {
        color: '#222',
        fontSize: 16,
        fontWeight: '900'
    },
    welfareWrap: {
        height: 'auto',
        paddingHorizontal: 15,
        width: SHARE_ITEM_WIDTH,
    },
    wpiTitleWrap: {
        height: 40,
        width: '100%'
    },
});
