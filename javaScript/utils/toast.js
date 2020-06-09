import React from 'react';
import {ToastAndroid} from 'react-native';

export default function toast(message = '', duration = ToastAndroid.SHORT, gravity = ToastAndroid.CENTER, yOffset = 0, xOffset = 0) {
  ToastAndroid.showWithGravityAndOffset(
    message,
    duration,
    gravity,
    yOffset,
    xOffset,
  );
};
