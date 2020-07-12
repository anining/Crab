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
} from 'react-native';
import { _debounce, _if, identifyDebugDevelopmentEnvironment } from '../../utils/util';
import { SYSTEM_VERSION, VERSION_CODE } from '../../utils/config';
import { bindData } from '../../global/global';
import { setter } from '../../utils/store';
import BindingX from 'react-native-bindingx';
const { width } = Dimensions.get('window');
export default class SetPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            highPerformance: bindData('highPerformance', this)
        };
    }

    componentDidMount () {
        console.log(this.state.highPerformance, 'highPerformancehighPerformance');
        this.debounceSetHigh = _debounce(() => {
            this._setHighPerformance();
        }, 500);
    }

    _setHighPerformance () {
        setter([['highPerformance', !this.state.highPerformance]], true);
    }

    render () {
        const highPerformance = this.state.highPerformance;
        return <View style={{ flex: 1 }}>
            <TouchableOpacity activeOpacity={1} style={styles.btn}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>高性能模式<Text style={{ color: '#999', fontSize: 10 }}>(系统版本:{SYSTEM_VERSION})</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Text style={{ fontSize: 13, color: '#999', marginRight: 5, ...css.sy }}>{remark}</Text> */}
                    {/* <Image source={user13} style={{ height: 13, width: 6, marginLeft: 10 }}/> */}
                    <Switch trackColor={{ false: '#ededed', true: '#FF6C00' }} thumbColor={highPerformance ? '#ededed' : '#ededed'}
                        onValueChange={() => {
                            this.debounceSetHigh();
                        }}
                        value={highPerformance}
                    />
                </View>
            </TouchableOpacity>
            {_if(identifyDebugDevelopmentEnvironment(), res => <Text style={styles.debugText}>测试环境-版本号:{VERSION_CODE}</Text>, () => <Text style={styles.debugText}>趣玩赚-版本号:{VERSION_CODE}</Text>)}
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
});
