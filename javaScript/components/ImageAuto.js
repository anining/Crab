import React, { Component } from 'react';
import { Image, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');
export default class ImageAuto extends Component {
    constructor (props) {
        super(props);
        this.state = {
            height: 0// 图片高度，自适应
        };
        this.source = this.props.source;
        this.style = this.formatStyle(this.props.style);
        this.file = Image.resolveAssetSource(this.source);
    }

    componentDidMount () {
        this._judge();
    }

    formatStyle (style) {
        if (Array.isArray(style)) {
            let obj = {};
            style.forEach((item) => { obj = { ...obj, ...item }; });
            return obj;
        }
        return style;
    }

    _judge () {
        try {
            if (this.style && this.style.width) {
                if (this.file) {
                    this.setState({
                        height: (this.style.width || width) * this.file.height / this.file.width
                    });
                } else {
                    this._getSize(this.source);
                }
            }
        } catch (e) {

        }
    }

    _getSize (source) {
        Image.getSize(source, (width, height) => {
            this.setState({
                height: (this.style.width || width) * (height / width)
            });
        });
    }

    render () {
        try {
            if (this.state.height) {
                if (this.file) {
                    return <Image source={this.source} style={{ ...this.style, height: this.state.height }}/>;
                } else {
                    return <Image resizeMode={'cover'} source={{ uri: this.source }} style={{ ...this.style, height: this.state.height }}/>;
                }
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}
