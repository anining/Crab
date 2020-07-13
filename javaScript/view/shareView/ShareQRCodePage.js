import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, ImageBackground, TouchableOpacity, View, Share } from 'react-native';
import { css } from '../../assets/style/css';
import Carousel from 'react-native-snap-carousel';
import share13 from '../../assets/icon/share/share13.png';
import share14 from '../../assets/icon/share/share14.png';
import share15 from '../../assets/icon/share/share15.png';
import share16 from '../../assets/icon/share/share16.png';
import { requestPermission, saveBase64ImageToCameraRoll } from '../../utils/util';
import { captureRef } from 'react-native-view-shot';
import toast from '../../utils/toast';
import QRCode from 'react-native-qrcode-svg';
import { getter } from '../../utils/store';
import * as U from 'karet.util';
import RNShare from 'react-native-share';
import { DEVELOPER } from '../../utils/config';
import { getGlobal, getPath } from '../../global/global';
const { invite_code } = getter(['user.invite_code']);
const { width } = Dimensions.get('window');
const deUrl = DEVELOPER === 'Production' ? 'https://qz.usershare.libratb.com/#/' : 'https://usershare.libratb.com/#/';
function ShareQRCodePage () {
    const view = U.atom([]);
    const [capture, setCapture] = useState();
    function save (type = 1) {
        const localView = view.get();
        try {
            if (capture) {
                requestPermission(() => {
                    captureRef(localView[capture.currentIndex], {
                        format: 'jpg',
                        quality: 1.0,
                        result: 'base64'
                    }).then(
                        uri => {
                            if (type === 1) {
                                saveBase64ImageToCameraRoll(uri, () => toast('保存成功,请到相册查看'), () => toast('保存失败'));
                            } else {
                                RNShare.open({
                                    title: '趣玩赚',
                                    message: '趣玩赚',
                                    url: `data:image/png;base64,${uri}`,
                                }).catch(err => {
                                    console.log(err);
                                });
                            }
                        },
                        () => {
                            toast('失败,captureRef错误');
                        },
                    );
                }, () => {
                    toast('失败,权限不足');
                });
            }
        } catch (e) {
            toast('失败,error');
        }
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#fff', justifyContent: 'space-around', paddingBottom: 10 }]}>
            <Slider view={view} setCapture={setCapture}/>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <TouchableOpacity activeOpacity={1} style={styles.btn} onPress={() => {
                    save(2);
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>分享给好友</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={[styles.btn, { backgroundColor: '#FF6C00' }]} onPress={() => {
                    save(1);
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>保存图片</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Slider ({ view, setCapture }) {
    const height = width * 0.7 * (1368 / 864);
    const data = [
        {
            id: 1,
            source: share13,
            size: width * 0.18,
            top: '49.5%',
            left: '37%',
        },
        {
            id: 2,
            source: share14,
            size: width * 0.33,
            top: '53%',
            left: '26.5%',
        },
        {
            id: 3,
            source: share15,
            size: width * 0.33,
            top: '56.2%',
            left: '26.5%',
        },
        {
            id: 4,
            source: share16,
            size: width * 0.27,
            top: '55.5%',
            left: '30.5%',
        }
    ];
    const URL = getPath(['configObj', 'app_other_info', 'value', 'shareUrl'], getGlobal('app'), deUrl);
    return (
        <View>
            <Carousel
                ref={ref => setCapture(ref) }
                data={data}
                renderItem={({ item }) => {
                    const { source, id, size, left, top } = item;
                    return (
                        <TouchableOpacity activeOpacity={1} key={id} style={{ borderRadius: 8, overflow: 'hidden' }}>
                            <ImageBackground source={source} style={{ width: width * 0.7, height, backgroundColor: '#fff', position: 'relative' }} ref={ref => {
                                let localView = view.get();
                                localView = [...localView, ...[ref]].slice(0, 4);
                                U.set(view, localView);
                            }}>
                                <View style={{ position: 'absolute', top, left }}>
                                    <QRCode
                                        value={`${URL}${invite_code.get()}`}
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
                autoplay={false}
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
