"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
require("../../request/index.js");
if (!Array) {
  const _component_van_image = common_vendor.resolveComponent("van-image");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  (_component_van_image + _component_van_button)();
}
const _sfc_main = {
  __name: "me",
  setup(__props) {
    const store = stores_counter.Store();
    const userData = common_vendor.computed(() => {
      return store.userInfo;
    });
    console.log(userData.value);
    const updateMe = () => {
      console.log("123");
      common_vendor.index.navigateTo({
        url: `/subpages/updateme/updateme`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          round: true,
          width: "200rpx",
          height: "200rpx",
          src: common_vendor.unref(userData).userAvatar
        }),
        b: common_vendor.t(common_vendor.unref(userData).userName),
        c: common_vendor.t(common_vendor.unref(userData).userMoney),
        d: common_vendor.o(($event) => updateMe())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/pages/me/me.vue"]]);
wx.createPage(MiniProgramPage);
