"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_uploader = common_vendor.resolveComponent("van-uploader");
  (_component_van_button + _component_van_uploader)();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      icon: "photo",
      type: "primary"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/pages/test/test.vue"]]);
wx.createPage(MiniProgramPage);
