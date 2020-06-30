import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import { _if, djangoTime, msecsTransform } from '../utils/util';
import { css } from '../assets/style/css';
let millisecond = 9;
export default class CountDown extends Component {
    constructor (props) {
        super(props);
        this.timer = null;
        this.state = {
            nowTime: +new Date(),
            millisecond: 9
        };
    }

    componentDidMount () {
        this.timer = setInterval(() => {
            try {
                if (this.props.time && +new Date(djangoTime(this.props.time)) >= +new Date()) {
                    this.setState({
                        nowTime: +new Date(),
                    });
                } else {
                    this.timer && clearInterval(this.timer);
                }
            } catch (e) {
                console.log(e);
            }
        }, 1000);
        this.props.millisecond && (this.milliTimer = setInterval(() => {
            if (this.props.time && +new Date(djangoTime(this.props.time)) >= +new Date()) {
                if (millisecond > 0) { millisecond--; } else { millisecond = 9; }
                this.millisecondText.setNativeProps({
                    text: `.${millisecond}`
                });
            } else {
                this.millisecondText.setNativeProps({ text: '.0' });
            }
        }, 100));
    }

    componentWillUnmount () {
        this.timer && clearInterval(this.timer);
        this.milliTimer && clearInterval(this.milliTimer);
    }

    render () {
        if (this.props.time) {
            try {
                return (
                    <View style={[css.flex, css.pr]}>
                        {/* <View style={[css.pa, css.afs, { backgroundColor: 'red', flex: 1 }]}/> */}
                        <Text style={[(this.props.style || {})]}>{msecsTransform(+new Date(djangoTime(this.props.time)) - this.state.nowTime)}</Text>
                        {/* eslint-disable-next-line no-return-assign */}
                        {_if(this.props.millisecond, res =>
                            // eslint-disable-next-line no-return-assign
                            <TextInput disableFullscreenUI={false} style={[{ padding: 0, }, (this.props.style || {})]} enablesReturnKeyAutomatically={true} ref={ref => this.millisecondText = ref} defaultValue={'.9'} onFocus={() => {
                                this.millisecondText.blur();
                            }}/>)}
                        <Text style={[(this.props.style || {})]}>{this.props.tips}</Text>
                    </View>
                );
            } catch (e) {
                console.log(e);
                return null;
            }
        } else {
            return null;
        }
    }
}
