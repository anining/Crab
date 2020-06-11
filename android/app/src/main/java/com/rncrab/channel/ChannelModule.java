package com.rncrab.channel;

import android.content.pm.ApplicationInfo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.rncrab.utils.CommonUtils;
import com.rncrab.notice.NoticeJs;

import java.io.IOException;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.annotation.Nonnull;

import org.json.JSONException;
import org.json.JSONObject;

public class ChannelModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;
    public String channel = null;

    public ChannelModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "ChannelModule";
    }

    //获取Android渠道
    @ReactMethod
    public void getChannel() throws JSONException {
        if (channel != null) {
            JSONObject channelJson = new JSONObject();
            channelJson.put("versionName", CommonUtils.getVersionName(context));
            channelJson.put("channel", channel);
            new NoticeJs().sendMsg("channel", channelJson);
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
        JSONObject channelJson = new JSONObject();
        channelJson.put("versionName", CommonUtils.getVersionName(context));
        channelJson.put("channel", channel);
        new NoticeJs().sendMsg("channel", channelJson);
    }

}
