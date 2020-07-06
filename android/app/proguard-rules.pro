# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html
-ignorewarnings
# Add any project specific keep options here:
# for SecVerify
-keep class com.mob.**{*;}
# for CTCC
-keep class cn.com.chinatelecom.account.**{*;}
# for CUCC
-keep class com.sdk.**{*;}
# for CMCC
-keep class com.cmic.sso.sdk.**{*;}
-keep class com.bytedance.sdk.openadsdk.** { *; }
-keep public interface com.bytedance.sdk.openadsdk.downloadnew.** {*;}
-keep class com.pgl.sys.ces.* {*;}
-keep class com.umeng.** {*;}
-keep class com.uc.** {*;}
-keepclassmembers class * {
   public <init> (org.json.JSONObject);
}
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
-keep class com.zui.** {*;}
-keep class com.miui.** {*;}
-keep class com.heytap.** {*;}
-keep class a.** {*;}
-keep class com.vivo.** {*;}
-keep public class com.rncrab.R$*{
public static final int *;
}
