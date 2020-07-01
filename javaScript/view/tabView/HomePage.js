import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter, UIManager,
} from 'react-native';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { css } from '../../assets/style/css';
import LottieView from 'lottie-react-native';
import whole1 from '../../lottie/whole1';
import game1 from '../../assets/icon/game/game1.png';
import game5 from '../../assets/icon/game/game5.png';
import game41 from '../../assets/icon/game/game41.png';
import game25 from '../../assets/icon/game/game25.png';
import game22 from '../../assets/icon/game/game22.png';
import game7 from '../../assets/icon/game/game7.png';
import game35 from '../../assets/icon/game/game35.png';
import game12 from '../../assets/icon/game/game12.png';
import game16 from '../../assets/icon/game/game16.png';
import ImageAuto from '../../components/ImageAuto';
import ShiftView from '../../components/ShiftView';
import { N } from '../../utils/router';
import GameDialog from '../../components/GameDialog';
import Lamp from '../../components/Lamp';
import { _if, _toFixed, setAndroidTime, transformMoney } from '../../utils/util';
import EnlargeView from '../../components/EnlargeView';
import { updateUser } from '../../utils/update';
import { getter } from '../../utils/store';
import GameHeader from '../../components/GameHeader';
import { bind } from 'kefir.ramda';
import { bindData, getPath } from '../../global/global';
import toast from '../../utils/toast';
import { getLevelConfig, homeProLevelPosition, avatarProLevelPosition } from '../../utils/levelConfig';

