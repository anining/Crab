import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, ImageBackground, TouchableOpacity, View, Share } from 'react-native';
import { css } from '../../assets/style/css';
import Carousel from 'react-native-snap-carousel';
import share13 from '../../assets/icon/share/share13.png';
import share14 from '../../assets/icon/share/share14.png';
import share15 from '../../assets/icon/share/share15.png';
import share16 from '../../assets/icon/share/share16.png';
import { requestPermission } from '../../utils/util';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import toast from '../../utils/toast';
import QRCode from 'react-native-qrcode-svg';
import { getter } from '../../utils/store';

const { invite_code } = getter(['user.invite_code']);
const { width } = Dimensions.get('window');

function ShareQRCodePage () {
    const [view, setView] = useState();

    async function onShare () {
        try {
            const result = await Share.share({
                // title: 'title',
                message: '',
            });
            if (result.action === Share.sharedAction) {

            } else if (result.action === Share.dismissedAction) {

            }
        } catch (error) {
            console.log(error.message);
        }
    }

    function save () {
        requestPermission(() => {
            if (view) {
                captureRef(view, {
                    format: 'jpg',
                    quality: 1.0,
                }).then(
                    uri => {
                        CameraRoll.saveToCameraRoll(uri)
                            .then(() => toast('保存成功,请到相册查看'))
                            .catch(() => toast('保存失败'));
                    },
                    () => () => toast('保存失败'),
                );
            }
        }).then(r => console.log(r));
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#fff', justifyContent: 'space-around', paddingBottom: 10 }]}>
            <Slider setView={setView}/>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <TouchableOpacity style={styles.btn} onPress={onShare}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>分享给好友</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#FF6C00' }]} onPress={save}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>保存图片</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Slider ({ setView }) {
    const height = width * 0.7 * (1368 / 864);
    const data = [
        {
            id: 1111,
            source: share13,
            size: width * 0.18,
            top: '49.5%',
            left: '37%',
        },
        {
            id: 2222,
            source: share14,
            size: width * 0.33,
            top: '53%',
            left: '26.5%',
        },
        {
            id: 3333,
            source: share15,
            size: width * 0.33,
            top: '56.2%',
            left: '26.5%',
        },
        {
            id: 444,
            source: share16,
            size: width * 0.27,
            top: '55.5%',
            left: '30.5%',
        },
    ];

    return (
        <View>
            <Carousel
                data={data}
                renderItem={({ item }) => {
                    const { source, id, size, left, top } = item;
                    return (
                        <TouchableOpacity key={id} style={{ borderRadius: 8, overflow: 'hidden' }}>
                            <ImageBackground source={source} style={{ width: width * 0.7, height, position: 'relative' }} ref={ref => setView(ref)}>
                                <View style={{
                                    position: 'absolute',
                                    top,
                                    left
                                }}>
                                    <QRCode
                                        value={`?invite=${invite_code.get()}`}
                                        size={size}
                                        color={'#333'}
                                        backgroundColor={'#fff'}
                                    />
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    );
                }}
                sliderWidth={width}
                itemWidth={width * 0.7}
                loop={false}
                lockScrollWhileSnapping={true}
                autoplay={true}
                autoplayDelay={2000}
                autoplayInterval={5000}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.8}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        backgroundColor: '#FF9C00',
        borderRadius: 22,
        height: 45,
        justifyContent: 'center',
        width: 140
    },
    sliderView: {
        backgroundColor: '#f8f8f8',
        height: '100%',
        width: '100%'
    }
});

export default ShareQRCodePage;
