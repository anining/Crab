import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter, UIManager, InteractionManager,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { css } from '../../assets/style/css';
import LottieView from 'lottie-react-native';
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
import { N, proxyRouter } from '../../utils/router';
import GameDialog from '../../components/GameDialog';
import Lamp from '../../components/Lamp';
import { _debounce, _if, setAndroidTime } from '../../utils/util';
import {updateNextRedLevel, updateSecondIncome, updateUser} from '../../utils/update';
import { getter } from '../../utils/store';
import GameHeader from '../../components/GameHeader';
import { bindData, getPath } from '../../global/global';
import toast from '../../utils/toast';
import { getGradeConfig, homeProLevelPosition, avatarProLevelPosition } from '../../utils/levelConfig';
import {
    DelayGetDomeTime,
    HomeDelayMonitorTime,
    HomeLottieStartTime,
    HomeStartAnimationTime,
} from '../../utils/animationConfig';
import Button from '../../components/Button';
import { notice } from '../../utils/api';
import game4 from '../../assets/icon/game/game4.png';

export const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
const { trCorrectRate } = getter(['user.trCorrectRate', 'user.propNumsObj']);
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            withdrawLogsLatest: bindData('withdrawLogsLatest', this),
            gradeRange: bindData('gradeRange', this),
            gradeSetting: bindData('gradeSetting', this),
            nextRedLevel: bindData('nextRedLevel', this),
            user: bindData('user', this),
            gameHeaderPosition: null, // 头部图像视图
            accuracyImagePosition: null, // 答题按钮螃蟹视图
            unreadNumber: 0,
        };
        this.animationCanstart = false;// 用户页面已经切换走的动画是否开始判断
        this.goingGame = false; // 是否去往goingGame
    }

    delayEmitter () {
        this.animationCanstart = true;
        setAndroidTime(() => {
            this.startLottie = DeviceEventEmitter.addListener('startLottie', () => {
                this._debounceStart();
            });
            this.stopLottie = DeviceEventEmitter.addListener('stopLottie', () => {
                this._homeStop();
            });
        }, HomeDelayMonitorTime);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(async () => {
            proxyRouter(this.props.navigation);
            this._setDebounce();
            this.delayEmitter();
            this.debounceLottieStart();
            await this._getNoticeNumber();
        });
    }

    _debounceStart () {
        this.debounceHomeStart();
        this.debounceLottieStart();
    }

    _setDebounce () {
        this.debounceHomeStart = _debounce(() => {
            this._homeStart();
        }, HomeStartAnimationTime); // 动画开始时间分离
        this.debounceLottieStart = _debounce(() => {
            this._lottieStart();
        }, HomeLottieStartTime);// _lottieStart动画开始时间分离
    }

    _getPosition (callback) {
        try {
            this._startBeforeStop();
            this.gameHeader && (() => {
                this.setState({
                    gameHeaderPosition: this.gameHeader.getPosition(),
                }, () => {
                    this._animationStart();
                    callback && callback();
                });
            })();
        } catch (e) {
            console.log(e);
        }
    }

    _homeStart () {
        requestAnimationFrame(() => {
            if (this.animationCanstart) {
                updateUser(() => {
                    this._getPosition();
                });
                updateSecondIncome();
            }
        });
    }

    _lottieStart () {
        this.animationCanstart && this.lottie && this.lottie.play();
    }

    _animationStart () {
        this.shiftView && this.shiftView.start();
        this.lamp && this.lamp.start();
        this.gameHeader && this.gameHeader.getCoin();
    }

    _startBeforeStop () {
        this.shiftView && this.shiftView.stop();
        this.lamp && this.lamp.stop();
        this.gameHeader && this.gameHeader.stop();
    }

    _homeStop () {
        this.lottie && this.lottie.pause();
        this._startBeforeStop();
    }

    componentWillUnmount () {
        this._homeStop();
        this.startLottie && this.startLottie.remove();
        this.stopLottie && this.stopLottie.remove();
        this.animationCanstart = false;
        this.goingGame = false;
    }

    async _getNoticeNumber () {
        try {
            const ret = await notice(1, 1);
            if (ret && !ret.error && ret.data) {
                this.setState({
                    unreadNumber: getPath(['unread_num'], ret.data)
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    _renderHomeProcess () {
        try {
            const myGradeLevel = getPath(['myGradeLevel'], this.state.user, 1);
            const preLevel = getPath([myGradeLevel - 1], this.state.gradeRange, 0);
            const nexLevel = getPath([myGradeLevel], this.state.gradeRange, 0);
            const myNowLevel = getPath(['user_level', 'level_num'], this.state.user);
            const levelLength = nexLevel - preLevel;
            const myForwardNumber = Math.floor(avatarProLevelPosition.length * Math.abs(myNowLevel - preLevel - 1) / levelLength);
            const view = [];
            if (this.state.nextRedLevel.length) {
                if (this.state.nextRedLevel.length >= 12) {
                    homeProLevelPosition.forEach((item, index) => {
                        view.push(<ImageAuto key={`red${index}${myGradeLevel}`} source={game16}
                            style={[css.pa, { left: item[0], top: item[1], width: 33 }]}/>);
                    });
                } else {
                    const forwardNumberArray = [];
                    this.state.nextRedLevel.forEach((item, index) => {
                        const forwardNumber = parseInt(homeProLevelPosition.length * (item - preLevel) / levelLength);
                        if (forwardNumberArray.includes(forwardNumber)) {
                            forwardNumberArray.push(forwardNumber + 1); // 尽可能多的显示红包
                        } else {
                            forwardNumberArray.push(forwardNumber);
                        }
                    });
                    homeProLevelPosition.forEach((item, index) => {
                        if (forwardNumberArray.includes(index + 1)) {
                            view.push(<ImageAuto key={`red${index}${myGradeLevel}`} source={game16}
                                style={[css.pa, { left: item[0], top: item[1], width: 33 }]}/>);
                        }
                    });
                }
            }
            for (let i = 0; i < avatarProLevelPosition.length; i++) {
                const item = avatarProLevelPosition[i];
                if ((myForwardNumber === i + 1) || myForwardNumber === 0) {
                    view.push(
                        <ImageAuto key={`avatar${getPath(['avatar'], this.state.user)}${myNowLevel}${myGradeLevel}`}
                            source={getPath(['avatar'], this.state.user)} style={[css.pa, { left: item[0], top: item[1], width: 36, borderRadius: 18, borderWidth: 1, borderColor: '#ee581f' }]}/>,
                    );
                    break;
                }
            }
            return view;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    render () {
        try {
            if (this.state.user && this.state.nextRedLevel && this.state.gradeSetting && this.state.gradeRange) {
                const myGradeLevel = getPath(['myGradeLevel'], this.state.user, 1);
                const myGradeConfig = getGradeConfig(myGradeLevel);
                const nextGradeConfig = getGradeConfig(myGradeLevel + 1);
                const position = this.state.gameHeaderPosition;
                const accuracyPosition = this.state.accuracyImagePosition;
                return (
                    <SafeAreaProvider>
                        <ImageBackground source={game41} style={[css.flex, css.pr, css.cover, css.afs]}>
                            <LottieView ref={ref => this.lottie = ref}
                                key={`lottie${myGradeConfig.wholeLottie}${getPath(['phone'], this.state.user, 0)}`}
                                renderMode={'HARDWARE'}
                                style={{ width: width, height: 'auto' }}
                                imageAssetsFolder={myGradeConfig.wholeLottie} source={myGradeConfig.whole}
                                loop={true} autoPlay={false} speed={1}/>
                            <View style={[css.pa, css.cover]}>
                                {/* eslint-disable-next-line no-return-assign */}
                                {_if(position && position[1] && position[1][0], res => {
                                    return <ShiftView
                                        key={`ShiftView1${JSON.stringify(position)}`} callback={() => {
                                            this.gameHeader && this.gameHeader.start();
                                        }} ref={ref => ref && (this.shiftView = ref)} autoPlay={false} loop={true} loopTime={1500}
                                        duration={700} startSite={[width * 0.25, width * 0.55]} endSite={position[1]}>
                                        <ImageAuto source={game22} width={33}/>
                                    </ShiftView>;
                                })}
                                {_if(position && accuracyPosition, res => <ShiftView
                                    key={`ShiftViewGamePage2${JSON.stringify(position)}${JSON.stringify(accuracyPosition)}`}
                                    callback={() => {
                                        N.navigate('GamePage');
                                    }} ref={ref => ref && (this.startGame = ref)} autoPlay={false} loop={false} duration={800}
                                    startSite={position[0]} endSite={accuracyPosition}>
                                    <ImageAuto source={game25} width={33}/>
                                </ShiftView>)}
                                {/* /!* 头部显示区域 *!/ */}
                                <GameHeader ref={ref => this.gameHeader = ref} callback={() => {
                                    this._getPosition();
                                }}/>
                                {/* 中部显示区域 */}
                                <View style={[css.flex, css.pa, styles.homeMidWrap, css.afs]}>
                                    {_if(getPath([myGradeLevel, 'incomeRate'], this.state.gradeSetting), res =>
                                        <TouchableOpacity style={[css.pa, styles.outputWrap]} activeOpacity={1}
                                            onPress={() => {
                                                DeviceEventEmitter.emit('showPop', <GameDialog
                                                    btn={'我知道了'} tips={<Text>
                                                                  渔船等级越高，产金币越多</Text>} icon={<ImageBackground source={game4} style={[css.flex, css.pa, styles.gamePassHeader]}><Text style={styles.gamePassText} numberOfLines={1}>产金币速度</Text></ImageBackground>}/>);
                                            }}>
                                            <ImageBackground source={game5}
                                                style={[css.flex, css.fw, styles.outputWrapImg]}>
                                                <Text style={[styles.outputText]}>金币产量</Text>
                                                <Text style={styles.outputText}>{res}</Text>
                                            </ImageBackground>
                                        </TouchableOpacity>)}
                                    {/* NoticePage */}
                                    <TouchableOpacity activeOpacity={1} style={[css.pa, styles.noticeIcon]}
                                        onPress={() => {
                                            N.navigate('NoticePage');
                                            this.setState({ unreadNumber: 0 });
                                        }}>
                                        <ImageBackground source={game35} style={[{ width: '100%', height: '100%' }]}>
                                            {_if(this.state.unreadNumber, res => <Text style={[css.pa, styles.noticeNumber]}>{res}</Text>)}
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    {/* eslint-disable-next-line no-return-assign */}
                                    {_if(this.state.withdrawLogsLatest, res => <Lamp LampList={res}
                                        ref={ref => this.lamp = ref}
                                        width={'100%'}
                                        backgroundColor={'rgba(0,179,216,.5)'}
                                        color={'#005262'}
                                        color1={'#FF6C00'}
                                        autoPlay={false}/>)}
                                </View>
                                {/* 底部显示区域 */}
                                <ImageBackground source={game12}
                                    style={[css.flex, css.pa, styles.homeBottomWrap, css.fw, css.afs]}>
                                    {/* 主页进度显示 */}
                                    <View style={[styles.progressWrap, css.pr]}>
                                        {this._renderHomeProcess()}
                                        <ImageAuto key={`ship${JSON.stringify(nextGradeConfig.ship)}`}
                                            source={nextGradeConfig.ship} style={[css.pa, {
                                                width: 80,
                                                right: 0,
                                                bottom: 0,
                                            }]}/>
                                        {_if(getPath([myGradeLevel + 1, 'incomeRate'], this.state.gradeSetting), res =>
                                            <Text style={styles.incomeRateText}>产量{res}</Text>)}
                                    </View>
                                    {/* 主页答题按钮 */}
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        if (!this.goingGame) {
                                            if (getPath(['propNumsObj', '2'], this.state.user)) {
                                                this.goingGame = true;
                                                setAndroidTime(() => {
                                                    this.goingGame = false;
                                                }, 1500);
                                                this.startGame && this.startGame.start();
                                                !this.startGame && toast('游戏正在准备中，请稍后开始');
                                                this._homeStop();
                                            } else {
                                                toast('游戏道具不足');
                                                this.gameHeader && this.gameHeader.showPop();
                                            }
                                        } else {
                                            toast('请勿频繁点击');
                                        }
                                    }}>
                                        <ImageBackground source={game1} style={[css.flex, styles.homeBtnWrap]}>
                                            <Text style={styles.homeBtnText}>升渔船</Text>
                                            <ImageAuto source={game7} style={{ width: 33, marginLeft: 10 }}
                                                onLayout={(e) => {
                                                    if (!this.state.accuracyImagePosition) {
                                                        const target = e.target;
                                                        setAndroidTime(() => {
                                                            UIManager.measure(target, (x, y, w, h, l, t) => {
                                                                if (l && t) {
                                                                    this.setState({
                                                                        accuracyImagePosition: [l, t],
                                                                    });
                                                                }
                                                            });
                                                        }, DelayGetDomeTime);
                                                    }
                                                }}/>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    <Text style={styles.accuracyText}>正确率: <Text style={{ color: '#FF6C00' }}
                                        karet-lift>{trCorrectRate}</Text></Text>
                                </ImageBackground>
                            </View>
                        </ImageBackground>
                    </SafeAreaProvider>
                );
            } else {
                return <SafeAreaProvider>
                    <ImageBackground source={game41} style={[css.flex, css.pr, css.cover]}>
                        <Button type={1} name={'去登录'} onPress={(callback) => {
                            N.replace('VerificationStackNavigator');
                            callback && callback();
                        }}/>
                    </ImageBackground>
                </SafeAreaProvider>;
            }
        } catch (e) {
            console.log(e);
            return <View/>;
        }
    }
}
const styles = StyleSheet.create({
    accuracyText: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 30,
        textAlign: 'center',
        width,
        ...css.gf,
    },
    gamePassHeader: {
        height: width * 0.62 * 291 / 831,
        left: '50%',
        paddingBottom: width * 0.1,
        top: -width * 0.08,
        transform: [{ translateX: -width * 0.31 }],
        width: width * 0.62
    },
    gamePassText: {
        color: '#fff',
        fontSize: 17
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
    incomeRateText: {
        ...css.pa,
        ...css.gf,
        bottom: -20,
        color: '#dd741b',
        fontSize: 10,
        lineHeight: 20,
        right: 10,
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
        ...css.gf,
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
