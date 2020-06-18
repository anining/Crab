import React, { Component } from 'react';
import { Image, Dimensions, View } from 'react-native';
import { formatStyle } from '../utils/util';
import { css } from '../assets/style/css';

const { width, height } = Dimensions.get('window');
/**
 * 使用示例
 <ImageAuto source={...} style={...}/>
 * **/
export default class ImageAuto extends Component {
    constructor (props) {
        super(props);
        this.state = {
            height: 0// 图片高度，自适应
        };
        this.source = this.props.source;
        this.style = formatStyle(this.props.style || { width: this.props.width || 100 });
        this.file = Image.resolveAssetSource(this.source);
        this.url = null;
    }

    componentDidMount () {
        this._judge();
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
            console.log(e);
        }
    }

    _getSize (source) {
        if (source && source.uri) {
            this.url = source.uri;
        } else {
            this.url = source;
        }
        Image.getSize(this.url, (width, height) => {
            this.setState({
                height: (this.style.width || width) * (height / width)
            });
        });
    }

    render () {
        try {
            if (this.state.height) {
                if (this.file) {
                    return <Image source={this.source} key={`${JSON.stringify(this.source)}${JSON.stringify(this.style)}`} style={{ ...this.style, height: this.state.height }}/>;
                } else {
                    return <Image resizeMode={'cover'} key={`${JSON.stringify(this.source)}`} source={{ uri: this.url }} style={{ ...this.style, height: this.state.height }}/>;
                }
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
