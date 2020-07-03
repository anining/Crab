package com.rncrab.transmit;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.mob.moblink.ActionListener;
import com.mob.moblink.MobLink;
import com.mob.moblink.Scene;
import com.mob.MobSDK;
import com.mob.OperationCallback;
import com.mob.secverify.SecVerify;
import com.mob.secverify.VerifyCallback;
import com.mob.secverify.datatype.LoginResult;
import com.mob.secverify.datatype.VerifyResult;
import com.mob.secverify.exception.VerifyException;
import com.rncrab.utils.CommonUtils;

import java.util.HashMap;


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

    @ReactMethod
    public void promiseGetMobId(Promise promise) {
//        new CommonUtils().getMobId(promise);
        // 设置场景参数
        HashMap<String, Object> senceParams = new HashMap<String, Object>();
        senceParams.put("key1", "value1");
        senceParams.put("key2", "value2");
        senceParams.put("key3", "value3");
        // 新建场景
        Scene s = new Scene();
        s.path = "/demo/a";
        s.params = senceParams;
        // 请求场景ID
        MobLink.getMobID(s, new ActionListener() {
            public void onResult(String mobID) {
                // TODO 根据mobID进行分享等操作
                System.out.println("onResult=" + mobID);
            }

            @Override
            public void onResult(Object o) {
                System.out.println("onResult=");
                promise.resolve(o);
            }

            public void onError(Throwable throwable) {
                // TODO 处理错误结果
                System.out.println("TODO 处理错误结果=");
                promise.reject("error", throwable);
            }
        });
    }

    @ReactMethod
    public void policyGrantResult(final Promise promise) {
        MobSDK.submitPolicyGrantResult(true, null);
        promise.resolve("已接受协议");
    }

//    @ReactMethod
//    public void preVerifyLogin(final Promise promise) {
//        SecVerify.preVerify(new OperationCallback<Void>() {
//            @Override
//            public void onComplete(Void data) {
//                //TODO处理成功的结果
//                promise.resolve(data);
//            }
//            @Override
//            public void onFailure(Throwable throwable) {
//
//            }
//        });
//    }

    @ReactMethod
    public void verifyLogin(final Promise promise) {
        if (SecVerify.isVerifySupport()) {
            MobSDK.submitPolicyGrantResult(true, new OperationCallback() {
                @Override
                public void onComplete(Object o) {
                    SecVerify.verify(new VerifyCallback() {
                        @Override
                        public void onOtherLogin() {
                            // 用户点击“其他登录方式”，处理自己的逻辑
                            promise.reject("onOtherLogin");
                        }

                        @Override
                        public void onUserCanceled() {
                            // 用户点击“关闭按钮”或“物理返回键”取消登录，处理自己的逻辑
                            promise.reject("onUserCanceled");
                        }

                        @Override
                        public void onComplete(VerifyResult data) {
                            WritableMap wMap = new WritableNativeMap();
                            wMap.putString("operator", data.getOperator());
                            wMap.putString("opToken", data.getOpToken());
                            wMap.putString("token", data.getToken());
                            System.out.println("reactContext1112=" + wMap);
                            promise.resolve(wMap);
                        }

                        @Override
                        public void onFailure(VerifyException e) {
                            //TODO处理失败的结果
                            promise.reject("error", e + "??321");
                        }
                    });
                }

                @Override
                public void onFailure(Throwable t) {
                    promise.reject("error", t+ "??3213211a");
                }
            });
        } else {
            promise.reject("当前网络环境不支持");
        }
    }
}
