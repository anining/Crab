import React from 'react';
import { SafeAreaView, Dimensions, Image } from 'react-native';
import { css } from '../../assets/style/css';
import card3 from '../../assets/icon/card/card3.png';

const IMAGE = {
    1: card3,
    2: card3,
    3: card3,
    5: card3,
};
const { width } = Dimensions.get('window');
export default function AccountBindCoursePage (props) {
    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Image source={IMAGE[props.route.params.id] || card3} style={{ width, height: width * (366 / 618) }}/>
        </SafeAreaView>
    );
}
