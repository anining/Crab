package com.rncrab.jrad;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import javax.annotation.Nonnull;

/*
 * 文档地址：../adtest/今日头条文档_README_1.9.9.5.html
 * */
public class JRadBannerViewManager extends SimpleViewManager<JRadBannerRelativeLayout> {

    public static final String REACT_VIEW = "jrbanner";

    @Nonnull
    @Override
    public String getName() {
        return REACT_VIEW;
    }

    @Nonnull
    @Override
    protected JRadBannerRelativeLayout createViewInstance(@Nonnull ThemedReactContext reactContext) {
        JRadBannerRelativeLayout jRadBannerRelativeLayout = new JRadBannerRelativeLayout(reactContext);
        return jRadBannerRelativeLayout;
    }
}
