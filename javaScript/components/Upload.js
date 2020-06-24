import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../utils/toast';
import { uploadToken } from '../utils/api';

export default function Upload ({ children, images = [], setImages, editable = true, style = {}, length }) {
    const [file, setFiles] = useState();

    useEffect(() => {
        if (!file) {
            return;
        }
        try {
            uploadToken('taskpicture', 'AA_StarPraise/')
                .then(r => {
                    if (r && !r.error) {
                        const { dir, accessid, host, policy, signature, cdn_domain } = r.data;
                        const key = dir + Date.now() + '.png';
                        const FD = new FormData();
                        FD.append('key', key);
                        FD.append('OSSAccessKeyId', accessid);
                        FD.append('Content-Type', file.mime);
                        FD.append('policy', policy);
                        FD.append('signature', signature);
                        FD.append('file', file);
                        const XHR = new XMLHttpRequest();
                        XHR.addEventListener('error', () => {
                            toast('上传失败');
                        }, false);
                        XHR.addEventListener('load', () => {
                            const newImages = [...[Object.assign(file, { uri: `${cdn_domain}/${key}` })], ...images].slice(0, length);
                            setImages(newImages);
                        }, false);
                        XHR.open('POST', host, true);
                        XHR.send(FD);
                    } else {
                        toast('上传失败');
                    }
                })
                .catch(() => {
                    toast('上传失败');
                });
        } catch (e) {
            toast('上传失败');
        }
    }, [file]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            editable && ImagePicker.openPicker({
                cropping: false,
                includeBase64: true,
                mediaType: 'photo',
                compressImageQuality: 1,
            }).then(file => setFiles(file));
        }} style={style}>
            {children}
        </TouchableOpacity>
    );
}
