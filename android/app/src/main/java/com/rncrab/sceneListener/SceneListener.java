package com.rncrab.sceneListener;

import android.app.Activity;
import android.util.Log;

import com.mob.moblink.RestoreSceneListener;
import com.mob.moblink.Scene;
import com.rncrab.MainActivity;

public class SceneListener extends Object implements RestoreSceneListener {
    private static final String TAG = "SceneListener";

    @Override
    public Class<? extends Activity> willRestoreScene(Scene scene) {

        return MainActivity.class;
    }

    @Override
    public void notFoundScene(Scene scene) {
        //TODO 未找到处理scene的activity时回调
        System.out.println("处理场景还原数据111: " + scene.params + "==" + scene.getParams() + "==" + scene.getPath());
    }

    @Override
    public void completeRestore(Scene scene) {
        // TODO 在"拉起"处理场景的Activity之后调用
        System.out.println("处理场景还原数据222: " + scene.params + "==" + scene.getParams() + "==" + scene.getPath());
    }
}
