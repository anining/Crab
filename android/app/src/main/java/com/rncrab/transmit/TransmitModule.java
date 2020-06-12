package com.rncrab.transmit;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.rncrab.utils.CommonUtils;
/**
 * Created by luoyukun on 2020/06/12.
 * ===================记录json的构建方式===================
 * import org.json.JSONObject;
 * JSONObject channelJson = new JSONObject();
 * channelJson.put("versionName", CommonUtils.getVersionName(context));
 * channelJson.put("channel", channel);
 * new NoticeJs().sendMsg("channel", channelJson);
 * ===================记录android定时器学习=================
 * Timer timer = new Timer();
 * timer.schedule(new TimerTask() {
 * // *             @Override
 * public void run() {
 * try {
 * ...要执行的函数
 * } catch (JSONException e) {
 * e.printStackTrace();
 * }
 * }
 * },5000); // 延时1秒
 * ===================记录数据类型对应方式===================
 * Boolean -> Bool
 * Integer -> Number
 * Double -> Number
 * Float -> Number
 * String -> String
 * Callback -> function
 * ReadableMap -> Object
 * ReadableArray -> Array
 * ===================记录react与android通讯方式=============
 * 【常用】js可以通过ReactMethod方法唤起android函数并且可以通过Callback errorCallback【successCallback.invoke】或者
 * Promises的方式拿到回传值，详情参考官方文档 https://reactnative.cn/docs/native-modules-android
 * 【不常用】原生可以通过sendMsg方式随时对js进行通知， 一般不用
 */
public class TransmitModule extends ReactContextBaseJavaModule {
    public static ReactContext myContext;

    public TransmitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        myContext = reactContext;
    }

    @Override
    public String getName() {
        return "TransmitModule";
    }

    @ReactMethod
    public void promiseGetChannel(final Promise promise) {
        try {
            WritableMap wMap = new WritableNativeMap();
            wMap.putString("channel", CommonUtils.getChannel(myContext));
            promise.resolve(wMap);
        } catch (IllegalViewOperationException e) {
            promise.reject("error", e);
        }
    }

}