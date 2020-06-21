import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { css } from '../assets/style/css';
/**
 * 使用示例
 DeviceEventEmitter.emit('showPop', <View/>);
 * **/
export default class Prompt extends Component {
    constructor (props) {
        super(props);
        this.state = {
            show: false,
            dom: { props: {} },
        };
        this.close = null;
    }

    onClose () {
        this.setState({ show: false });
        this.close && this.close();
    }

    componentDidMount () {
        DeviceEventEmitter.addListener('hidePop', () => {
            this.onClose();
        });
        DeviceEventEmitter.addListener('showPop', (info) => {
            if (info.dom) {
                this.close = info.close;
                this.setState({ show: true, dom: info.dom });
            } else {
                this.setState({ show: true, dom: info });
            }
        });
    }

    render () {
        return <Modal visible={this.state.show} transparent={true} animationType='fade' onRequestClose={() => {
        }} hardwareAccelerated={true} presentationStyle='overFullScreen' style={styles.modal}>
            <TouchableOpacity activeOpacity={1} style={[styles.view, css.flex]} onPress={(e) => { e.stopPropagation(); this.onClose(); }}>
                <TouchableOpacity activeOpacity={1} onPress={() => { this.props.cancel && this.onClose(); }} {...this.state.dom.props}>
                    {this.state.dom}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>;
    }
}
const styles = StyleSheet.create({
    modal: {
        flex: 1
    },
    view: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        justifyContent: 'center',
    },
});
