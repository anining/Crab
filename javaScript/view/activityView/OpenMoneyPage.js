import React, { Component } from 'react';
import { _gv, _if, _tc } from '../../utils/util';
import {
    DeviceEventEmitter, Dimensions,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { css } from '../../assets/style/css';
import activity7 from '../../assets/icon/activity/activity7.png';
import activity8 from '../../assets/icon/activity/activity8.png';
import Header from '../../components/Header';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity14 from '../../assets/icon/activity/activity14.png';
import { activityDetail } from '../../utils/api';
import { N } from '../../utils/router';
const { height, width } = Dimensions.get('window');
export default class OpenMoneyPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            receivedStatus: 0 // 0 网络请求中，2 已经领取过了，1没有领取过
        };
        this.active_id = _gv(this.props, 'route.params.activity_id');
    }

    componentDidMount () {
        this._activityDetail();
    }

    async _activityDetail () {
        try {
            console.log(this.active_id, 'activity_id');
            const ret = await activityDetail(this.active_id);
            if (ret && !ret.error) {
                if (ret.data.logs.length) {
                    _tc(() => N.navigate('DailyMoneyPage', {
                        activity_id: this.active_id
                    }));
                } else {
                    this.setState({
                        receivedStatus: 1
                    });
                    DeviceEventEmitter.emit('showPop', {
                        dom: <View style={[css.pr]}>
                            <TouchableOpacity activeOpacity={1} style={[styles.redInnerWrap, css.pa, css.flex, css.fw]} onPress={() => {
                                this.setState({
                                    receivedStatus: 2
                                }, () => {
                                    DeviceEventEmitter.emit('hidePop');
                                });
                            }}>
                                <ImageAuto style={{
                                    width: 48,
                                    borderRadius: 20,
                                }} source={activity8}/>
                                <Text style={styles.redNameText}>运营商送你一个红包</Text>
                                <Text style={styles.redTipsText}>现在打开</Text>
                                <Text style={styles.redTipsText}>最低20元现金等着你</Text>
                            </TouchableOpacity>
                            <ImageAuto width={width * 0.8} source={activity14}/>
                        </View>,
                        close: () => {
                            if (this.state.receivedStatus < 2) {
                                N.goBack();
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1, backgroundColor: '#f8f8f8' }]}>
                <ImageBackground source={activity7} style={[styles.dmWrap]}>
                    <Header color={'#fff'} label={'天天领现金'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3}/>
                    {_if(this.state.receivedStatus === 0, res => {
                        return null;
                    }, () => {
                        return <View>

                        </View>;
                    })}
                </ImageBackground>
            </ScrollView>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    dmWrap: {
        height: 1056 / 1128 * width,
        width: width
    },
    loadingText: {
        color: '#fff',
        fontSize: 15,
        marginTop: width * 0.3,
        textAlign: 'center',
        width: '100%'
    },
    redInnerWrap: {
        // backgroundColor: 'red',
        flex: 1,
        height: '100%',
        padding: 20,
        width: '100%',
        // eslint-disable-next-line react-native/sort-styles
        paddingLeft: '13%',
        paddingBottom: '30%',
        overflow: 'hidden'
    },
    redNameText: {
        color: '#FDFAB1',
        fontSize: 14,
        lineHeight: 40,
        marginTop: 10,
        textAlign: 'center',
        width: '100%'
    },
    redTipsText: {
        color: '#FDFAB1',
        fontSize: 17,
        fontWeight: '900',
        lineHeight: 40,
        textAlign: 'center',
        width: '100%'
    }
});
