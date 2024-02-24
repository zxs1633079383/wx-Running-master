"use strict";
const common_vendor = require("../../common/vendor.js");
const request_index = require("../../request/index.js");
if (!Array) {
  const _component_van_image = common_vendor.resolveComponent("van-image");
  _component_van_image();
}
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    common_vendor.onLoad(() => {
      getChatData();
    });
    const ChatList = common_vendor.ref([]);
    const getChatData = async () => {
      await request_index.request({
        url: "chat/my/chat/list",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        }
      }).then((res) => {
        console.log(res.data.data);
        ChatList.value = res.data.data;
      });
    };
    const goConversation = (otherId) => {
      common_vendor.index.navigateTo({
        url: `/subpages/conversation/conversation?otherId=${otherId}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(ChatList.value, (i, index, i0) => {
          return {
            a: "37d63f20-0-" + i0,
            b: common_vendor.p({
              width: "100rpx",
              height: "100rpx",
              fit: "cover",
              src: i.user_img
            }),
            c: common_vendor.t(i.user_name),
            d: index,
            e: common_vendor.o(($event) => goConversation(i.user_id), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/pages/chat/chat.vue"]]);
wx.createPage(MiniProgramPage);
