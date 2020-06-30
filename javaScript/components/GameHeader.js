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
import { getSecondIncome } from '../utils/api';
import { bindData, getPath } from '../global/global';
import { _toFixed, setAndroidTime, toGoldCoin, transformMoney, unitConversion } from '../utils/util';
import ShiftView from './ShiftView';

export const HEADER_HEIGHT = 70;
const MID_HEIGHT = 300;
const { height, width } = Dimensions.get('window');
const { propNumsObj } = getter(['user.propNumsObj']);
const gameProp = U.mapValue((res) => { return res || 0; }, R.path(['2'], propNumsObj)); // 获取游戏道具的数量
let nowBalance = 0;
const addFrequency = 10; // 动画快慢频率
export default class GameHeader extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            user: bindData('user', this),
        };
        this._start = false;
    }

    async componentDidMount () {
        this.setState({
            secondIncome: toGoldCoin(getPath(['myGrade', 'second_income'], this.state.user))
        });
        nowBalance = parseFloat(this.state.user.goldCoin);
        this.secondText && this.secondText.setNativeProps({
            text: `${_toFixed(nowBalance, 4)}`
        });
        this._start = true;
    }

    componentWillUnmount () {
        this._start = false;
        this.enlarge && this.enlarge.stop();
    }

    start (addIncome = this.state.secondIncome) {
        try {
            if (this._start) {
                this.enlarge && this.enlarge.start();
                const minAddUnit = parseFloat(addIncome / addFrequency);
                const baseNowBalance = nowBalance;
                nowBalance += parseFloat(addIncome);
                for (let i = 0; i < addFrequency; i++) {
                    setAndroidTime(() => {
                        if ((i + 1) === addFrequency) {
                            this.secondText && this.secondText.setNativeProps({
                                text: `${_toFixed(nowBalance, 4)}`
                            });
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

    render () {
        return <View style={[css.flex, css.pa, styles.homeHeaderWrap, css.sp]}>
            <TouchableOpacity karet-lift activeOpacity={1} style={[styles.headerDataNumber, css.flex, {
                backgroundColor: this.props.backgroundColor
            }]}
            onPress={() => {
                DeviceEventEmitter.emit('showPop', <GameDialog callback={() => {
                    N.navigate('AnswerPage');
                }} btn={'做任务获取道具'} tips={<Text>道具每 <Text style={{ color: '#FF6C00' }}>30分钟</Text>系统赠送1个最多同时持有<Text style={{ color: '#FF6C00' }}>10个</Text> 道具做任务随机产出道具</Text>}
                icon={game20}/>);
            }}>
                <ImageAuto source={game25} width={33}/>
                <View style={styles.hdnTextWrap}>
                    <Text style={styles.hdnText}> <Text style={{ color: '#FF6C00' }}
                        karet-lift>{gameProp}</Text>/10</Text>
                </View>
                <ImageAuto source={game31} width={22}/>
            </TouchableOpacity>
            <EnlargeView ref={ref => this.enlarge = ref}>
                <View style={[styles.headerDataNumber, css.flex, css.sp, css.pr, {
                    width: 180,
                    backgroundColor: this.props.backgroundColor
                }]}>
                    <TouchableOpacity activeOpacity={1} style={[css.pa, styles.topHDN]} onPress={() => {
                        N.navigate('WithdrawPage');
                    }}/>
                    <ImageAuto source={game22} width={33}/>
                    <TextInput multiline={false} style={[styles.hdnText]} ref={ref => this.secondText = ref} onFocus={() => {
                        this.secondText.blur();
                    }}/>
                    <Text style={styles.withdrawBtn}>提现</Text>
                </View>
            </EnlargeView>
        </View>;
    }
}
GameHeader.propTypes = {
    backgroundColor: PropTypes.string,
};
GameHeader.defaultProps = {
    backgroundColor: 'rgba(0,179,216,.5)'
};
const styles = StyleSheet.create({
    hdnText: {
        // backgroundColor: 'red',
        color: '#ffffff',
        fontSize: 16,
        padding: 0,
        ...css.gf
    },
    hdnTextWrap: {
        marginHorizontal: 6,
    },
    headerDataNumber: {
        // backgroundColor: 'rgba(0,179,216,.5)',
        borderRadius: 15,
        height: 30,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 120,
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
