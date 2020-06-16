import React, { Component } from 'react';
import { BoxShadow } from 'react-native-shadow';

export default class Shadow extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.shadowOpt = {
            color: '#000',
            border: 6,
            opacity: 0.1,
            x: 0,
            y: 0,
            width: this.props.style.width,
            height: this.props.style.height,
            styles: this.props.style,
            radius: this.props.style.borderRadius || 0,
        };
    }
    render () {
        try {
            if (this.props.style && this.props.style.width && this.props.children) {
                return <BoxShadow setting={this.shadowOpt}>
                    {this.props.children}
                </BoxShadow>;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}
