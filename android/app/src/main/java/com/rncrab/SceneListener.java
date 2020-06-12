package com.rncrab;

import android.app.Activity;

import com.mob.moblink.RestoreSceneListener;
import com.mob.moblink.Scene;

public class SceneListener extends Object implements RestoreSceneListener {

    @Override
    public Class<? extends Activity> willRestoreScene(Scene scene) {

        return MainActivity.class;
    }

    @Override
    public void notFoundScene(Scene scene) {
        //TODO 未找到处理scene的activity时回调

    }

    @Override
    public void completeRestore(Scene scene) {
        // TODO 在"拉起"处理场景的Activity之后调用
    }


}
