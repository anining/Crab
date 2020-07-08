import React from 'react';
import { Dimensions, ScrollView, Text, ImageBackground, StyleSheet } from 'react-native';
import medal1 from '../../assets/icon/medal/medal1.png';
import { N } from '../../utils/router';

const { width } = Dimensions.get('window');

function MyMedal () {
    return (
        <ScrollView>
            <ImageBackground source={medal1} style={styles.container} >
                <Text style={{ flex: 1 }} onPress={() => N.navigate('CardPackagePage')}/>
            </ImageBackground>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: width * (2343 / 1125),
        width,
    }
});

export default MyMedal;
