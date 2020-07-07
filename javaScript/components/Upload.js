import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../utils/toast';
import { uploadToken } from '../utils/api';

function Upload ({ children, images = [], setImages, setProgress, progress = [], editable = true, index = 0, style = {}, length }) {
    const [file, setFiles] = useState();

    useEffect(() => {
        if (!file) {
            return;
        }
        if (!length) {
            const localProgress = [...progress];
            localProgress[index] = '正在上传...';
            setProgress && typeof setProgress === 'function' && setProgress(localProgress);
        }
        uploadToken('taskpicture', 'realman/upload/').then(r => {
            const { dir, accessid, host, policy, signature, cdn_domain } = r.data;
            const { mime } = file;
            if (r && !r.error) {
                const key = `${dir}${Date.now()}`;
                const FD = new FormData();
                FD.append('key', key);
                FD.append('Content-Type', mime);
                FD.append('OSSAccessKeyId', accessid);
                FD.append('policy', policy);
                FD.append('signature', signature);
                FD.append('file', file);
                const xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', e => {
                    if (!length) {
                        if (e.lengthComputable && setProgress && typeof setProgress === 'function') {
                            const localProgress = [...progress];
                            localProgress[index] = Math.round((e.loaded * 100) / e.total).toString();
                            setProgress(localProgress);
                        }
                    }
                }, false);
                xhr.addEventListener('error', () => {
                    toast('上传失败');
                    if (!length) {
                        const localProgress = [...progress];
                        localProgress[index] = '上传失败';
                        setProgress && typeof setProgress === 'function' && setProgress(localProgress);
                    }
                }, false);
                xhr.addEventListener('load', () => {
                    if (!length) {
                        const localImages = [...images];
                        localImages[index] = Object.assign(file, { uri: `${cdn_domain}/${key}` });
                        setImages(localImages);
                    } else {
                        const newImages = [...[Object.assign(file, { uri: `${cdn_domain}/${key}` })], ...images].slice(0, length);
                        setImages(newImages);
                    }
                }, false);
                xhr.open('POST', host, true);
                xhr.send(FD);
            }
        });
    }, [file]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            editable && ImagePicker.openPicker({
                cropping: false,
                includeBase64: true,
                mediaType: 'photo'
            }).then(response => {
                const { mime, path } = response;
                setFiles(Object.assign({ type: mime, uri: path }, response));
            });
        }} style={style}>
            {children}
        </TouchableOpacity>
    );
}

export default Upload;
