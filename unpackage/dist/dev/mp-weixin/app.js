"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_counter = require("./stores/counter.js");
const utils_uuid = require("./utils/uuid.js");
require("./request/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/list/list.js";
  "./pages/me/me.js";
  "./pages/test/test.js";
  "./pages/order/order.js";
  "./pages/chat/chat.js";
  "./subpages/detail/detail.js";
  "./subpages/pay/pay.js";
  "./subpages/publish/publish.js";
  "./subpages/takeaway/takeaway.js";
  "./subpages/conversation/conversation.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    stores_counter.Store();
    common_vendor.onLaunch(() => {
      console.log("App Launch");
    });
    return () => {
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.createPinia());
  app.use(utils_uuid.uuid());
  return {
    app,
    Pinia: common_vendor.Pinia,
    uuid: utils_uuid.uuid
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
