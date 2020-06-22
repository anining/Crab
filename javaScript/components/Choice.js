import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { css } from '../assets/style/css';
import LinearGradient from 'react-native-linear-gradient';
import { _if, getValue } from '../utils/util';
import ImageAuto from './ImageAuto';

const { width, height } = Dimensions.get('window');
/**
 * 使用示例
 <Choice info={{
     icon: pop1, （选填）
     tips: '您有一个任务',
     minTips: '' ,（选填）
     lt: '放弃任务', （选填）
     lc: () => {},（选填）
     rt: '继续任务',（选填）
     rc: () => {},（选填）
     type: 'oneBtn' 选填,
     fontSize:12 选填,
 }} />
 * **/
export default class Choice extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.icon = getValue(this.props.info, 'icon');
    }

    sure () {
        try {
            DeviceEventEmitter.emit('hidePop');
            this.props.info.rc && this.props.info.rc();
        } catch (e) {
            console.log(e);
        }
    }

    cancel () {
        try {
            DeviceEventEmitter.emit('hidePop');
            this.props.info.lc && this.props.info.lc();
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        try {
            return <TouchableOpacity style={[css.pr]} activeOpacity={1}>
                {_if(this.icon, res => <ImageAuto source={res} style={[styles.popIcon]}/>)}
                <View style={[styles.choiceWrap, css.flex, css.fw, {
                    paddingTop: this.icon ? 40 : 20
                }]}>
                    <Text style={[styles.tips, {
                        fontSize: getValue(this.props.info, 'fontSize') || 17
                    }]}>{this.props.info.tips}</Text>
                    {_if(this.props.info.minTips, res => <Text style={styles.minTips}>{res}</Text>)}
                    <View style={[css.flex, styles.btnWrap, {
                        justifyContent: getValue(this.props.info, 'type') ? 'center' : 'space-between',
                    }]}>
                        {_if(getValue(this.props.info, 'type'), res => null, () => {
                            return <Text style={[styles.popBtn, styles.popCancel]} numberOfLines={1} onPress={() => {
                                this.cancel();
                            }}>{getValue(this.props.info, 'lt') || '取消'}</Text>;
                        })}
                        <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.popBtn, styles.popSure]}>
                            <Text style={[styles.popBtn, styles.popSure]} numberOfLines={1} onPress={() => {
                                this.sure();
                            }}>{getValue(this.props.info, 'rt') || '确定'}</Text>
                        </LinearGradient>
                    </View>
                </View>
            </TouchableOpacity>;
        } catch (e) {
            return null;
        }
    }
}
const styles = StyleSheet.create({
    btnWrap: {
        marginTop: 10,
        paddingHorizontal: 5,
        width: '100%'
    },
    choiceWrap: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 'auto',
        overflow: 'hidden',
        paddingBottom: 20,
        paddingHorizontal: 15,
        width: width * 0.8
    },
    minTips: {
        color: '#666666',
        fontSize: 13,
        lineHeight: 30,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%'
    },
    popBtn: {
        borderRadius: 19,
        height: 38,
        lineHeight: 38,
        overflow: 'hidden',
        textAlign: 'center',
        width: width * 0.3,
    },
    popCancel: {
        borderColor: '#FF3B00',
        borderWidth: 1,
        color: '#FF3B00',
    },
    popIcon: {
        ...css.pa,
        left: width * 0.4 - 45,
        top: -35,
        width: 90,
    },
    popSure: {
        color: '#fff'
    },
    tips: {
        color: '#353535',
        fontSize: 17,
        fontWeight: '900',
        lineHeight: 30,
        textAlign: 'center',
        width: '100%'
    }
});
