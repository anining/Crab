import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { css } from '../assets/style/css';

const { width, height } = Dimensions.get('window');
/**
 * 使用示例
 DeviceEventEmitter.emit('showPop', <View/>);
 * **/
export default class Prompt extends Component {
    constructor (props) {
        super(props);
        this.state = {
            show: false,
            dom: null,
        };
    }

    componentDidMount () {
        DeviceEventEmitter.addListener('hidePop', () => {
            this.setState({ show: false });
        });
        DeviceEventEmitter.addListener('showPop', (info) => {
            this.setState({ show: true, dom: info });
        });
    }

    render () {
        return <Modal visible={this.state.show} transparent={true} animationType='fade' onRequestClose={() => {
        }} hardwareAccelerated={true} presentationStyle='overFullScreen' style={styles.modal}>
            <TouchableOpacity activeOpacity={1} style={[styles.view, css.flex]} onPress={() => { this.setState({ show: false }); }}>
                {this.state.dom}
            </TouchableOpacity>
        </Modal>;
    }
}
const styles = StyleSheet.create({
    modal: {
        height: height,
        width: width,
    },
    view: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: height,
        justifyContent: 'center',
        width: width,
    },
});
