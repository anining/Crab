/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, Text, TextInput, TouchableOpacity } from 'react-native';
import AppStackNavigator from './javaScript/navigation/AppStackNavigator';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';
enableScreens();
// 禁止字体因为系统的缩放而缩放
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {
    allowFontScaling: false,
}); // 新版RN使用该方法替代
Text.defaultProps = Object.assign({}, Text.defaultProps, {
    allowFontScaling: false,
});
const sourceRenderText = Text.render;
const sourceRenderTextInput = TextInput.render;
const sourceRenderTouchable = TouchableOpacity.render;
Text.render = function render (props, ref) {
    return sourceRenderText.apply(this, [{ ...props, style: [{ fontFamily: 'GenSenMaruGothicTW-Bold-TTF' }, props.style] }, ref]);
}; // 全局修改字体
TextInput.render = function render (props, ref) {
    return sourceRenderTextInput.apply(this, [{ ...props, style: [{ fontFamily: 'GenSenMaruGothicTW-Bold-TTF' }, props.style] }, ref]);
}; // 全局修改字体
TouchableOpacity.render = function render (props, ref) {
    return sourceRenderTouchable.apply(this, [{ ...props, activeOpacity: 1 }, ref]);
};
AppRegistry.registerComponent(appName, () => AppStackNavigator);
