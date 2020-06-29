import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import toast from '../utils/toast';
import OSS from 'ali-oss';
import { uploadToken } from '../utils/api';

export default function Upload ({ children, images = [], setImages, editable = true, style = {}, length }) {
    const [file, setFiles] = useState();

    function b64toBlob (b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    useEffect(() => {
        if (!file) {
            return;
        }
        try {
            const client = new OSS({
                region: 'oss-cn-hangzhou',
                accessKeyId: 'LTAI4GB1BAckVWYrUTyfNTa4',
                accessKeySecret: 'jLliBclqQHywsO5xxbj9lyWLUWNkiB',
                bucket: 'taskpicture'
            });
            const { data, mime } = file;
            // const aaa = new OSS.Buffer(file);
            const blob = b64toBlob(data, mime);
            // const aaa = new Blob(blob);
            // const blob = new Blob([JSON.stringify(data, null, 2)], { type: mime });
            // client.put('aaa.png', blob).then(r => console.log(r)).catch(e => console.log(e));

            uploadToken('taskpicture', 'AA_StarPraise/')
                .then(r => {
                    if (r && !r.error) {
                        const { dir, accessid, host, policy, signature, cdn_domain } = r.data;
                        const key = 'aaaacc.png';
                        const FD = new FormData();
                        const { data, mime, path } = file;
                        FD.append('key', key);
                        FD.append('policy', policy);
                        FD.append('OSSAccessKeyId', accessid);
                        FD.append('success_action_status', '200',);
                        FD.append('signature', signature);
                        FD.append('file', blob);
                        const XHR = new XMLHttpRequest();
                        XHR.addEventListener('error', e => {
                            console.log(e);
                            console.log(file);
                            toast('上传失败');
                        }, false);
                        XHR.addEventListener('load', e => {
                            console.log(e);
                            console.log(file);
                            console.log(`${cdn_domain}/${key}`);
                            // const newImages = [...[Object.assign(file, { uri: `${cdn_domain}/${key}` })], ...images].slice(0, length);
                            // setImages(newImages);
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
            console.log(e);
            toast('上传失败');
        }
    }, [file]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            editable && ImagePicker.openPicker({
                cropping: false,
                includeBase64: true,
                mediaType: 'photo'
            }).then(file => setFiles(file));
        }} style={style}>
            {children}
        </TouchableOpacity>
    );
}
