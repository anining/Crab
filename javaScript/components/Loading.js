import React, { useState, useEffect } from 'react';
import { Dimensions, Modal, View, StyleSheet, DeviceEventEmitter } from 'react-native';
import Spinner from 'react-native-spinkit';

const { width, height } = Dimensions.get('window');

export default function Loading () {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const loadingShow = DeviceEventEmitter.addListener('loadingShow', () => {
            show();
        });
        const loadingHidden = DeviceEventEmitter.addListener('loadingHidden', () => {
            hidden();
        });
        return () => {
            loadingShow.remove();
            loadingHidden.remove();
        };
    }, []);

    function show () {
        setIsVisible(true);
    }

    function hidden () {
        setIsVisible(false);
    }

    return (
        <Modal visible={isVisible} transparent={true} animationType='fade' onRequestClose={hidden}
            hardwareAccelerated={true} presentationStyle='overFullScreen' style={styles.modal}>
            <View style={styles.view}>
                <Spinner isVisible={isVisible}
                    size={35}
                    type='9CubeGrid'
                    color="#fff" />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        height: height,
        width: width,
    },
    view: {
        alignItems: 'center',
        backgroundColor: '#0000002e',
        height: height,
        justifyContent: 'center',
        width: width,
    },
});
