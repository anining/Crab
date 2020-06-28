import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter, SafeAreaView,
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
import { HEADER_HEIGHT } from '../tabView/HomePage';
import LottieView from 'lottie-react-native';
import chest from '../../lottie/chest';
import PropTypes from 'prop-types';
import Lamp from '../../components/Lamp';
import { transformMoney } from '../../utils/util';
const { height, width } = Dimensions.get('window');
export default class PassGamePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
        };
        // this.correct_rate = getter(['user.correct_rate']).correct_rate;
    }

    componentDidMount () {
        // console.log(this.props.info);
        // console.log()
        if (this.props.info) {
            DeviceEventEmitter.emit('showPop', <View style={[css.flex, css.pr, css.flex, { transform: [{ translateY: -width * 0.2 }] }]}>
                <LottieView ref={ref => this.lottie = ref} key={'chest'} renderMode={'HARDWARE'} style={{ width: width * 0.8, height: 'auto' }} imageAssetsFolder={'chest'} source={chest} loop={false} autoPlay={true} speed={1}/>
                <View style={[styles.passDataNumber, css.flex, css.auto, css.pa, { top: width * 0.8 - 50, left: width * 0.4 - 50 }]}>
                    <ImageAuto source={game22} width={33}/>
                    <Text style={styles.hdnText}>+{transformMoney(this.props.info.add_balance)}</Text>
                </View>
            </View>);
        }
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
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
                            N.replace('WithdrawPage');
                        }}>提现</Text>
                    </TouchableOpacity>
                </EnlargeView>
            </View>
        </SafeAreaView>;
    }
}

PassGamePage.propTypes = {
    info: PropTypes.object
};
PassGamePage.defaultProps = {
    info: {
        add_balance: 0.01
    },
};
const styles = StyleSheet.create({
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
        width
    },
    passDataNumber: {
        backgroundColor: 'rgba(0,0,0,.5)',
        borderRadius: 15,
        height: 30,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 100,
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
