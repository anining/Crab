import React from 'react';
import { ToastAndroid, Alert, Platform } from 'react-native';

function toast (
    message = '',
    duration = ToastAndroid.SHORT,
    gravity = ToastAndroid.CENTER,
    yOffset = 0,
    xOffset = 0,
) {
    if (Platform.OS === 'ios') {
        Alert.alert('', message);
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
