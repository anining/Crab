import React, { Component } from 'react';
import { BoxShadow } from 'react-native-shadow';
import { formatStyle } from '../utils/util';
/**
 * 使用示例
 <Shadow style={...}>
    <View/>
 </Shadow>
 color选填
 * **/
export default class Shadow extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.shadowOpt = {
            color: this.props.color || '#333333',
            border: 3,
            opacity: this.props.opacity || 0.15,
            x: 0,
            y: 0,
            width: formatStyle(this.props.style) ? (formatStyle(this.props.style).width || 100) : 100,
            height: formatStyle(this.props.style) ? (formatStyle(this.props.style).height || 100) : 100,
            radius: formatStyle(this.props.style) ? (formatStyle(this.props.style).borderRadius || 0) : 0,
        };
    }

    render () {
        try {
            return <BoxShadow setting={this.shadowOpt}>
                {this.props.children}
            </BoxShadow>;
        } catch (e) {
            return null;
        }
    }
}
