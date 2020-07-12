package com.rncrab.test;

import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.rncrab.utils.CommonUtils;

public class TestModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;

    public TestModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "TestModule";
    }

    @ReactMethod
    public void show(Promise promise) {
        new CommonUtils().getMobId(promise);
    }
}
