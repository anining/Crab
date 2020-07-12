package com.rncrab.utils;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.mob.moblink.ActionListener;
import com.mob.moblink.MobLink;
import com.mob.moblink.Scene;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public class CommonUtils {

    //获取版本号
    @Nullable
    public static String getVersionName(@NonNull Context context) {
        PackageManager manager = context.getPackageManager();
        String name = null;
        try {
            PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);
            name = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return name;
    }

    //获取渠道
    @Nullable
    private static String channel = null;

    @Nullable
    public static String getChannel(@NonNull Context context) {
        if (channel != null) {
            return channel;
        }
        final String start_flag = "META-INF/channel_";
        ApplicationInfo appinfo = context.getApplicationInfo();
        String sourceDir = appinfo.sourceDir;
        ZipFile zipfile = null;
        try {
            zipfile = new ZipFile(sourceDir);
            Enumeration<?> entries = zipfile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = ((ZipEntry) entries.nextElement());
                String entryName = entry.getName();
                if (entryName.contains(start_flag)) {
                    channel = entryName.replace(start_flag, "");
                    break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (zipfile != null) {
                try {
                    zipfile.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        if (channel == null || channel.length() <= 0) {
            channel = "master";//读不到渠道号就默认是官方渠道
        }
        return channel;
    }


    public void getMobId(@NonNull Promise promise) {
        // 设置场景参数
        HashMap<String, Object> senceParams = new HashMap<String, Object>();
        senceParams.put("key1", "apk");
        senceParams.put("key2", "apk");
        senceParams.put("key3", "apk");
        // 新建场景
        Scene s = new Scene();
        s.path = "/demo/a";
        s.params = senceParams;
        // 请求场景ID
        MobLink.getMobID(s, new ActionListener() {
            public void onResult(String mobID) {
                // TODO 根据mobID进行分享等操作
                promise.resolve(mobID);
            }

            @Override
            public void onResult(Object o) {

            }

            public void onError(Throwable throwable) {
                // TODO 处理错误结果
                promise.reject("error", throwable);
            }
        });
    }
}
