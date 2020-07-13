import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    UIManager,
    Switch, Image, findNodeHandle,
    AsyncStorage
} from 'react-native';
import { _debounce, _if, identifyDebugDevelopmentEnvironment, initializationStore } from '../../utils/util';
import { SYSTEM_VERSION, VERSION_CODE } from '../../utils/config';
import { bindData, getPath } from '../../global/global';
import { setter } from '../../utils/store';
import user13 from '../../assets/icon/user/user13.png';
import ImageAuto from '../../components/ImageAuto';
import { N } from '../../utils/router';
import { initNetInfo } from '../../navigation/AppStackNavigator';
import toast from '../../utils/toast';

const { width } = Dimensions.get('window');
export default class SetPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            user: bindData('user', this),
            highPerformance: bindData('highPerformance', this),
            authorizationList: bindData('authorizationList', this),
        };
    }

    componentDidMount () {
        this.debounceSetHigh = _debounce(() => {
            this._setHighPerformance();
        }, 500);
        this.debounceCheckOut = _debounce(async (authorization) => {
            await SetPage._checkOutOtherNumber(authorization);
        }, 2000);
    }

    _setHighPerformance () {
        setter([['highPerformance', !this.state.highPerformance]], true);
    }

    static async _checkOutOtherNumber (authorization) {
        if (authorization) {
            setter([['authorization', `${authorization}`]], true);
            await initNetInfo();
            N.replace('MaterialTopTabNavigator');
            toast('切换成功');
        }
    }

    _renderAuthorizationList () {
        try {
            const view = [];
            for (const userPhone in this.state.authorizationList) {
                const userInfo = this.state.authorizationList[userPhone];
                const isNowNumber = userPhone === getPath(['phone'], this.state.user);
                view.push(
                    <TouchableOpacity activeOpacity={1} style={[styles.btn, {
                        backgroundColor: isNowNumber ? '#ededed' : '#fff'
                    }]} key={`user${userPhone}`} onPress={() => {
                        if (!isNowNumber) {
                            this.debounceCheckOut(userInfo.authorization);
                        }
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ImageAuto key={userInfo.avatar} source={userInfo.avatar} style={{ marginRight: 10, width: 34, borderRadius: 17, borderWidth: 1, borderColor: '#ededed' }}/>
                            <Text>{userInfo.nickname}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {_if(isNowNumber, res => <Text style={styles.nowNumberText}>当前</Text>)}
                        </View>
                    </TouchableOpacity>
                );
            }
            return view;
        } catch (e) {
            console.log(e, '_renderAuthorizationList');
        }
    }

    _logOut () {
        try {
            AsyncStorage.getAllKeys()
                .then(response => {
                    const responseArray = response.filter(x => new RegExp('[0-9]').test(x));
                    if (responseArray.length) {
                        AsyncStorage.multiRemove(response.filter(x => new RegExp('[0-9]').test(x)))
                            .then(async r => {
                                N.replace('VerificationStackNavigator');
                            });
                    } else {
                        N.replace('VerificationStackNavigator');
                    }
                })
                .catch((err) => {
                    N.replace('VerificationStackNavigator');
                });
        } catch (e) {
            console.log(e, '_logOut');
        }
    }

    render () {
        const highPerformance = this.state.highPerformance;
        return <View style={{ flex: 1 }}>
            {this._renderAuthorizationList()}
            <TouchableOpacity activeOpacity={1} style={styles.btn}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>关闭部分动画<Text style={{ color: '#999', fontSize: 10 }}>(系统版本:{SYSTEM_VERSION})</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Switch trackColor={{ false: '#ededed', true: '#FF6C00' }} thumbColor={highPerformance ? '#ededed' : '#ededed'} onValueChange={() => { this.debounceSetHigh(); }} value={highPerformance}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.btn} onPress={() => {
                this._logOut();
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>登录其他账号</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={user13} style={{ height: 13, width: 6, marginLeft: 10 }}/>
                </View>
            </TouchableOpacity>
            {_if(identifyDebugDevelopmentEnvironment(), res => <Text style={styles.debugText}>测试环境-版本号:{VERSION_CODE}-{SYSTEM_VERSION}</Text>, () => <Text style={styles.debugText}>趣玩赚-版本号:{VERSION_CODE}</Text>)}
        </View>;
    }
}
const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        width: width
    },
    debugText: {
        color: '#999',
        fontSize: 12,
        lineHeight: 40,
        textAlign: 'center',
        width
    },
    menuIcon: {
        height: 20,
        marginRight: 5,
        width: 20,
    },
    nowNumberText: {
        color: '#FF6C00',
        fontSize: 12
    },
});
