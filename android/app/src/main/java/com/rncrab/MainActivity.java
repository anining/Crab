package com.rncrab;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.mob.moblink.MobLink;
import com.mob.moblink.Scene;
import com.mob.moblink.SceneRestorable;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity implements SceneRestorable {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected String getMainComponentName() {
        return "RnCrab";
    }

    @Override
    public void onReturnSceneData(Scene scene) {
        // 处理场景还原数据, 可以在这里做更新画面等操作
        String value1= (String) scene.getParams().get("key1");

    }
    @Override
    // 必须重写该方法，防止MobLink在某些情景下无法还原
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        MobLink.updateNewIntent(getIntent(), this);
    }
}
