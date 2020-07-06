package com.rncrab.jrad;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.FilterWord;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTBannerAd;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.ThemedReactContext;
import com.rncrab.R;
import com.rncrab.utils.CommonUtils;

import java.util.List;

/*
 * 今日头条banner
 * 文档地址：../adtest/今日头条文档_README_1.9.9.5.html
 * */
public class JRadBannerRelativeLayout extends RelativeLayout {

    private ThemedReactContext context;
    private TTAdNative mTTAdNative;
    private FrameLayout mBannerContainer;
    private TTNativeExpressAd mTTAd;
    private boolean mHasShowDownloadActive = false;
    public JRadBannerRelativeLayout(ThemedReactContext context) {
        super(context);
        this.context = context;
        init();
    }

    private void closeBanner() {
        System.out.println("JRBANNER closeBanner");
    }

    //初始化
    private void init() {
        View view = LayoutInflater.from(context).inflate(R.layout.jr_banner_layout, this, true);
        mBannerContainer = view.findViewById(R.id.jr_banner);
        initBanner();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        this.removeAllViews();
    }

    //初始化banner2.0
    private void initBanner() {
        System.out.println("JRBANNER initBanner");
        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        mTTAdNative = TTAdManagerHolder.get().createAdNative(context.getCurrentActivity());
        //step3:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        TTAdManagerHolder.get().requestPermissionIfNecessary(context.getCurrentActivity());
        loadBannerAd("945289408");
    }

    @ReactMethod
    public void destroy(final Promise promise) {
        try {
            if (mTTAd != null) {
                //调用destroy()方法释放
                mTTAd.destroy();
            }
            promise.resolve(null);
        } catch (IllegalViewOperationException e) {
            promise.reject("error", e);
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        super.onLayout(changed, l, t, r, b);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(mLayoutRunnable);
    }

    Runnable mLayoutRunnable = () -> {
        measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    private void loadBannerAd(String codeId) {
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(codeId) //广告位id
                .setSupportDeepLink(true)
                .setAdCount(2) //请求广告数量为1到3条
//                .setExpressViewAcceptedSize(expressViewWidth,expressViewHeight) //期望个性化模板广告view的size,单位dp
                .setImageAcceptedSize(600, 90)
                .build();
        //step5:请求广告，对请求回调的广告作渲染处理
        mTTAdNative.loadBannerExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {

            @Override
            public void onError(int code, String message) {
                System.out.println("JRBANNER onError" + message);
                mBannerContainer.removeAllViews();
            }

            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
                if (ads == null || ads.size() == 0) {
                    return;
                }
                mTTAd = ads.get(0);
                mTTAd.setSlideIntervalTime(30 * 1000);//设置轮播间隔 ms,不调用则不进行轮播展示
                bindAdListener(mTTAd);
                mTTAd.render();//调用render开始渲染广告
            }

            //绑定广告行为
            private void bindAdListener(TTNativeExpressAd ad) {
                ad.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
                    @Override
                    public void onAdClicked(View view, int type) {

                    }

                    @Override
                    public void onAdShow(View view, int type) {
                        System.out.println("JRBANNER onAdShow");
                    }

                    @Override
                    public void onRenderFail(View view, String msg, int code) {
                        System.out.println("JRBANNER onRenderFail" + msg);
                    }

                    @Override
                    public void onRenderSuccess(View view, float width, float height) {
                        //返回view的宽高 单位 dp
                        //在渲染成功回调时展示广告，提升体验
                        //在渲染成功回调时展示广告，提升体验
                        System.out.println("JRBANNER onRenderSuccess");
                        mBannerContainer.removeAllViews();
                        mBannerContainer.addView(view);
                    }
                });
                //dislike设置
                bindDislike(ad, false);
                if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
                    return;
                }
                //可选，下载监听设置
                ad.setDownloadListener(new TTAppDownloadListener() {
                    @Override
                    public void onIdle() {

                    }

                    @Override
                    public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                        if (!mHasShowDownloadActive) {
                            mHasShowDownloadActive = true;

                        }
                    }

                    @Override
                    public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {

                    }

                    @Override
                    public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {

                    }

                    @Override
                    public void onInstalled(String fileName, String appName) {

                    }

                    @Override
                    public void onDownloadFinished(long totalBytes, String fileName, String appName) {

                    }
                });
            }

            /**
             * 设置广告的不喜欢，开发者可自定义样式
             * @param ad
             * @param customStyle 是否自定义样式，true:样式自定义
             */
            private void bindDislike(TTNativeExpressAd ad, boolean customStyle) {
                //使用默认个性化模板中默认dislike弹出样式
                ad.setDislikeCallback(context.getCurrentActivity(), new TTAdDislike.DislikeInteractionCallback() {
                    @Override
                    public void onSelected(int position, String value) {
                        //用户选择不喜欢原因后，移除广告展示
                        mBannerContainer.removeAllViews();
                    }

                    @Override
                    public void onCancel() {
                    }

                    @Override
                    public void onRefuse() {

                    }
                });
            }

        });
    }
}
