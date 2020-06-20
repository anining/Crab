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
} from 'react-native';
import { css } from '../../assets/style/css';
import activity7 from '../../assets/icon/activity/activity7.png';
import Header from '../../components/Header';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity6 from '../../assets/icon/activity/activity6.png';
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
                        return <Text style={styles.loadingText}>加载中...</Text>;
                    }, () => {

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
    }
});
