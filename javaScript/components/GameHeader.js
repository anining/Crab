import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    StyleSheet,
    View,
    LayoutAnimation,
    NativeModules,
    Animated,
    Easing,
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
import { getter } from '../utils/store';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';
import { bindData, getPath } from '../global/global';
import {
    _if,
    _toFixed,
    djangoTime,
    JsonParse,
    setAndroidTime,
    toGoldCoin,
    transformMoney,
    unitConversion,
} from '../utils/util';
import asyncStorage from '../utils/asyncStorage';
import CountDown from './CountDown';
import { updateUser } from '../utils/update';
export const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
let nowBalance = 0;
const addFrequency = 10; // 动画快慢频率
const propsTime = 60000 * 30.5; // 30.5 分钟
export default class GameHeader extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            user: bindData('user', this),
        };
        this.secondIncome = 0;
        this._start = false;
        this.imagePosition2 = [0, 0];
        this.imagePosition1 = [0, 0];
    }

    async componentDidMount () {
        this.secondIncome = toGoldCoin(getPath(['myGrade', 'second_income'], this.state.user));
        nowBalance = getPath(['goldCoin'], this.state.user, 0);
        await this.getCoin();
        this.secondText && this.secondText.setNativeProps({
            text: `${_toFixed(nowBalance, 4)}`
        });
        this._start = true;
    }

    async getCoin () {
        try {
            const ret = await asyncStorage.getItem(`${getPath(['phone'], this.state.user)}coin`);
            nowBalance = JsonParse(ret).coin || getPath(['goldCoin'], this.state.user, 0);
        } catch (e) {
            console.log(e);
        }
    }

    componentWillUnmount () {
        this._start = false;
        this.enlarge && this.enlarge.stop();
    }

    start (addIncome = this.secondIncome) {
        try {
            if (this._start && addIncome) {
                this.enlarge && this.enlarge.start();
                const minAddUnit = parseFloat(addIncome / addFrequency);
                const baseNowBalance = nowBalance;
                nowBalance += parseFloat(addIncome);
                for (let i = 0; i < addFrequency; i++) {
                    setAndroidTime(() => {
                        if ((i + 1) === addFrequency) {
                            // 最后一次加的时候存入内存
                            this.secondText && this.secondText.setNativeProps({
                                text: `${_toFixed(nowBalance, 4)}`
                            });
                            asyncStorage.setItem(`${getPath(['phone'], this.state.user)}coin`, {
                                coin: nowBalance,
                                time: +new Date()
                            });
                        } else {
                            this.secondText && this.secondText.setNativeProps({
                                text: `${_toFixed(baseNowBalance + minAddUnit * i, 4)}`
                            });
                        }
                    }, 50 * i);
                }
            } else {
                if (!this.secondIncome) {
                    this.secondIncome = toGoldCoin(getPath(['myGrade', 'second_income'], this.state.user, 0.00005));
                    nowBalance = getPath(['goldCoin'], this.state.user, 0);
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
                <TouchableOpacity karet-lift activeOpacity={1} style={[styles.headerDataNumber, css.flex, {
                    backgroundColor: this.props.backgroundColor
                }]}
                onPress={() => {
                    this.showPop();
                }}>
                    <ImageAuto key={`li${getPath(['phone'], this.state.user, 0)}`} source={game25} width={33} onLayout={(e) => {
                        const target = e.target;
                        setAndroidTime(() => {
                            UIManager.measure(target, (x, y, w, h, l, t) => {
                                if (l && t) {
                                    this.imagePosition1 = [l, t];
                                }
                            });
                        }, 600);
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
                        <ImageAuto key={`ri${getPath(['phone'], this.state.user, 0)}`} source={game22} width={33} onLayout={(e) => {
                            const target = e.target;
                            setAndroidTime(() => {
                                UIManager.measure(target, (x, y, w, h, l, t) => {
                                    if (l && t) {
                                        this.imagePosition2 = [l, t];
                                    }
                                });
                            }, 600);
                        }}/>
                        <TextInput multiline={false} style={[styles.hdnText]} ref={ref => this.secondText = ref} onFocus={() => {
                            this.secondText.blur();
                        }}/>
                        <Text style={styles.withdrawBtn}>提现</Text>
                    </View>
                </EnlargeView>
            </View>;
        }
    }
}
GameHeader.propTypes = {
    backgroundColor: PropTypes.string,
};
GameHeader.defaultProps = {
    backgroundColor: 'rgba(0,179,216,.5)'
};
const styles = StyleSheet.create({
    countDownText: {
        color: '#7d7d7d',
        fontSize: 11
    },
    countDownView: {
        bottom: -17,
        fontSize: 10,
        left: 50
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
