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
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { getter } from '../../utils/store';
import { css } from '../../assets/style/css';
import GameDialog from '../../components/GameDialog';
import { N } from '../../utils/router';
import ImageAuto from '../../components/ImageAuto';
import game25 from '../../assets/icon/game/game25.png';
import game31 from '../../assets/icon/game/game31.png';
import EnlargeView from '../../components/EnlargeView';
import game22 from '../../assets/icon/game/game22.png';
import game4 from '../../assets/icon/game/game4.png';
import game8 from '../../assets/icon/game/game8.png';
import game37 from '../../assets/icon/game/game37.png';
import game14 from '../../assets/icon/game/game14.png';
import game16 from '../../assets/icon/game/game16.png';
import game17 from '../../assets/icon/game/game17.png';
import { HEADER_HEIGHT } from '../tabView/HomePage';
import LottieView from 'lottie-react-native';
import chest from '../../lottie/chest';
import PropTypes from 'prop-types';
import { _toFixed, toGoldCoin, transformMoney } from '../../utils/util';
import ShiftView from '../../components/ShiftView';
import game20 from '../../assets/icon/game/game20.png';
import IdiomCard from '../../components/IdiomCard';
import { addNoteBook } from '../../utils/api';
import toast from '../../utils/toast';
import * as U from 'karet.util';
import GameHeader from '../../components/GameHeader';
import { updateNextRedLevel, updateUser } from '../../utils/update';
import { bindData, getPath } from '../../global/global';
import { avatarProLevelPosition, homeProLevelPosition } from '../../utils/levelConfig';

