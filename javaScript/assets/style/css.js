import { StyleSheet } from 'react-native';

export const css = StyleSheet.create({
    RichText: {
        padding: 15
    },
    afs: {
        alignContent: 'flex-start',
        alignItems: 'flex-start',
    },
    auto: {
        bottom: 0,
        left: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        right: 0,
        top: 0,
    },
    cover: {
        flex: 1,
        height: '100%',
        width: '100%'
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
    gf: {
        fontFamily: 'sy-bold',
    },
    header: {
        height: 63,
        paddingTop: 63,
    },
    js: {
        justifyContent: 'flex-start',
    },
    minTitle: { color: '#666', fontSize: 12, letterSpacing: 0 },
    oh: {
        overflow: 'hidden'
    },
    pa: {
        position: 'absolute',
        zIndex: 1,
    },
    pr: {
        position: 'relative',
    },
    safeAreaView: {
        backgroundColor: '#fff',
        flex: 1,
    },
    sp: {
        justifyContent: 'space-between',
    }
});
