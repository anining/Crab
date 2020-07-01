/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, Text, TextInput } from 'react-native';
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
const sourceRender = Text.render;
Text.render = function render (props, ref) {
    return sourceRender.apply(this, [{ ...props, style: [{ fontFamily: 'sy-bold' }, props.style] }, ref]);
}; // 全局修改字体
AppRegistry.registerComponent(appName, () => AppStackNavigator);