export const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
const { trCorrectRate, myGrade } = getter(['user.trCorrectRate', 'user.propNumsObj', 'user.myGrade']);
const secondIncome = U.mapValue((res) => {
    return transformMoney(res || 0);
}, R.path(['second_income'], myGrade)); // 每秒金币产量
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            gradeSetting: bindData('gradeSetting', this),
            nextRedLevel: bindData('nextRedLevel', this),
            user: bindData('user', this),
            gameHeaderPosition: null, // 头部图像视图
            accuracyImagePosition: null // 答题按钮螃蟹视图
        };
    }

    delayEmitter () {
        setAndroidTime(() => {
            this.startLottie = DeviceEventEmitter.addListener('startLottie', () => {
                this._homeStart();
            });
            this.stopLottie = DeviceEventEmitter.addListener('stopLottie', () => {
                this._homeStop();
            });
        }, 1000);
    }

    componentDidMount () {
        this.delayEmitter();
        this._homeStart();
    }

    _getPosition () {
        try {
            this.gameHeader && (() => {
                this.setState({
                    gameHeaderPosition: this.gameHeader.getPosition()
                }, () => {
                    this.lottie && this.lottie.play();
                    this.shiftView && this.shiftView.start();
                    this.lamp && this.lamp.start();
                });
            })();
        } catch (e) {
            console.log(e);
        }
    }

    _homeStart () {
        this._homeStop();
        setAndroidTime(() => {
            this._getPosition();
            updateUser();
        }, 1000);
    }

    _homeStop () {
        this.lottie && this.lottie.pause();
        this.shiftView && this.shiftView.stop();
        this.lamp && this.lamp.stop();
        this.gameHeader && this.gameHeader.stop();
    }

    componentWillUnmount () {
        this._homeStop();
        this.startLottie && this.startLottie.remove();
        this.stopLottie && this.stopLottie.remove();
    }

    _renderHomeProcess () {
        try {
            const preLevel = getPath([getPath(['myGradeLevel'], this.state.user) - 1, 'level'], this.state.gradeSetting) || 0;
            const nexLevel = getPath(['myGrade', 'level'], this.state.user);
            const myNowLevel = getPath(['user_level', 'level_num'], this.state.user);
            const levelLength = nexLevel - preLevel;
            const myForwardNumber = Math.floor(avatarProLevelPosition.length * (myNowLevel - preLevel) / levelLength);
            // console.log(preLevel, nexLevel, myNowLevel, this.state.nextRedLevel, '===============');
            const view = [];
            if (this.state.nextRedLevel.length) {
                if (this.state.nextRedLevel.length >= 12) {
                    homeProLevelPosition.forEach((item, index) => { view.push(<ImageAuto key={`red${index}`} source={game16} style={[css.pa, { left: item[0], top: item[1], width: 33, }]}/>); });
                } else {
                    const forwardNumberArray = [];
                    this.state.nextRedLevel.forEach((item, index) => {
                        const forwardNumber = Math.floor(homeProLevelPosition.length * (item - preLevel) / levelLength);
                        forwardNumberArray.push(forwardNumber);
                    });
                    homeProLevelPosition.forEach((item, index) => {
                        if (forwardNumberArray.includes(index + 1)) {
                            view.push(<ImageAuto key={`red${index}`} source={game16} style={[css.pa, { left: item[0], top: item[1], width: 33, }]}/>);
                        }
                    });
                }
            }
            avatarProLevelPosition.forEach((item, index) => {
                if (myForwardNumber === index) {
                    view.push(
                        <ImageAuto key={`avatar${index}`} source={getPath(['avatar'], this.state.user)} style={[css.pa, {
                            left: item[0],
                            top: item[1],
                            width: 33,
                        }]}/>
                    );
                }
            });
            return view;
        } catch (e) {
            return null;
        }
    }

    render () {
        return (
            <SafeAreaProvider>
                <ImageBackground source={game41} style={[css.flex, css.pr, css.cover, css.afs]}>
                    <LottieView ref={ref => this.lottie = ref} key={'lottie'} renderMode={'HARDWARE'}
                        style={{ width: width, height: 'auto' }} imageAssetsFolder={'whole'} source={whole1}
                        loop={true} autoPlay={false} speed={1}/>
                    <View style={[css.pa, css.cover]}>
                        {/* eslint-disable-next-line no-return-assign */}
                        {_if(this.state.gameHeaderPosition, res => <ShiftView callback={() => {
                            this.gameHeader && this.gameHeader.start();
                        }} ref={ref => this.shiftView = ref} autoPlay={false} loop={true} duration={1300} startSite={[width * 0.25, width * 0.55]} endSite={res[1]}>
                            <ImageAuto source={game22} width={33}/>
                        </ShiftView>)}
                        {_if(this.state.gameHeaderPosition && this.state.accuracyImagePosition, res => <ShiftView callback={() => {
                            N.navigate('GamePage');
                        }} ref={ref => this.startGame = ref} autoPlay={false} loop={false} duration={1000} startSite={this.state.gameHeaderPosition[0]} endSite={this.state.accuracyImagePosition}>
                            <ImageAuto source={game25} width={33}/>
                        </ShiftView>)}
                        {/* /!* 头部显示区域 *!/ */}
                        <GameHeader ref={ref => this.gameHeader = ref}/>
                        {/* 中部显示区域 */}
                        <View style={[css.flex, css.pa, styles.homeMidWrap, css.afs]}>
                            <TouchableOpacity style={[css.pa, styles.outputWrap]} activeOpacity={1} onPress={() => {
                                DeviceEventEmitter.emit('showPop', <GameDialog btn={'我知道了'} tips={<Text>
                                    渔船等级越高，产金币越多</Text>}/>);
                            }}>
                                <ImageBackground source={game5} style={[css.flex, css.fw, styles.outputWrapImg]}>
                                    <Text style={[styles.outputText]}>金币产量</Text>
                                    <Text style={styles.outputText} karet-lift>{secondIncome}币/秒</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            {/* NoticePage */}
                            <TouchableOpacity activeOpacity={1} style={[css.pa, styles.noticeIcon]} onPress={() => {
                                N.navigate('NoticePage');
                            }}>
                                <ImageBackground source={game35} style={[{ width: '100%', height: '100%' }]}>
                                    {_if(false, res => <Text style={[css.pa, styles.noticeNumber]}>10</Text>)}
                                </ImageBackground>
                            </TouchableOpacity>
                            {/* eslint-disable-next-line no-return-assign */}
                            <Lamp ref={ref => this.lamp = ref} width={'100%'} backgroundColor={'rgba(0,179,216,.5)'}
                                color={'#005262'} color1={'#FF6C00'} autoPlay={false}/>
                        </View>
                        {/* 底部显示区域 */}
                        <ImageBackground source={game12}
                            style={[css.flex, css.pa, styles.homeBottomWrap, css.fw, css.afs]}>
                            {/* 主页进度显示 */}
                            <View style={[styles.progressWrap, css.pr]}>
                                {this._renderHomeProcess()}
                                <ImageAuto source={getLevelConfig(getPath(['user_level', 'level_num'], this.state.user)).ship} style={[css.pa, {
                                    width: 80,
                                    right: 0,
                                    bottom: 0,
                                }]}/>
                            </View>
                            {/* 主页答题按钮 */}
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                if (getPath(['propNumsObj', '2'], this.state.user)) {
                                    this.startGame && this.startGame.start();
                                    this._homeStop();
                                } else {
                                    toast('游戏道具不足');
                                    this.gameHeader && this.gameHeader.showPop();
                                }
                            }}>
                                <ImageBackground source={game1} style={[css.flex, styles.homeBtnWrap]}>
                                    <Text style={styles.homeBtnText}>升渔船</Text>
                                    <ImageAuto source={game7} style={{ width: 33, marginLeft: 10 }} onLayout={(e) => {
                                        UIManager.measure(e.target, (x, y, w, h, l, t) => {
                                            this.setState({
                                                accuracyImagePosition: [l, t]
                                            });
                                        });
                                    }}/>
                                </ImageBackground>
                            </TouchableOpacity>
                            <Text style={styles.accuracyText}>正确率: <Text style={{ color: '#FF6C00' }} karet-lift>{trCorrectRate}</Text></Text>
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
        ...css.gf
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
    homeBtnText: {
        ...css.gf,
        color: '#fff',
        fontSize: 20,
    },
    homeBtnWrap: {
        height: width * 0.5 * 183 / 498,
        paddingBottom: width * 0.05,
        paddingLeft: 10,
        width: width * 0.5,
    },
    homeHeaderWrap: {
        height: HEADER_HEIGHT,
        left: 0,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingTop: 35,
        top: 0,
        width,
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
        width: '100%',
        ...css.gf
    },
    outputWrap: {
        right: 15,
        top: 130,
    },
    outputWrapImg: {
        height: width * 0.185 * 171 / 207,
        overflow: 'hidden',
        paddingTop: width * 0.06,
        width: width * 0.185,
    },
    progressWrap: {
        height: width * 0.35,
        paddingHorizontal: '5%',
        width: width,
    },
});
