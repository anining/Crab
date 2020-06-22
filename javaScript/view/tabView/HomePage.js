import React, { Component } from 'react';
import {
    SafeAreaView,
    NativeModules,
    Dimensions,
    ImageBackground,
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { css } from '../../assets/style/css';
import LottieView from 'lottie-react-native';
import data5 from '../../lottie/data5';
import game41 from '../../assets/icon/game/game41.png';
import game25 from '../../assets/icon/game/game25.png';
import ImageAuto from '../../components/ImageAuto';
import ShiftView from '../../components/ShiftView';

const { height, width } = Dimensions.get('window');
// const { UIManager } = NativeModules;
// UIManager.setLayoutAnimationEnabledExperimental &&
// UIManager.setLayoutAnimationEnabledExperimental(true);
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        // setTimeout(() => {
        //     LayoutAnimation.configureNext(LayoutAnimation.create(1000, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.scaleXY));
        //     this.setState({ left: width - 50, top: height - 100 }, () => {
        //         console.log(this.state.left, this.state.top);
        //     });
        // }, 1000);
    }

    render () {
        return (
            <ImageBackground source={game41} style={[css.flex, css.pr, css.cover]}>
                <LottieView
                    style={{ width: width, height: 'auto' }}
                    imageAssetsFolder={'lottie5'}
                    source={data5}
                    loop={true}
                    autoPlay={true}
                    // autoSize={true}
                    speed={0.7}
                />
                <View style={[css.pa, css.cover]}>
                    <ShiftView>
                        <ImageAuto source={game25} width={60}/>
                    </ShiftView>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({});
