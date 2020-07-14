import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, DeviceEventEmitter, TouchableOpacity, ImageBackground } from 'react-native';
import { css } from '../assets/style/css';
import game15 from '../assets/icon/game/game15.png';
import game39 from '../assets/icon/game/game39.png';
import ImageAuto from './ImageAuto';
import PropTypes from 'prop-types';
import { _if } from '../utils/util';
const { width, height } = Dimensions.get('window');
export default class GameDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return <TouchableOpacity activeOpacity={1} style={[styles.gameWrap, css.pr, {
            backgroundColor: this.props.transparent ? 'rgba(0,0,0,0)' : '#DDDDDD'
        }]}>
            <TouchableOpacity activeOpacity={1} style={[css.pa, styles.closeImageWrap]} onPress={() => { DeviceEventEmitter.emit('hidePop'); }}>
                <ImageAuto source={game15} style={[styles.closeImage]}/>
            </TouchableOpacity>
            {_if(this.props.icon, res => {
                if (typeof res === 'object') {
                    return this.props.icon;
                } else {
                    return <ImageAuto source={res} style={[css.pa, styles.dialogIcon]}/>;
                }
            })}
            <View style={[css.flex, css.fw, styles.gameInner, {
                paddingTop: this.props.icon ? width * 0.15 + 10 : 10,
                backgroundColor: this.props.transparent ? 'rgba(0,0,0,0)' : '#fff'
            }]}>
                {this.props.content}
                {_if(this.props.tips, res => <Text style={styles.tipsText}>{res}</Text>)}
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
    callback: PropTypes.func,
    transparent: PropTypes.bool,
};
GameDialog.defaultProps = {
    btn: '我知道了',
    tips: null,
    content: null,
    icon: null,
    callback: () => {},
    transparent: false
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
    dialogIconWrap: {
        top: -width * 0.15,
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
