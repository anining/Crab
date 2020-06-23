import React, { Component } from 'react';
import {
    SafeAreaView,
    NativeModules,
    Dimensions,
    ImageBackground,
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import { css } from '../../assets/style/css';
import LottieView from 'lottie-react-native';
import zt from '../../lottie/zt';
import game1 from '../../assets/icon/game/game1.png';
import game5 from '../../assets/icon/game/game5.png';
import game41 from '../../assets/icon/game/game41.png';
import game25 from '../../assets/icon/game/game25.png';
import game22 from '../../assets/icon/game/game22.png';
import game31 from '../../assets/icon/game/game31.png';
import game35 from '../../assets/icon/game/game35.png';
import game12 from '../../assets/icon/game/game12.png';
import ImageAuto from '../../components/ImageAuto';
import ShiftView from '../../components/ShiftView';
import { N } from '../../utils/router';
import GameDialog from '../../components/GameDialog';
import Lamp from '../../components/Lamp';
const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <ImageBackground source={game41} style={[css.flex, css.pr, css.cover]}>
                <LottieView style={{ width: width, height: 'auto' }} imageAssetsFolder={'zt'} source={zt} loop={true} autoPlay={true} speed={1}/>
                <View style={[css.pa, css.cover]}>
                    {/* <ShiftView> */}
                    {/*    <ImageAuto source={game25} width={60}/> */}
                    {/* </ShiftView> */}
                    {/* 头部显示区域 */}
                    <View style={[css.flex, css.pa, styles.homeHeaderWrap, css.sp]}>
                        <TouchableOpacity activeOpacity={1} style={[styles.headerDataNumber, css.flex]} onPress={() => {
                            DeviceEventEmitter.emit('showPop', <GameDialog callback={() => {
                                N.navigate('AnswerPage');
                            }} btn={'做任务获取道具'} tips={<Text>道具每 <Text style={{ color: '#FF6C00' }}>30分钟</Text> 系统赠送1个
                                最多同时持有
                            <Text style={{ color: '#FF6C00' }}>10个</Text> 道具做任务随机产出道具</Text>}/>);
                        }}>
                            <ImageAuto source={game25} width={33}/>
                            <View style={styles.hdnTextWrap}>
                                <Text style={styles.hdnText}> <Text style={{ color: '#FF6C00' }}>6</Text>/10</Text>
                            </View>
                            <ImageAuto source={game31} width={22}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={[styles.headerDataNumber, css.flex]}>
                            <ImageAuto source={game22} width={33}/>
                            <View style={styles.hdnTextWrap}>
                                <Text style={styles.hdnText}>32132131</Text>
                            </View>
                            <Text style={styles.withdrawBtn} onPress={() => {
                                N.navigate('WithdrawPage');
                            }}>提现</Text>
                        </TouchableOpacity>
                    </View>
                    {/* 中部显示区域 */}
                    <View style={[css.flex, css.pa, styles.homeMidWrap, css.afs]}>
                        <TouchableOpacity style={[css.pa, styles.outputWrap]} activeOpacity={1} onPress={() => {
                            DeviceEventEmitter.emit('showPop', <GameDialog btn={'我知道了'} tips={<Text>道具每 <Text style={{ color: '#FF6C00' }}>30分钟</Text> 系统赠送1个
                                最多同时持有
                            <Text style={{ color: '#FF6C00' }}>10个</Text> 道具做任务随机产出道具</Text>}/>);
                        }}>
                            <ImageBackground source={game5} style={[css.flex, css.fw, styles.outputWrapImg]}>
                                <Text style={[styles.outputText]}>金币产量</Text>
                                <Text style={[styles.outputText, { fontWeight: '900' }]}>110%</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <ImageBackground source={game35} style={[css.pa, styles.noticeIcon]}>
                            <Text style={[css.pa, styles.noticeNumber]}>10</Text>
                        </ImageBackground>
                        <Lamp width={'100%'} backgroundColor={'rgba(0,179,216,.5)'} color={'#005262'} color1={'#FF6C00'}/>
                    </View>
                    {/* 底部显示区域 */}
                    <ImageBackground source={game12} style={[css.flex, css.pa, styles.homeBottomWrap, css.fw, css.afs]}>
                        {/* 主页进度显示 */}
                        <View style={styles.progressWrap}>
                        </View>
                        {/* 主页答题按钮 */}
                        <TouchableOpacity style={styles.homeBtn} activeOpacity={1} onPress={() => {
                            N.navigate('GamePage');
                        }}><ImageAuto source={game1} width={width * 0.5}/></TouchableOpacity>
                        <Text style={styles.accuracyText}>正确率: <Text style={{ color: '#FF6C00' }}>95%</Text></Text>
                    </ImageBackground>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    accuracyText: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 30,
        textAlign: 'center',
        width,
    },
    hdnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '900',
    },
    hdnTextWrap: {
        marginHorizontal: 6,
    },
    headerDataNumber: {
        backgroundColor: 'rgba(0,179,216,.5)',
        borderRadius: 15,
        height: 30,
        minWidth: 100,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 'auto',
    },
    homeBottomWrap: {
        bottom: 0,
        height: width * 1032 / 1125,
        paddingTop: width * 0.27,
        width,
        zIndex: 10,
    },
    homeHeaderWrap: {
        height: HEADER_HEIGHT,
        left: 0,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingTop: 35,
        top: 0,
        width
    },
    homeMidWrap: {
        height: MID_HEIGHT,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingTop: 10,
        top: HEADER_HEIGHT,
        width,
    },
    noticeIcon: {
        height: width * 0.1 * 96 / 93,
        right: 30,
        top: 65,
        width: width * 0.1,
    },
    noticeNumber: {
        backgroundColor: 'red',
        borderColor: '#bababa',
        borderRadius: 12,
        borderWidth: 1,
        color: '#fff',
        fontSize: 10,
        height: 24,
        lineHeight: 24,
        right: -5,
        textAlign: 'center',
        top: -5,
        transform: [{ scale: 0.9 }],
        width: 24,
    },
    outputText: {
        color: '#fff',
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'center',
        transform: [{ scale: 0.9 }],
        width: '100%'
    },
    outputWrap: {
        right: 15,
        top: 130,
    },
    outputWrapImg: {
        height: width * 0.185 * 171 / 207,
        overflow: 'hidden',
        paddingTop: width * 0.06,
        width: width * 0.185
    },
    progressWrap: {
        height: width * 0.35,
        paddingHorizontal: '5%',
        width,
    },
    withdrawBtn: {
        backgroundColor: '#FF6C00',
        borderRadius: 12,
        color: '#fff',
        fontSize: 12,
        height: 24,
        lineHeight: 24,
        overflow: 'hidden',
        textAlign: 'center',
        width: 46,
    },
});
