package com.rncrab.notice;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

/**
 * Created by Administrator on 2016/10/30.
 */

public class NoticeJs {
    //定义上下文对象
    public static ReactContext myContext;

    //定义发送事件的函数
    public void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        System.out.println("reactContext=" + reactContext);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void sendMsg(final String msgType, final JSONObject msg) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                WritableMap et = Arguments.createMap();
                et.putString(msgType, String.valueOf(msg));
                sendEvent(myContext, "nativeNotice", et);
            }
        }).start();
    }
}
