package com.rncrab.jrad;


import com.bytedance.sdk.openadsdk.TTAdNative;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import javax.annotation.Nonnull;

public class JradModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;
    private TTAdNative mTTAdNative;

    private static final String TAG = "JradModule";

    public JradModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "JradModule";
    }

}
