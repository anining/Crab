package com.rncrab.test;

import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.rncrab.utils.CommonUtils;

public class TestModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;

    public TestModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "TestModule";
    }

    @ReactMethod
    public void show(Promise promise) {
        new CommonUtils().getMobId(promise);
    }
}
