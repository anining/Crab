package com.rncrab.notice;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Administrator on 2016/10/30.
 */

public class NoticeJsModule extends ReactContextBaseJavaModule {

    public NoticeJsModule(@NonNull ReactApplicationContext reactContext) {

        super(reactContext);
        NoticeJs.myContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {

        return "NoticeJsModule";
    }


    @ReactMethod
    public void NativeMethod() {
    }
}
