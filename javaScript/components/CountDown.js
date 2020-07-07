import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import { _if, djangoTime, msecsTransform, setAndroidTime } from '../utils/util';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
let millisecond = 9;
export default class CountDown extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        const propsTime = +new Date(djangoTime(this.props.time));
        this.setTime(propsTime && propsTime >= +new Date(), () => {
            this.secondText.setNativeProps({
                text: `${msecsTransform(propsTime - (+new Date()))}`
            });
        }, this.props.callback, 1000);
        this.props.millisecond && this.setTime(propsTime && propsTime >= +new Date(), () => {
            if (millisecond > 0) { millisecond--; } else { millisecond = 9; }
            this.millisecondText.setNativeProps({
                text: `.${millisecond}`
            });
        }, null, 100);
    }

    setTime (ifSentence, ifSentenceDo, callback, time = 1000) {
        setAndroidTime(() => {
            try {
                if (ifSentence) {
                    ifSentenceDo && ifSentenceDo();
                    this.setTime(...arguments);
                } else {
                    callback && callback();
                }
            } catch (e) {
                console.log(e);
            }
        }, time);
    }

    componentWillUnmount () {
    }

    render () {
        if (this.props.time) {
            try {
                return (
                    <View style={[css.flex, css.pr, { height: 30 }, this.props.viewStyle]}>
                        <View style={[css.pa, css.afs, { flex: 1, height: '100%', width: '100%' }]}/>
                        <TextInput disableFullscreenUI={false} style={[{ padding: 0 }, (this.props.style)]} ref={ref => this.secondText = ref} defaultValue={msecsTransform(+new Date(djangoTime(this.props.time)) - (+new Date()))}/>
                        {_if(this.props.millisecond, res =>
                            <TextInput disableFullscreenUI={false} style={[{ padding: 0 }, (this.props.style)]} ref={ref => this.millisecondText = ref} defaultValue={'.9'}/>)}
                        <Text style={[(this.props.style)]}>{this.props.tips}</Text>
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
CountDown.propTypes = {
    style: PropTypes.object,
    viewStyle: PropTypes.object,
    callback: PropTypes.func,
    millisecond: PropTypes.bool
};
CountDown.defaultProps = {
    style: {},
    viewStyle: {},
    callback: () => {},
    millisecond: false
};
