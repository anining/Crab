import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

export function Down ({ time, style }) {
    const [text, setText] = useState('00:00:00');
    const endTime = new Date(time).getTime();

    function t (number) {
        number = Math.abs(number);
        if (number < 10) {
            number = `0${number}`;
        }
        return number;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (endTime - Date.now() < Date.now()) {
                clearInterval(interval);
                return;
            }
            const local = Number.parseInt((endTime - Date.now()) / 1000);
            const H = t(Number.parseInt(local / (60 * 60)));
            const remainderH = local % (60 * 60);
            const M = t(Number.parseInt(remainderH / 60));
            const S = t(remainderH % 60);
            setText(`${H}:${M}:${S}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return <Text style={style}>{text}</Text>;
}
