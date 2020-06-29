import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, DeviceEventEmitter, TouchableOpacity, ImageBackground } from 'react-native';
import { css } from '../assets/style/css';
import game15 from '../assets/icon/game/game15.png';
import game39 from '../assets/icon/game/game39.png';
import game20 from '../assets/icon/game/game20.png';
import ImageAuto from './ImageAuto';
import PropTypes from 'prop-types';
const { width, height } = Dimensions.get('window');
export default class GameDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return <TouchableOpacity activeOpacity={1} style={[styles.gameWrap, css.pr]}>
            <TouchableOpacity activeOpacity={1} style={[css.pa, styles.closeImageWrap]} onPress={() => { DeviceEventEmitter.emit('hidePop'); }}>
                <ImageAuto source={game15} style={[styles.closeImage]}/>
            </TouchableOpacity>
            <ImageAuto source={game20} style={[css.pa, styles.dialogIcon]}/>
            <View style={[css.flex, css.fw, styles.gameInner]}>
                <Text style={styles.tipsText}>{this.props.tips}</Text>
                <View style={{ height: 20, width: '100%' }}/>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.props.callback();
                    DeviceEventEmitter.emit('hidePop');
                }}>
                    <ImageBackground source={game39} style={[styles.btnWrap, css.flex]}>
                        <Text style={styles.btnText}>{this.props.btn}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>;
    }
}
GameDialog.propTypes = {
    btn: PropTypes.string,
    callback: PropTypes.func
};
GameDialog.defaultProps = {
    btn: '我知道了',
    tips: <Text>我是提示弹窗</Text>,
    icon: game20,
    callback: () => {}
};
const styles = StyleSheet.create({
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900'
    },
    btnWrap: {
        height: width * 0.5 * 159 / 570,
        marginLeft: width * 0.15,
        marginRight: width * 0.15,
        overflow: 'hidden',
        paddingBottom: width * 0.012,
        width: width * 0.5
    },
    closeImage: {
        width: 30
    },
    closeImageWrap: {
        right: -7,
        top: -7,
    },
    dialogIcon: {
        left: '50%',
        top: -width * 0.15,
        transform: [{ translateX: -width * 0.2 }],
        width: width * 0.4
    },
    gameInner: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 'auto',
        overflow: 'hidden',
        padding: 15,
        paddingTop: width * 0.15 + 10,
        width: '100%'
    },
    gameWrap: {
        backgroundColor: '#DDDDDD',
        borderRadius: 10,
        height: 'auto',
        paddingBottom: 10,
        width: width * 0.8
    },
    tipsText: {
        lineHeight: 30,
        textAlign: 'center',
        width: width * 0.5
    }
});