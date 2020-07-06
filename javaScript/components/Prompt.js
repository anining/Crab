import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
import { getPath } from '../global/global';
// import ShiftView from './ShiftView';
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
        this.canCancel = true;
    }

    onClose () {
        if (this.state.show) {
            this.setState({ show: false }, () => {
                this.close && this.close();
                this.close = null;
                this.canCancel = true;
            });
        }
    }

    componentDidMount () {
        DeviceEventEmitter.addListener('hidePop', () => {
            this.onClose();
        });
        DeviceEventEmitter.addListener('showPop', (info) => {
            if (info.dom) {
                this.close = info.close;
                this.canCancel = Prompt.buildCanCancel(info);
                this.setState({ show: true, dom: info.dom });
                console.log(this.canCancel, info, 'this.canCancelthis.canCancelthis.canCancel');
            } else {
                this.setState({ show: true, dom: info });
            }
        });
    }

    static buildCanCancel (info) {
        try {
            if ('canCancel' in info) {
                return info.canCancel;
            } else {
                return true;
            }
        } catch (e) {
            return true;
        }
    }

    render () {
        return <Modal visible={this.state.show} transparent={true} animationType='fade' onRequestClose={() => {
        }} hardwareAccelerated={true} presentationStyle='overFullScreen' style={styles.modal}>
            <TouchableOpacity activeOpacity={1} style={[styles.view, css.flex]} onPress={(e) => {
                if (this.canCancel) {
                    e.stopPropagation();
                    this.onClose();
                }
            }}>
                {this.state.dom}
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
    },
});

Prompt.propTypes = {
    canClose: PropTypes.bool,
};
Prompt.defaultProps = {
    canClose: true,
};
