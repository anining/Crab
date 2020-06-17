import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { css } from '../../assets/style/css';
import LottieView from 'lottie-react-native';
import data from '../../lottie/data';
import ListGeneral from '../../components/ListGeneral';
import ListHeader from '../../components/ListHeader';

export default function MyTaskPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <ListHeader>
                <View tabLabel="React" key={'React'}>
                    <LottieView
                        style={{ width: '100%', height: 'auto', backgroundColor: '#fff' }}
                        imageAssetsFolder={'lottie'}
                        source={data}
                        loop={true}
                        autoPlay={true}
                        speed={1}
                    />
                    <ListGeneral/>
                </View>
                <View tabLabel="React1" key={'React1'}>
                    <LottieView
                        style={{ width: '100%', height: 'auto', backgroundColor: '#fff' }}
                        imageAssetsFolder={'lottie'}
                        source={data}
                        loop={true}
                        autoPlay={true}
                        speed={1}
                    />
                    <ListGeneral/>
                </View>
            </ListHeader>
        </SafeAreaView>
    );
}
