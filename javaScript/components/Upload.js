import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../utils/toast';
import { uploadToken } from '../utils/api';

export default function Upload ({ children, images = [], setImages, style = {}, length }) {
    const [file, setFiles] = useState();

    useEffect(() => {
        if (!file) {
            return;
        }
        try {
            uploadToken()
                .then(r => {
                    if (r && !r.error) {
                        const { dir, accessid, policy, signature, cdn_domain } = r.data;
                        const key = dir + '/' + Date.now();
                        const FD = new FormData();
                        FD.append('key', key);
                        FD.append('Content-Type', file.mime);
                        FD.append('OSSAccessKeyId', accessid);
                        FD.append('policy', policy);
                        FD.append('signature', signature);
                        FD.append('file', file);
                        const XHR = new XMLHttpRequest();
                        XHR.upload.addEventListener('progress', evt => {
                            console.log(evt);
                        }, false);
                        XHR.addEventListener('error', (e) => {
                            toast('上传失败2');
                        }, false);
                        XHR.addEventListener('load', () => {
                            console.log(11111111);
                            // const newImages = [...[Object.assign(file, { uri: `${cdn_domain}/${key}` })], ...images].slice(0, length);
                            // setImages(newImages);
                        }, false);
                        XHR.open('POST', cdn_domain, true);
                        XHR.send(FD);
                    } else {
                        toast('上传失败1');
                    }
                })
                .catch(() => {
                    toast('上传失败3');
                });
        } catch (e) {
            toast('上传失败4');
        }
    }, [file]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            ImagePicker.openPicker({
                cropping: false,
                includeBase64: true,
                mediaType: 'photo',
                compressImageQuality: 1,
            }).then(file => {
                const uploadFile = Object.assign({ type: file.mime, uri: file.path, }, file);
                setFiles(uploadFile);
            });
        }} style={style}>
            {children}
        </TouchableOpacity>
    );
}
