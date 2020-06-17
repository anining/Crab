import React, { Component } from 'react';
import Carousel from 'react-native-snap-carousel';
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import ImageAuto from './ImageAuto';
import { _if } from '../utils/util';
const { height, width } = Dimensions.get('window');
/**
 * 使用示例
 *<Slider data={[]} height={...} autoplay={true}/>
 * **/
export default class Slider extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.height = this.props.height || width * 0.3;
    }

    static _formatData (data) {
        if (data && data.length) {
            return data;
        }
        return [{ backgroundColor: '#ee8616' }, { backgroundColor: '#0dee62' }, { backgroundColor: '#154aee' }];
    }

    render () {
        return <Carousel
            data={Slider._formatData(this.props.data)}
            renderItem={({ item, index }) => {
                return <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.carouselSlide, { height: this.height }]}
                    key={`Carousel${index}`}
                    onPress={async () => { this.props.onPress && this.props.onPress(item); }}>
                    {_if(item.image || item.url || item.img, res => <ImageAuto source={res} style={{ width: width * 0.9 }}/>, () => {
                        return <View style={[styles.sliderView, {
                            backgroundColor: item.backgroundColor || '#f8f8f8'
                        }]}/>;
                    })}
                </TouchableOpacity>;
            }}
            sliderWidth={width}
            itemWidth={width * 0.9}
            loop={true}
            lockScrollWhileSnapping={true}
            autoplay={Boolean(this.props.autoplay)}
            autoplayDelay={2000}
            autoplayInterval={5000}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
        />;
    }
}

const styles = StyleSheet.create({
    carouselSlide: {
        borderRadius: 6,
        overflow: 'hidden',
        width: width * 0.9
    },
    sliderView: {
        height: '100%',
        width: '100%'
    }
});
