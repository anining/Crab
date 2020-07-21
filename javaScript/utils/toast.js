import React from 'react';
import { ToastAndroid, Alert, Platform } from 'react-native';
import Toast from 'react-native-root-toast';

function toast (
    message = '',
    duration = ToastAndroid.SHORT,
    gravity = ToastAndroid.CENTER,
    yOffset = 0,
    xOffset = 0,
) {
    if (Platform.OS === 'ios') {
        const t = Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
        });
    } else {
        ToastAndroid.showWithGravityAndOffset(
            message,
            duration,
            gravity,
            yOffset,
            xOffset,
        );
    }
}

export default toast;
