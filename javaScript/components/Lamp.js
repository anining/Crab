import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Easing, Dimensions, Image, } from 'react-native';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
const { height, width } = Dimensions.get('window');
const LAMP_HEIGHT = 28; // 单个高度
const LAMP_BORDER_RADIUS = 14;
const LAMP_TIME = 600;
const DELAY_TIME = 1000;
const LAMP_ICON_WIDTH = 35;

export default class Lamp extends Component {
    constructor (props) {
        super(props);
        this.state = {
            translateValue: new Animated.Value(0), // 定位初始值为0
            // stop: false // 是否暂停
        };
        this.LampList = this.props.LampList;
        this._stop = false; // 是否暂停
        this.width = this.props.width;
        this.backgroundColor = this.props.backgroundColor;
        this.color = this.props.color;
        this.color1 = this.props.color1;
        this.index = 0;
        this.animation = null;
    }

    async componentDidMount () {
        // this.AnimationStart.call(this, 0, this.state.LampList.length);
        this.start();
    }

    componentWillUnmount () {
        this.animation && this.animation.stop();
    }

    AnimationStart (index, count) {
        if (count) {
            requestAnimationFrame(() => {
                this.index++;
                this.animation = Animated.timing(this.state.translateValue, {
                    toValue: -LAMP_HEIGHT * this.index,
                    duration: LAMP_TIME,
                    easing: Easing.linear(),
                    delay: DELAY_TIME, // 文字停留时间
                    useNativeDriver: true,
                }).start(() => {
                    if (this.index >= count) {
                        this.index = 0;
                        this.state.translateValue.setValue(0);
                    }
                    if (!this._stop) {
                        this.AnimationStart.call(this, this.index, this.LampList.length);
                    }
                });
            });
        }
    }

    start () {
        if (this._stop) {
            this._stop = false;
        }
        this.AnimationStart.call(this, this.index, this.LampList.length);
    }

    stop () {
        this._stop = true;
    }

    render () {
        return (
            <View style={[css.flex, styles.lamp, {
                width: this.width,
                backgroundColor: this.backgroundColor
            }]}>
                <View style={styles.animatedWrap}>
                    <Animated.View style={{ ...styles.lampContent, transform: [{ translateY: this.state.translateValue, }] }}>
                        {(() => {
                            if (this.LampList.length) {
                                const lampView = [];
                                this.LampList.forEach((item, index) => {
                                    lampView.push(
                                        <Text style={[styles.lampItem, {
                                            color: this.color
                                        }]} key={index} numberOfLines={1} > 恭喜 <Text style={{ color: this.color1 }}> {item.name} </Text>成功领取现金 <Text style={{ color: this.color1 }}> {item.money} 元 </Text></Text>,
                                    );
                                });
                                return lampView;
                            } else {
                                return (
                                    <Text style={styles.lampItem}>
                                        暂时没有数据
                                    </Text>
                                );
                            }
                        }).call(this)}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

Lamp.propTypes = {
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    color1: PropTypes.string,
    LampList: PropTypes.array
};
Lamp.defaultProps = {
    width: '70%',
    backgroundColor: '#F02E21',
    color: '#fff',
    color1: '#ffebc1',
    LampList: [{ name: 'xxx', money: 'xxx' }, { name: 'xxx', money: 'xxx' }]
};

const styles = StyleSheet.create({
    animatedWrap: {
        borderRadius: LAMP_BORDER_RADIUS,
        flex: 1,
        height: LAMP_HEIGHT,
        overflow: 'hidden',
    },
    icon: {
        height: 20,
        width: 20,
    },
    lamp: {
        alignItems: 'flex-start',
        backgroundColor: '#F02E21',
        height: LAMP_HEIGHT,
        justifyContent: 'flex-start',
        marginVertical: 10,
        overflow: 'hidden',
        width: '70%',
        ...css.auto,
        borderRadius: LAMP_BORDER_RADIUS,
    },
    lampContent: {
        flex: 1,
        paddingLeft: 25,
        paddingRight: 20,
    },
    lampItem: {
        color: '#fff',
        height: LAMP_HEIGHT,
        lineHeight: LAMP_HEIGHT,
        textAlign: 'center',
    },
});
