import React, { useState, useEffect } from 'react';
import { StyleSheet, DeviceEventEmitter, ImageBackground, Text, Dimensions } from 'react-native';
import update1 from '../assets/icon/update/update1.png';
import { getter } from '../utils/store';
import { VERSION_CODE } from '../utils/config';
import RNFetchBlob from 'rn-fetch-blob';
import { requestPermission } from '../utils/util';

const STATUS_TYPE = ['立即更新', '正在下载,请耐心等待', '请安装新版本', '权限错误，请手动安装', '更新失败'];
const { width } = Dimensions.get('window');
const { app_version } = getter(['app.app_version']);

function MustUpdate () {
    const [status, setStatus] = useState(-1);
    const [localPath, setLocalPath] = useState();
    const appVersion = app_version.get() || { version_code: 100, is_update: false, describe: '有小更新哦', download_url: '' };
    const { version_code, is_update, describe } = appVersion;

    useEffect(() => {
        VERSION_CODE < Number.parseInt(version_code) && is_update && setStatus(0);
    }, []);

    function updateApi () {
        requestPermission(() => {
            switch (status) {
            case 0:download(); break;
            case 2:install(); break;
            }
        });
    }

    function install () {
        try {
            RNFetchBlob && localPath && RNFetchBlob.android.actionViewIntent(localPath, 'application/vnd.android.package-archive').then();
        } catch (e) {
            console.log(e);
            setStatus(3);
        }
    }

    function download () {
        setStatus(1);
        const { download_url } = appVersion;
        if (!download_url || download_url.indexOf('http') === -1) {
            return;
        }
        try {
            const dirs = RNFetchBlob.fs.dirs;
            const name = `趣玩赚${Date.now().toString().substring(8, -1)}.apk`;
            RNFetchBlob.config({
                addAndroidDownloads: {
                    useDownloadManager: true,
                    title: name,
                    description: describe,
                    mime: 'application/vnd.android.package-archive',
                    fileCache: true,
                    mediaScannable: true,
                    notification: true,
                    path: `${dirs.DownloadDir}/${name}`
                },
            })
                .fetch('GET', download_url)
                .then(r => {
                    console.log(r);
                    setLocalPath(r.path());
                    RNFetchBlob.android.actionViewIntent(r.path(), 'application/vnd.android.package-archive');
                    setStatus(2);
                })
                .catch(e => {
                    console.log(e);
                    setStatus(3);
                });
        } catch (e) {
            console.log(e);
            setStatus(4);
        }
    }

    if (status > -1) {
        DeviceEventEmitter.emit('showPop', {
            dom: (
                <ImageBackground source={update1} style={styles.container}>
                    <Text numberOfLines={2} style={styles.tips}>{describe}</Text>
                    <Text onPress={updateApi} numberOfLines={1} style={styles.btnText}>{STATUS_TYPE[status]}</Text>
                </ImageBackground>
            ),
            canCancel: false
        });
    }
    return <></>;
}

const styles = StyleSheet.create({
    btnText: {
        color: '#fff',
        fontSize: 15,
        position: 'absolute',
        textAlign: 'center',
        top: '80%',
        width: '100%'
    },
    container: {
        height: width * 0.8 * (1005 / 888),
        position: 'relative',
        width: width * 0.8
    },
    tips: {
        color: '#353535',
        fontSize: 17,
        fontWeight: '500',
        left: '10%',
        position: 'absolute',
        textAlign: 'center',
        top: '60%',
        width: '80%'
    }
});

export default MustUpdate;
