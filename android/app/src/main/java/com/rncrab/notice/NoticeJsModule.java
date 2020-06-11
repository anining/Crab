package com.rncrab.notice;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Administrator on 2016/10/30.
 */

public class NoticeJsModule extends ReactContextBaseJavaModule {

    public NoticeJsModule(ReactApplicationContext reactContext) {

        super(reactContext);
        System.out.println("111reactContext=" + reactContext);
        NoticeJs.myContext = reactContext;
    }

    @Override
    public String getName() {

        return "NoticeJsModule";
    }


    @ReactMethod
    public void NativeMethod() {
    }
}
