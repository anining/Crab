import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');
export const css = StyleSheet.create({
    auto: {
        bottom: 0,
        left: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        right: 0,
        top: 0,
    },
    flex: {
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    flexCSB: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    flexRCSB: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flexRowCenterStart: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    fw: {
        flexWrap: 'wrap'
    },
    js: {
        justifyContent: 'flex-start',
    },
    pa: {
        position: 'absolute',
        zIndex: 1,
    },
    pr: {
        position: 'relative',
    },
    safeAreaView: {
        backgroundColor: '#fff', // 主题颜色
        flex: 1,
    },
    sp: {
        justifyContent: 'space-between',
    }
});
