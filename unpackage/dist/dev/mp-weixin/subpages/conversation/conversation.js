"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
const request_index = require("../../request/index.js");
const utils_uuid = require("../../utils/uuid.js");
if (!Array) {
  const _component_van_image = common_vendor.resolveComponent("van-image");
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_uploader = common_vendor.resolveComponent("van-uploader");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_overlay = common_vendor.resolveComponent("van-overlay");
  (_component_van_image + _component_van_icon + _component_van_uploader + _component_van_button + _component_van_overlay)();
}
const _sfc_main = {
  __name: "conversation",
  setup(__props) {
    const store = stores_counter.Store();
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    let otherId = null;
    let id = null;
    const fileList = common_vendor.ref([]);
    const logManager = common_vendor.index.getRealtimeLogManager();
    const log = logManager.tag("plugin-onUserTapSth");
    const uploadImage = (e) => {
      console.log(e);
      readFileAsBase64(e.detail.file);
    };
    const readFileAsBase64 = (file, callback) => {
      console.log(file);
      common_vendor.index.getFileSystemManager().readFile({
        filePath: file[0].url,
        encoding: "base64",
        success(res) {
          msg_text.value = res.data;
          console.log(res.data);
          send(1);
        },
        fail(err) {
          console.log("读取失败");
        }
      });
    };
    common_vendor.onBackPress(() => {
      console.log(1);
    });
    common_vendor.onLoad(async (option) => {
      if ("otherId" in option) {
        otherId = option.otherId;
      }
      console.log(store.userInfo);
      await request_index.request({
        url: "chat/selectChatID_A_And_B",
        method: "POST",
        data: {
          "userA": store.userId,
          "userB": otherId
        },
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        }
      }).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          id = res.data.data;
          getHistoryChat();
        } else {
          id = utils_uuid.uuid();
        }
        common_vendor.index.connectSocket({
          url: `wss://runningcampujxls.com/api/websocket/${id}`,
          // url:`ws://39.99.231.129:8121/api/websocket/${id}`,
          complete: () => {
          }
        });
        common_vendor.index.onSocketOpen((res2) => {
          log.info("open", "socket连接打开");
          console.log("websocket连接已打开");
        });
        common_vendor.index.onSocketClose((res2) => {
          log.error("error", `websocket 打开失败 请检查!: ${res2}`);
          console.log("websocket 打开失败 请检查!");
        });
      });
    });
    common_vendor.onReady(() => {
      scrollBottom();
    });
    const msg_text = common_vendor.ref("");
    const text_value = (e) => {
      msg_text.value = e.detail.value.trim();
    };
    const chatList = common_vendor.ref([]);
    const getHistoryChat = async () => {
      request_index.request({
        url: "chat/toChatInnerByUserA_AndUserB",
        method: "POST",
        data: {
          "userA": store.userId,
          "userB": otherId
        },
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        }
      }).then((res) => {
        console.log(res.data.data);
        chatList.value = res.data.data;
      });
    };
    const show = common_vendor.ref(false);
    const showImage = common_vendor.ref("");
    const LookImage = (url) => {
      show.value = true;
      showImage.value = url;
    };
    const send = (type) => {
      let obj = {
        "chat_id": id,
        // 聊天室ID 用户A和用户B
        "user_id": store.userId,
        // 用户ID: 当前登录用户
        "user_img": store.userInfo.userAvatar,
        // 用户图片: 从pinna拿
        "user_name": store.userInfo.userName,
        //用户名称: 从pinna拿
        "content": msg_text.value,
        //聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
        "content_type": type,
        //聊天类型，0是普通文本，1是图片
        // sendSocketMessage为具体调用数据的方法
        //场景一 例如你发布了订单，你想去找到订单承接人去聊天，点击去聊天，应该获得 当前订单的承接人的用户ID。 然后填写到这里1
        //场景二 例你承接了某个订单 你想去和订单主人聊天，点击去聊天，应该获得当前订单的发布者的用户，填写到这里， ( 数中 已包合订单的发布者的用户ID 已实现)
        // 其他用户的ID
        "user_other": otherId
      };
      if (msg_text.value.length != 0) {
        sendSocketMessage(JSON.stringify(obj));
      }
      msg_text.value = "";
    };
    const sendSocketMessage = (message2) => {
      console.log(message2);
      log.error("send", "socket主动发送数据: " + message2);
      common_vendor.index.sendSocketMessage({ data: message2 });
    };
    common_vendor.index.onSocketMessage((res) => {
      console.log("后台返回", JSON.parse(res.data));
      chatList.value.push(JSON.parse(res.data));
      scrollBottom();
    });
    common_vendor.index.onSocketClose((res) => {
      console.log("当前连接已关闭");
      log.error("close", "当前连接已关闭: " + message);
    });
    const scrollBottom = () => {
      common_vendor.index.createSelectorQuery().select("#bottom").boundingClientRect((res) => {
        console.log(res);
        common_vendor.index.pageScrollTo({
          scrollTop: res.bottom,
          duration: 300
        });
      }).exec();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(chatList.value, (i, index, i0) => {
          return common_vendor.e({
            a: i.user_id == common_vendor.unref(store).userId
          }, i.user_id == common_vendor.unref(store).userId ? common_vendor.e({
            b: i.content_type == 0
          }, i.content_type == 0 ? {
            c: common_vendor.t(i.content)
          } : {
            d: common_vendor.o(($event) => LookImage(i.content), index),
            e: "5a6be478-0-" + i0,
            f: common_vendor.p({
              width: "180rpx",
              height: "180rpx",
              src: i.content
            })
          }, {
            g: "5a6be478-1-" + i0,
            h: common_vendor.p({
              round: true,
              width: "80rpx",
              height: "80rpx",
              src: i.user_img
            })
          }) : common_vendor.e({
            i: "5a6be478-2-" + i0,
            j: common_vendor.p({
              round: true,
              width: "80rpx",
              height: "80rpx",
              src: i.user_img
            }),
            k: i.content_type == 0
          }, i.content_type == 0 ? {
            l: common_vendor.t(i.content)
          } : {
            m: common_vendor.o(($event) => LookImage(i.content), index),
            n: "5a6be478-3-" + i0,
            o: common_vendor.p({
              width: "180rpx",
              height: "180rpx",
              src: i.content
            })
          }), {
            p: index
          });
        }),
        b: common_vendor.o(text_value),
        c: msg_text.value,
        d: common_vendor.p({
          size: "60rpx",
          name: "photo-o"
        }),
        e: common_vendor.o(uploadImage),
        f: common_vendor.p({
          maxSize: 8388608,
          value: fileList.value,
          multiple: true,
          accept: "image/*"
        }),
        g: common_vendor.o(($event) => send(0)),
        h: common_vendor.p({
          size: "small",
          type: "primary"
        }),
        i: showImage.value,
        j: common_vendor.o(($event) => show.value = false),
        k: common_vendor.p({
          show: show.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/subpages/conversation/conversation.vue"]]);
wx.createPage(MiniProgramPage);
