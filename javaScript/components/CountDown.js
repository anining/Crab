import React, { Component } from 'react';
import { Text } from 'react-native';
import { _if, djangoTime, msecsTransform } from '../utils/util';
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
                if (
                    this.props.time &&
                    +new Date(djangoTime(this.props.time)) >= +new Date()
                ) {
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
            // console.log(millisecond);
            if (millisecond > 0) {
                millisecond--;
                this.setState({
                    millisecond: millisecond
                });
            } else {
                millisecond = 9;
                this.setState({
                    millisecond: millisecond
                });
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
                    <Text style={[(this.props.style || {})]}>
                        {msecsTransform(+new Date(djangoTime(this.props.time)) - this.state.nowTime)}
                        {_if(this.props.millisecond, res => `.${this.state.millisecond}`)}
                        {this.props.tips}
                    </Text>
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
