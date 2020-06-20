import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadImage } from '../utils/api';
import toast from '../utils/toast';

export default function Upload ({ children, style = {}, images, setImages, length }) {
    const [file, setFiles] = useState();

    useEffect(() => {
        if (!file) {
            return;
        }
        try {
            uploadImage('taskpicture', 'AA_StarPraise/')
                .then(response => {
                    if (response && !response.error) {
                        const { dir, accessid, policy, signature } = response.data;
                        const domain = 'https://ali.taskpic.libragx.com';
                        const key = dir + Date.now();
                        const FD = new FormData();
                        FD.append('key', key);
                        FD.append('Content-Type', file.type);
                        FD.append('OSSAccessKeyId', accessid);
                        FD.append('policy', policy);
                        FD.append('signature', signature);
                        FD.append('file', file);
                        const XHR = new XMLHttpRequest();
                        XHR.addEventListener('error', () => {
                            toast('上传图片失败');
                        }, false);
                        XHR.addEventListener('load', () => {
                            const newImages = [...[Object.assign(file, { uri: `${domain}/${key}` })], ...images].slice(0, length);
                            setImages(newImages);
                        }, false);
                        XHR.open('POST', domain, true);
                        XHR.send(FD);
                    } else {
                        toast('上传图片失败');
                    }
                });
        } catch (e) {
            toast('上传图片失败');
        }
    }, file);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            ImagePicker.openPicker({
                cropping: false,
                includeBase64: true,
                mediaType: 'photo',
                compressImageQuality: 1,
            }).then(image => setFiles(image));
            // }).then(image => {
            //     const newImages = [...[image], ...images].slice(0, length);
            //     setImages(newImages);
            // });
        }} style={style}>
            {children}
        </TouchableOpacity>
    );
}
