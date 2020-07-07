package com.rncrab.jrad;

import android.content.Context;

import com.bytedance.sdk.openadsdk.TTAdConfig;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdSdk;

/**
 * 可以用一个单例来保存TTAdManager实例，在需要初始化sdk的时候调用
 */
public class TTAdManagerHolder {

    private static boolean sInit;

    public static TTAdManager get() {
        if (!sInit) {
            System.out.println("JRBANNER TTAdSdk is not init, please check.");
            throw new RuntimeException("TTAdSdk is not init, please check.");
        }
        return TTAdSdk.getAdManager();
    }

    public static void init(Context context) {
        doInit(context);
    }

    //step1:接入网盟广告sdk的初始化操作，详情见接入文档和穿山甲平台说明
    private static void doInit(Context context) {
        if (!sInit) {
            TTAdSdk.init(context, buildConfig(context));
            sInit = true;
        }
    }

    private static TTAdConfig buildConfig(Context context) {
        return new TTAdConfig.Builder()
                .appId("5084235") // 必选参数，设置应用的AppId
                .useTextureView(false) //使用TextureView控件播放视频,默认为SurfaceView,当有SurfaceView冲突的场景，可以使用TextureView
                .appName("趣玩赚") // 必选参数，设置应用名称
                .paid(true) // 可选参数，设置是否为计费用户：true计费用户、false非计费用户。默认为false非计费用户
                .titleBarTheme(TTAdConstant.TITLE_BAR_THEME_DARK) // 可选参数，设置落地页主题，默认为TTAdConstant#TITLE_BAR_THEME_LIGHT
                .allowShowNotify(true) // 可选参数，设置是否允许SDK弹出通知：true允许、false禁止。默认为true允许
                .allowShowPageWhenScreenLock(false) // 可选参数，设置是否允许落地页出现在锁屏上面：true允许、false禁止。默认为false禁止
                .debug(false) //测试阶段打开，可以通过日志排查问题，上线时去除该调用
                .directDownloadNetworkType(TTAdConstant.NETWORK_STATE_WIFI, TTAdConstant.NETWORK_STATE_4G, TTAdConstant.NETWORK_STATE_3G) //允许直接下载的网络状态集合
                .supportMultiProcess(false)
                .build();
    }
}
