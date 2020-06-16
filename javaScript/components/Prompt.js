import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
export default class Prompt extends Component {
    constructor (props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount () {
        DeviceEventEmitter.addListener('hidePop', () => {
            this.setState({ show: false });
        });
        DeviceEventEmitter.addListener('showPop', () => {
            this.setState({ show: true });
        });
    }

    render () {
        return <Modal visible={this.state.show} transparent={true} animationType='fade' onRequestClose={() => {
        }} hardwareAccelerated={true} presentationStyle='overFullScreen' style={styles.modal}>
            <TouchableOpacity activeOpacity={1} style={styles.view} onPress={() => {
                this.setState({ show: false });
            }}>

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
        backgroundColor: 'rgba(0,0,0,0.15)',
        height: height,
        justifyContent: 'center',
        width: width,
    },
});
