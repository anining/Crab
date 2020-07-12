package com.rncrab.verify;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mob.secverify.OperationCallback;
import com.mob.secverify.SecVerify;
import com.mob.secverify.exception.VerifyException;
import com.mob.secverify.OAuthPageEventCallback;
import com.mob.secverify.VerifyCallback;
import com.mob.secverify.datatype.VerifyResult;
import com.rncrab.notice.NoticeJs;
import com.rncrab.utils.CommonUtils;

import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.Nonnull;
public class SecVerifyModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;
    public SecVerifyModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }
    @Nonnull
    @Override
    public String getName() {
        return "SecVerifyModule";
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @ReactMethod
    public void isVerifySupport() throws JSONException {
        if (SecVerify.isVerifySupport()) {
            preVerify();
            JSONObject channelJson = new JSONObject();
            channelJson.put("tips", "正在获取");
            new NoticeJs().sendMsg("channel", channelJson);
        } else {
            JSONObject channelJson = new JSONObject();
            channelJson.put("tips", "暂不支持一键登录");
            new NoticeJs().sendMsg("channel", channelJson);
        }
    }


    /**
     * 预登录
     * <p>
     * 建议提前调用预登录接口，可以加快免密登录过程，提高用户体验
     */
    @ReactMethod
    public void preVerify() {
        //设置在1000-10000之内
        SecVerify.setTimeOut(5000);
        //移动的debug tag 是CMCC-SDK,电信是CT_ 联通是PriorityAsyncTask
        SecVerify.setDebugMode(true);
        SecVerify.setUseCache(true);
        SecVerify.preVerify(new OperationCallback() {
            @Override
            public void onComplete(Object data) {
            }

            @Override
            public void onFailure(VerifyException e) {
            }
        });
    }
    /**
     * 免密登录
     */
    private void verify() {
        //需要在verify之前设置
        SecVerify.OtherOAuthPageCallBack(new OAuthPageEventCallback() {
            @Override
            public void initCallback(@NonNull OAuthPageEventResultCallback cb) {
                cb.pageOpenCallback(new PageOpenedCallback() {
                    @Override
                    public void handle() {
                    }
                });
                cb.loginBtnClickedCallback(new LoginBtnClickedCallback() {
                    @Override
                    public void handle() {
                    }
                });
                cb.agreementPageClosedCallback(new AgreementPageClosedCallback() {
                    @Override
                    public void handle() {
                    }
                });
                cb.agreementPageOpenedCallback(new AgreementClickedCallback() {
                    @Override
                    public void handle() {
                    }
                });
                cb.cusAgreement1ClickedCallback(new CusAgreement1ClickedCallback() {
                    @Override
                    public void handle() {
                    }
                });
                cb.cusAgreement2ClickedCallback(new CusAgreement2ClickedCallback() {
                    @Override
                    public void handle() {
                    }
                });
                cb.checkboxStatusChangedCallback(new CheckboxStatusChangedCallback() {
                    @Override
                    public void handle(boolean b) {
                    }
                });
                cb.pageCloseCallback(new PageClosedCallback() {
                    @Override
                    public void handle() {
                    }
                });
            }
        });
        SecVerify.verify(new VerifyCallback() {
            @Override
            public void onOtherLogin() {
            }

            @Override
            public void onUserCanceled() {
            }

            @Override
            public void onComplete(VerifyResult data) {
            }

            @Override
            public void onFailure(VerifyException e) {
            }
        });
    }
}
