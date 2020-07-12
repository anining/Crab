package com.rncrab;

import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;
import com.mob.moblink.MobLink;
import com.mob.moblink.Scene;
import com.mob.moblink.SceneRestorable;
import com.mob.MobSDK;
import com.umeng.analytics.MobclickAgent;

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
    public void onReturnSceneData(@NonNull Scene scene) {
        // 处理场景还原数据, 可以在这里做更新画面等操作
        String value1 = (String) scene.getParams().get("key1");
        String value2 = scene.getPath();
        System.out.println("处理场景还原数据value1" + value1);
        System.out.println("处理场景还原数据value2" + value2);
    }

    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }
    @Override
    public void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    // 禁止字体缩放
    @Override
    public Resources getResources() {
        Resources res = super.getResources();
        Configuration config = new Configuration();
        config.setToDefaults();
        res.updateConfiguration(config, res.getDisplayMetrics());
        return res;
    }

    @Override
    // 必须重写该方法，防止MobLink在某些情景下无法还原
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        MobLink.updateNewIntent(getIntent(), this);
    }
}