const { height, width } = Dimensions.get('window');
const { level_num: userLevel } = getter(['user.user_level.level_num']);
// const trCorrectRate = U.mapValue((res) => {
//     return _toFixed(res * 100) + '%';
// }, correctRate);
export default class PassGamePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            user: bindData('user', this),
            gradeSetting: bindData('gradeSetting', this),
            nextRedLevel: bindData('nextRedLevel', this),
        };
        this.paramsInfo = this.props.route.params.info;
    }

    static async _addNoteBook (str) {
        const ret = await addNoteBook(str);
        console.log(ret);
        if (ret && !ret.error) {
            toast('加入成功');
        }
    }

    _showPop () {
        if (this.paramsInfo && this.paramsInfo.rate <= 1) { // rate 小于等于1是普通宝箱
            DeviceEventEmitter.emit('showPop', <View
                style={[css.flex, css.pr, css.flex, { transform: [{ translateY: -width * 0.2 }] }]}>
                <LottieView ref={ref => this.lottie = ref} key={'chest'} renderMode={'HARDWARE'}
                    style={{ width: width * 0.8, height: 'auto' }} imageAssetsFolder={'chest'} source={chest}
                    loop={false} autoPlay={true} speed={1} onAnimationFinish={() => {
                        DeviceEventEmitter.emit('hidePop');
                        this.gameHeader && this.gameHeader.start(toGoldCoin(this.paramsInfo.add_balance));
                    }}/>
                <View style={[styles.passDataNumber, css.flex, css.auto, css.pa, {
                    top: width * 0.8 - 50,
                    left: width * 0.4 - 50,
                }]}>
                    <ImageAuto source={game22} width={33}/>
                    <Text style={styles.hdnText}>+{transformMoney(this.paramsInfo.add_balance)}</Text>
                </View>
            </View>);
        }
        if (this.paramsInfo && this.paramsInfo.rate > 1) {
            DeviceEventEmitter.emit('showPop', <ImageBackground source={game17} style={[styles.gameRedPackage, css.flex]}>
                <Text style={styles.hdnRedPackageText}>+{transformMoney(this.paramsInfo.add_balance)}<Text style={{ fontSize: 15 }}>金币</Text></Text>
            </ImageBackground>);
        }
    }

    async componentDidMount () {
        console.log(this);
        this._showPop();
        updateUser();
    }

    _renderIdiomList () {
        try {
            if (this.paramsInfo && this.paramsInfo.content) {
                const view = [];
                this.paramsInfo.content.forEach((item, index) => {
                    view.push(
                        <TouchableOpacity key={`content${index}`} activeOpacity={1}
                            style={[css.flex, styles.idiomItemWrap]} onPress={() => {
                                DeviceEventEmitter.emit('showPop', <GameDialog callback={async () => {
                                    // N.navigate('AnswerPage');
                                    console.log(item);
                                    await PassGamePage._addNoteBook(item);
                                }} btn={'加入生词本'} content={<IdiomCard content={item} idiom={this.paramsInfo.idioms[item][0]}/>}/>);
                            }}>
                            <ImageAuto source={game37} style={{ width: 16, marginRight: 5 }}/>
                            <Text style={[css.gf, styles.lineIdiom]} numberOfLines={1}>{item}</Text>
                        </TouchableOpacity>,
                    );
                });
                return view;
            }
        } catch (e) {
            return null;
        }
    }

    _renderProgress () {
        try {
            console.log(this.state.nextRedLevel, '========3563!!', this.state.user);
            if (this.state.nextRedLevel && this.state.nextRedLevel.length) {
                const preLevel = getPath([getPath(['myGradeLevel'], this.state.user) - 1, 'level'], this.state.gradeSetting) || 0;
                const nexLevel = getPath(['myGrade', 'level'], this.state.user);
                const myNowLevel = getPath(['user_level', 'level_num'], this.state.user);
                const levelLength = nexLevel - preLevel;
                const progressInnerLength = Number((myNowLevel - preLevel) / levelLength);
                // const levelLength = nexLevel - preLevel;
                // const myForwardNumber = Math.floor(avatarProLevelPosition.length * (myNowLevel - preLevel) / levelLength);
                console.log(this.state.nextRedLevel, myNowLevel);
                console.log(progressInnerLength, '=======');
                // if(this.state.nextRedLevel) {}
                return <View style={[css.flex, css.fw, styles.progressWrap, css.pr]}>
                    {(() => {
                        const view = [];
                        this.state.nextRedLevel.splice(0, 2).forEach((item, index) => {
                            const forwardNumber = Math.floor((item - preLevel) / levelLength);
                            view.push(
                                <ImageAuto style={[css.pa, styles.redImage, {
                                    left: forwardNumber * 100 + '%'
                                }]} source={game16} key={`red${index}`}/>
                            );
                        });
                        return view;
                    })()}
                    <View style={[css.flex, styles.progressBox, css.js]}>
                        <View style={[css.flex, styles.progressInner, {
                            width: progressInnerLength * 100 + '%'
                        }]}/>
                    </View>
                    <View style={{ height: 20, width: '100%' }}/>
                    <Text style={[styles.gamePassTips, css.gf, { fontSize: 15 }]}>再闯关<Text
                        style={{ fontSize: 17, color: 'red' }}>10</Text>关领红包</Text>
                </View>;
            } else {
                return <View style={[css.flex, css.fw, styles.progressWrap, {
                    height: 50
                }]}>
                    <Text style={styles.noRedText}>更多红包在后面关卡等你拿～</Text>
                </View>;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    render () {
        try {
            return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <ScrollView style={{ flex: 1 }}>
                    {/* 头部显示区域 */}
                    <GameHeader ref={ref => this.gameHeader = ref} backgroundColor={'rgba(0,0,0,.3)'}/>
                    <ShiftView callback={() => {
                        N.replace('GamePage');
                    }} ref={ref => this.startGame = ref} autoPlay={false} loop={false} duration={700} delay={0}
                    startSite={[25, HEADER_HEIGHT - 28]} endSite={[width * 0.5 + 90, width * 1.4]}>
                        <ImageAuto source={game25} width={33}/>
                    </ShiftView>
                    {/* 核心显示区域 */}
                    <View style={[styles.gameResWrap, css.pr]}>
                        <ImageBackground source={game4} style={[css.flex, css.pa, styles.gamePassHeader]}>
                            <Text style={styles.gamePassText} numberOfLines={1} karet-lift>恭喜通过第{userLevel}关</Text>
                        </ImageBackground>
                        <View style={[styles.gameCanvasWrap]}>
                            <View style={[styles.gameCanvasInner, css.flex, css.fw, css.afs]}>
                                <Text style={[styles.gamePassTips, css.gf]}>您已超越<Text
                                    style={{ fontSize: 20, color: 'red' }}>{_toFixed(getPath(['surpass'], this.state.user) * 100) + '%'}</Text>用户</Text>
                                <View style={[css.flex, css.fw, styles.idiomWrap, css.afs, css.js]}>
                                    {this._renderIdiomList()}
                                </View>
                                {this._renderProgress()}
                                <View style={[css.flex, css.sp, styles.nextBtnWrap]}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        N.goBack();
                                    }}>
                                        <ImageAuto source={game14} style={{ width: 55 }}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        // N.navigate('GamePage');
                                        this.startGame && this.startGame.start();
                                    }}>
                                        <ImageAuto source={game8} style={{ width: 200 }}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
const styles = StyleSheet.create({
    gameCanvasInner: {
        backgroundColor: '#FFF7A9',
        borderRadius: 10,
        height: '100%',
        overflow: 'hidden',
        paddingTop: width * 0.18,
        width: '100%',
    },
    gameCanvasWrap: {
        backgroundColor: '#FFDF7A',
        width: width - 20,
        ...css.auto,
        borderRadius: 10,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    gamePassHeader: {
        height: width * 0.8 * 291 / 831,
        left: width * 0.1,
        paddingBottom: width * 0.12,
        top: width * 0.05,
        width: width * 0.8,
    },
    gamePassText: {
        color: '#fff',
        fontSize: 20,
        ...css.gf,
    },
    gamePassTips: {
        color: '#353535',
        fontSize: 17,
    },
    gameRedPackage: {
        height: width * 0.8 * 1173 / 885,
        paddingTop: 20,
        width: width * 0.8
    },
    gameResWrap: {
        marginTop: HEADER_HEIGHT,
        paddingTop: width * 0.2,
        width
    },
    hdnRedPackageText: {
        color: '#F5E385',
        fontSize: 20,
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
        backgroundColor: 'rgba(255,166,0,0.5)',
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
        width,
    },
    idiomItemWrap: {
        borderColor: '#594134',
        borderRadius: 17,
        borderWidth: 1,
        height: 34,
        marginBottom: 10,
        marginLeft: width * 0.02,
        overflow: 'hidden',
        transform: [{ scale: 0.96 }],
        width: '30%',
    },
    idiomWrap: {
        backgroundColor: '#FFE784',
        borderRadius: 10,
        height: 120,
        marginTop: 30,
        paddingHorizontal: 5,
        paddingVertical: 20,
        width: '92%',
    },
    lineIdiom: {
        fontSize: 15,
    },
    nextBtnWrap: {
        height: 100,
        overflow: 'hidden',
        width: '77%',
    },
    noRedText: {
        color: 'red',
        fontSize: 16,
        ...css.gf
    },
    passDataNumber: {
        backgroundColor: 'rgba(0,0,0,.5)',
        borderRadius: 15,
        height: 30,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 100,
    },
    progressBox: {
        backgroundColor: '#FFE784',
        borderRadius: 8,
        height: 16,
        overflow: 'hidden',
        width: '100%',
    },
    progressInner: {
        backgroundColor: '#FF6C00',
        borderRadius: 8,
        height: 16,
        width: 30,
    },
    progressWrap: {
        // backgroundColor: 'red',
        height: 100,
        marginTop: 20,
        paddingTop: 30,
        width: '70%',
    },
    redImage: {
        left: 20,
        top: 0,
        width: 30,
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
