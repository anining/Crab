import React, {Component} from 'react';
import {Platform, DeviceInfo, SafeAreaView, StyleSheet, View, ViewPropTypes, StatusBar, Text} from 'react-native';
import {PropTypes} from 'prop-types';

export default class SafeAreaViewPlus extends Component {
  static propTypes = {
    ...ViewPropTypes,
    topColor: PropTypes.string,
    topHeight: PropTypes.number,
    light: PropTypes.bool,
    translucent: PropTypes.bool,
    bottomColor: PropTypes.string,
    enablePlus: PropTypes.bool,
    topInset: PropTypes.bool,
    bottomInset: PropTypes.bool,
  };
  static defaultProps = {
    topColor: '#ffffff', // 上边颜色
    topHeight: 44, //上边高度
    light: false, //上边文字颜色
    translucent: false,
    bottomColor: '#f8f8f8', // 下面颜色
    enablePlus: true, //
    topInset: true, // 上面默认显示
    bottomInset: false, //  导航栏下面默认不显示
  };

  genSafeAreaViewPlus = () => {
    const {children, topColor, bottomColor, topInset, bottomInset, light, translucent} = this.props;
    return <View style={[styles.container, this.props.style]}>
      <StatusBar barStyle={light ? 'light-content' : 'dark-content'}  translucent={translucent} backgroundColor={translucent ? 'rgba(0,0,0,0)' : topColor}/>
      {this.getTopArea(topColor, topInset)}
      {children}
      {this.getBottomArea(bottomColor, bottomInset)}
    </View>;
  };

  genSafeAreaView = () => {
    const {light, translucent} = this.props;
    return <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
      <StatusBar barStyle={light ? 'light-content' : 'dark-content'} translucent={translucent} backgroundColor={translucent ? 'rgba(0,0,0,0)' : topColor}/>
      {this.props.children}
    </SafeAreaView>;
  };

  getTopArea = (topColor, topInset) => {
    const {topHeight} = this.props;
    if (Platform.OS === 'ios') {
      return DeviceInfo.isIPhoneX_deprecated ?
        <View style={[styles.topArea, {backgroundColor: topColor, height: topHeight}]}/> :
        <View style={[styles.otherTopArea, {backgroundColor: '#ffffff', height: topHeight}]}/>;
    } else {
      return null;
    }
  };

  getBottomArea = (bottomColor, bottomInset) => {
    return !DeviceInfo.isIPhoneX_deprecated || !bottomInset ? null
      : <View style={[styles.bottomArea, {backgroundColor: bottomColor}]}/>;
  };

  render = () => {
    const {enablePlus} = this.props;
    return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  otherTopArea: {
    height: 25,
  },
  topArea: {
    height: 44,
  },
  bottomArea: {
    height: 34,
  },
});
