import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { css } from '../../assets/style/css';
import LottieView from 'lottie-react-native';
import whole1 from '../../lottie/whole1';
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
import { _toFixed, setAndroidTime } from '../../utils/util';
import EnlargeView from '../../components/EnlargeView';
import { updateUser } from '../../utils/update';
import { getter } from '../../utils/store';
export const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
// const { correct_rate } = getter(['user.correct_rate']);
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            correct_rate: getter(['user.correct_rate']).correct_rate
        };
        // this.correct_rate = getter(['user.correct_rate']).correct_rate;
    }

    componentDidMount () {
        // this._homeStart();
        console.log('????');
        this.startLottie = DeviceEventEmitter.addListener('startLottie', () => {
            this._homeStart();
        });
        this.stopLottie = DeviceEventEmitter.addListener('stopLottie', () => {
            this._homeStop();
        });
    }

    _homeStart () {
        setAndroidTime(() => {
            this.lottie && this.lottie.play();
            this.shiftView && this.shiftView.start();
            this.lamp && this.lamp.start();
            updateUser(() => {
                this.setState({
                    correct_rate: getter(['user.correct_rate']).correct_rate
                });
            });
        }, 800);
    }

    _homeStop () {
        this.lottie && this.lottie.pause();
        this.shiftView && this.shiftView.stop();
        this.lamp && this.lamp.stop();
        this.enlarge && this.enlarge.stop();
    }

    componentWillUnmount () {
        this._homeStop();
        this.startLottie && this.startLottie.remove();
        this.stopLottie && this.stopLottie.remove();
    }

    render () {
        return (
            <SafeAreaProvider>
                <ImageBackground source={game41} style={[css.flex, css.pr, css.cover, css.afs]}>
                    {/* eslint-disable-next-line no-return-assign */}
                    {/* <View renderToHardwareTextureAndroid={true}> */}
                    {/*    /!* renderToHardwareTextureAndroid *!/ */}
                    {/*    /!* 决定这个视图是否要把它自己（以及所有的子视图）渲染到一个 GPU 上的硬件纹理中。 *!/ */}
                    {/*    /!* 在 Android 上，这对于只修改不透明度、旋转、位移、或缩放的动画和交互十分有用：在这些情况下，视图不必每次都重新绘制，显示列表也不需要重新执行。纹理可以被重用于不同的参数。负面作用是这会大量消耗显存，所以当交互/动画结束后应该把此属性设置回 false。 *!/ */}
                    {/*    /!* eslint-disable-next-line no-return-assign *!/ */}
                    {/*    <LottieView ref={ref => this.lottie = ref} key={'lottie'} renderMode={'HARDWARE'} style={{ width: width, height: 'auto' }} imageAssetsFolder={'whole1'} source={whole1} loop={true} autoPlay={true} speed={1}/> */}
                    {/* </View> */}
                    {/* eslint-disable-next-line no-return-assign */}
                    <LottieView ref={ref => this.lottie = ref} key={'lottie'} renderMode={'HARDWARE'} style={{ width: width, height: 'auto' }} imageAssetsFolder={'whole1'} source={whole1} loop={true} autoPlay={true} speed={1}/>
                    <View style={[css.pa, css.cover]}>
                        {/* eslint-disable-next-line no-return-assign */}
                        <ShiftView callback={() => {
                            this.enlarge && this.enlarge.start();
                            // eslint-disable-next-line no-return-assign
                        }} ref={ref => this.shiftView = ref} autoPlay={true} loop={true} duration={800} delay={1000} startSite={[width * 0.25, width * 0.55]} endSite={[width - 195, HEADER_HEIGHT - 28]}>
                            <ImageAuto source={game22} width={33}/>
                        </ShiftView>
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
                            {/* eslint-disable-next-line no-return-assign */}
                            <EnlargeView ref={ref => this.enlarge = ref}>
                                <TouchableOpacity activeOpacity={1} style={[styles.headerDataNumber, css.flex, css.sp, { width: 180 }]}>
                                    <ImageAuto source={game22} width={33}/>
                                    <View style={styles.hdnTextWrap}>
                                        <Text style={styles.hdnText}>32132131</Text>
                                    </View>
                                    <Text style={styles.withdrawBtn} onPress={() => {
                                        N.navigate('WithdrawPage');
                                    }}>提现</Text>
                                </TouchableOpacity>
                            </EnlargeView>
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
                            {/* eslint-disable-next-line no-return-assign */}
                            <Lamp ref={ref => this.lamp = ref} width={'100%'} backgroundColor={'rgba(0,179,216,.5)'} color={'#005262'} color1={'#FF6C00'}/>
                        </View>
                        {/* 底部显示区域 */}
                        <ImageBackground source={game12} style={[css.flex, css.pa, styles.homeBottomWrap, css.fw, css.afs]}>
                            {/* 主页进度显示 */}
                            <View style={styles.progressWrap}>
                            </View>
                            {/* 主页答题按钮 */}
                            <TouchableOpacity style={styles.homeBtn} activeOpacity={1} onPress={() => {
                                // this.lottie && this.lottie.pause();
                                N.navigate('GamePage');
                            }}><ImageAuto source={game1} width={width * 0.5}/></TouchableOpacity>
                            <Text style={styles.accuracyText}>正确率: <Text style={{ color: '#FF6C00' }} karet-lift>{_toFixed(this.state.correct_rate.get() * 100)}%</Text></Text>
                        </ImageBackground>
                    </View>
                </ImageBackground>
            </SafeAreaProvider>
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
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 120,
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
