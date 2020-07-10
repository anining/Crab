import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    StyleSheet,
    View,
    UIManager,
    Platform, TouchableOpacity, DeviceEventEmitter, Text, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { css } from '../assets/style/css';
import GameDialog from './GameDialog';
import { N } from '../utils/router';
import game20 from '../assets/icon/game/game20.png';
import ImageAuto from './ImageAuto';
import game25 from '../assets/icon/game/game25.png';
import game31 from '../assets/icon/game/game31.png';
import EnlargeView from './EnlargeView';
import game22 from '../assets/icon/game/game22.png';
import { bindData, getPath } from '../global/global';
import {
    _debounce,
    _if,
    _toFixed,
    djangoTime,
    JsonParse,
    setAndroidTime,
    toGoldCoin,
} from '../utils/util';
import asyncStorage from '../utils/asyncStorage';
import CountDown from './CountDown';
import { updateUser } from '../utils/update';
import { AnswerPopTipsTime, DelayGetDomeTime, HomeStartAnimationTime } from '../utils/animationConfig';
export const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
const addFrequency = 10; // 动画快慢频率
const propsTime = 60000 * 30.5; // 30.5 分钟
const maxWriteTimes = 2;// 每2秒写一次内存
export default class GameHeader extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            user: bindData('user', this),
        };
        this.secondIncome = 0;
        this.writeTimes = maxWriteTimes;
        this._start = false;
        this.imagePosition2 = [0, 0];
        this.imagePosition1 = [0, 0];
        this.nowBalance = 0;
    }

    async componentDidMount () {
        this.debounceGetCoin = _debounce(async (addIncome) => {
            await this.getCoin(addIncome);
        }, 200);// 内存读取保护
        this.secondIncome = toGoldCoin(getPath(['myGrade', 'second_income'], this.state.user));
        this.nowBalance = getPath(['goldCoin'], this.state.user, 0);
        this.debounceGetCoin();
        this._start = true;
    }

    async getCoin (addIncome = 0) {
        try {
            const ret = await asyncStorage.getItem(`${getPath(['phone'], this.state.user)}coin`);
            if (JsonParse(ret) && JsonParse(ret).mastUpdate) {
                this.nowBalance = JsonParse(ret).coin;
            } else {
                if (JsonParse(ret) && JsonParse(ret).coin) {
                    this.nowBalance = JsonParse(ret).coin + (+new Date() - JsonParse(ret).time) / 1000 * this.secondIncome + addIncome;
                    asyncStorage.setItem(`${getPath(['phone'], this.state.user)}coin`, {
                        coin: this.nowBalance,
                        time: +new Date()
                    });
                }
            }
            this.secondText && this.secondText.setNativeProps({
                text: `${_toFixed(this.nowBalance, 4)}`
            });
        } catch (e) {
            console.log(e);
        }
    }

    componentWillUnmount () {
        this._start = false;
        this.enlarge && this.enlarge.stop();
        this.nowBalance = 0;
    }

    start (addIncome = this.secondIncome, calibration = true) {
        try {
            if (this._start && addIncome) {
                this._start = false;
                this.enlarge && this.enlarge.start();
                const minAddUnit = parseFloat(addIncome / addFrequency);
                const baseNowBalance = this.nowBalance;
                this.nowBalance += parseFloat(addIncome);
                for (let i = 0; i < addFrequency; i++) {
                    setAndroidTime(async () => {
                        if ((i + 1) === addFrequency) {
                            // 最后一次加的时候存入内存
                            this._start = true;
                            this.secondText && this.secondText.setNativeProps({
                                text: `${_toFixed(this.nowBalance, 4)}`
                            });
                            if ((this.secondIncome !== addIncome) && calibration) {
                                this.debounceGetCoin(addIncome);
                            }
                            if ((this.secondIncome !== addIncome)) {
                                this.writeTimes = maxWriteTimes;
                            }
                            if (this.writeTimes >= maxWriteTimes) {
                                asyncStorage.setItem(`${getPath(['phone'], this.state.user)}coin`, {
                                    coin: this.nowBalance,
                                    time: +new Date()
                                });
                                this.writeTimes = 0;
                            }
                            this.writeTimes++;
                        } else {
                            this.secondText && this.secondText.setNativeProps({
                                text: `${_toFixed(baseNowBalance + minAddUnit * i, 4)}`
                            });
                        }
                    }, 50 * i);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    stop () {
        this.enlarge && this.enlarge.stop();
    }

    showPop () {
        DeviceEventEmitter.emit('showPop', <GameDialog callback={() => {
            N.navigate('AnswerPage');
            setAndroidTime(() => {
                DeviceEventEmitter.emit('answerScroll', 'end');
                DeviceEventEmitter.emit('comTitlePop', {
                    key: 'taskTips', str: '任意完成一单任务即有几率获得能量道具~'
                });
            }, AnswerPopTipsTime);
        }} btn={'做任务获取道具'} tips={<Text>道具每 <Text style={{ color: '#FF6C00' }}>30分钟</Text>系统赠送1个最多同时持有<Text style={{ color: '#FF6C00' }}>10个</Text> 道具做任务随机产出道具</Text>} icon={game20}/>);
    }

    getPosition () {
        return [this.imagePosition1, this.imagePosition2];
    }

    render () {
        if (this.state.user) {
            const propNumber = getPath(['propNumsObj', '2'], this.state.user, 0);// 游戏道具数量
            return <View style={[css.flex, css.pa, styles.homeHeaderWrap, css.sp]}>
                {_if(getPath(['last_get_game_prop_time'], this.state.user) && (propNumber < 10), res => {
                    return <CountDown callback={() => {
                        updateUser();
                    }} style={styles.countDownText} viewStyle={{ ...css.pa, ...styles.countDownView }} time={+new Date(djangoTime(getPath(['last_get_game_prop_time'], this.state.user))) + propsTime}/>;
                })}
                <TouchableOpacity activeOpacity={1} karet-lift style={[styles.headerDataNumber, css.flex, {
                    backgroundColor: this.props.backgroundColor
                }]}
                onPress={() => {
                    this.showPop();
                }}>
                    <ImageAuto key={'game25'} source={game25} width={33} onLayout={(e) => {
                        const target = e.target;
                        setAndroidTime(() => {
                            UIManager.measure(target, (x, y, w, h, l, t) => {
                                if (l && t) {
                                    this.imagePosition1 = [l, t];
                                }
                            });
                        }, DelayGetDomeTime);
                    }}/>
                    <View style={styles.hdnTextWrap}>
                        <Text style={styles.hdnText}> <Text style={{ color: '#FF6C00' }}>{propNumber}</Text>/10</Text>
                    </View>
                    <ImageAuto source={game31} width={22}/>
                </TouchableOpacity>
                <EnlargeView ref={ref => this.enlarge = ref}>
                    <View style={[styles.headerDataNumber, css.flex, css.sp, css.pr, {
                        width: 190,
                        backgroundColor: this.props.backgroundColor
                    }]}>
                        <TouchableOpacity activeOpacity={1} style={[css.pa, styles.topHDN]} onPress={() => {
                            N.navigate('WithdrawPage');
                        }}/>
                        <ImageAuto key={'game22'} source={game22} width={33} onLayout={(e) => {
                            const target = e.target;
                            setAndroidTime(() => {
                                UIManager.measure(target, (x, y, w, h, l, t) => {
                                    if (l && t) {
                                        this.imagePosition2 = [l, t];
                                        this.props.callback && this.props.callback();
                                    }
                                });
                            }, DelayGetDomeTime + 100);
                        }}/>
                        <TextInput multiline={false} style={[styles.hdnText]} ref={ref => this.secondText = ref} onFocus={() => {
                            this.secondText.blur();
                        }}/>
                        <Text style={styles.withdrawBtn}>兑换</Text>
                    </View>
                </EnlargeView>
            </View>;
        }
    }
}
GameHeader.propTypes = {
    backgroundColor: PropTypes.string,
    callback: PropTypes.func,
};
GameHeader.defaultProps = {
    backgroundColor: 'rgba(0,179,216,.5)',
    callback: () => {},
};
const styles = StyleSheet.create({
    countDownText: {
        color: '#7d7d7d',
        fontSize: 11
    },
    countDownView: {
        bottom: -17,
        fontSize: 10,
        height: 20,
        left: 50,
    },
    hdnText: {
        // backgroundColor: 'red',
        color: '#ffffff',
        fontSize: 15,
        padding: 0,
        ...css.gf
    },
    hdnTextWrap: {
        marginHorizontal: 6,
    },
    headerDataNumber: {
        borderRadius: 15,
        height: 30,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 120,
    },
    homeHeaderWrap: {
        // backgroundColor: 'red',
        height: HEADER_HEIGHT,
        left: 0,
        // overflow: 'hidden',
        paddingHorizontal: 20,
        paddingTop: 35,
        top: 0,
        width
    },
    topHDN: {
        // backgroundColor: 'red',
        height: '100%',
        width: '100%'
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
