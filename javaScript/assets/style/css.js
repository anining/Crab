import { StyleSheet } from 'react-native';

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
    flexRowCenterStart: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pa: {
        position: 'absolute',
        zIndex: 10
    },
    pr: {
        position: 'relative'
    },
    safeAreaView: {
        backgroundColor: '#fff', // 主题颜色
        flex: 1,
    }
});
