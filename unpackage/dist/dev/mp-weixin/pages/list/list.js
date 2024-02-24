"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
const request_index = require("../../request/index.js");
const utils_uuid = require("../../utils/uuid.js");
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_card = common_vendor.resolveComponent("van-card");
  const _component_van_loading = common_vendor.resolveComponent("van-loading");
  const _component_van_tab = common_vendor.resolveComponent("van-tab");
  const _component_van_tabs = common_vendor.resolveComponent("van-tabs");
  (_component_van_button + _component_van_card + _component_van_loading + _component_van_tab + _component_van_tabs)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const store = stores_counter.Store();
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    let jieliu = true;
    common_vendor.onPullDownRefresh(() => {
      jieliu = true;
      if (index == 0) {
        geedCurrent = 1;
        feedIndentList.value = [];
        getfeedList(1);
      } else if (index == 1) {
        otherCurrent = 1;
        otherIndentList.value = [];
        getOtherList(1);
      }
    });
    common_vendor.onTabItemTap((e) => {
      jieliu = true;
      feedIndentList.value = [];
      getfeedList(1);
    });
    let geedCurrent = 1;
    let otherCurrent = 1;
    const loadShow = common_vendor.ref(false);
    common_vendor.onReachBottom(() => {
      console.log(1);
      if (index == 0) {
        geedCurrent++;
        getfeedList(geedCurrent);
      } else if (index == 1) {
        otherCurrent++;
        getOtherList(otherCurrent);
      }
    });
    let index = 0;
    const checkTab = (e) => {
      console.log(e.detail.index);
      index = e.detail.index;
      jieliu = true;
      if (index == 0) {
        feedIndentList.value = [];
        getfeedList(1);
      } else if (index == 1) {
        otherIndentList.value = [];
        getOtherList(1);
      }
    };
    const msg_reOr = common_vendor.ref(false);
    const receiveOrder = async (cartId, orderId) => {
      await request_index.request({
        url: "feedOrderCenter/update",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        },
        data: {
          "cart_id": cartId,
          "id": 0,
          "running_user_id": store.userId
        }
      }).then((res) => {
        if (res.data.code == 0) {
          msg_reOr.value = true;
          jieliu = true;
          feedIndentList.value = [];
          getfeedList(1);
          setTimeout(() => {
            msg_reOr.value = false;
          }, 500);
          let id = null;
          request_index.request({
            url: "chat/selectChatID_A_And_B",
            method: "POST",
            data: {
              "userA": store.userId,
              "userB": orderId
            },
            header: {
              "content-type": "application/json",
              "Cookie": storedCookie
            }
          }).then(async (res2) => {
            console.log(res2.data);
            if (res2.data.code == 0) {
              id = res2.data.data;
            } else {
              id = utils_uuid.uuid();
            }
            await common_vendor.index.connectSocket({
              url: `wss://runningcampujxls.com/api/websocket/${id}`,
              // url: `ws://39.99.231.129:8121/api/websocket/${id}`,
              complete: () => {
              }
            });
            common_vendor.index.onSocketOpen((res3) => {
              console.log("websocket连接已打开");
              let obj = {
                "chat_id": id,
                // 聊天室ID 用户A和用户B
                "user_id": store.userId,
                // 用户ID: 当前登录用户
                "user_img": store.userInfo.userAvatar,
                // 用户图片: 从pinna拿
                "user_name": store.userInfo.userName,
                //用户名称: 从pinna拿
                "content": "你好,我已接单。",
                //聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
                "content_type": 0,
                //聊天类型，0是普通文本，1是图片
                "user_other": orderId
              };
              console.log(obj);
              setTimeout(() => {
                common_vendor.index.sendSocketMessage({
                  data: JSON.stringify(obj)
                });
              }, 1e3);
            });
            common_vendor.index.onSocketClose((res3) => {
              console.log("websocket 打开失败 请检查!");
            });
          });
        } else if (res.data.code = 40101) {
          common_vendor.index.redirectTo({
            url: "/subpages/takeaway/takeaway"
          });
        }
      });
    };
    const feedIndentList = common_vendor.ref([]);
    const getfeedList = async (current) => {
      if (jieliu) {
        await request_index.request({
          url: "feedOrderCenter/list/page",
          method: "POST",
          data: {
            "cart_id": 0,
            "current": current,
            "id": 0,
            "isDelete": 0,
            "pageSize": 10,
            "running_user_id": 0,
            "sortField": "",
            "sortOrder": "",
            "state": 0,
            "user_id": 0
          }
        }).then((res) => {
          console.log("订单", res.data);
          if (res.data.data.records.length == 0) {
            jieliu = false;
          } else {
            loadShow.value = true;
            setTimeout(() => {
              loadShow.value = false;
              feedIndentList.value.push(...res.data.data.records);
            }, 1e3);
          }
        });
      }
    };
    const orderRequest = async (id, orderId) => {
      await request_index.request({
        url: "submitOrder/update/togoQiang",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        },
        data: {
          "id": id,
          "isDelete": 0,
          "order_state": 1
        }
      }).then(async (res) => {
        if (res.data.code == 0) {
          msg_reOr.value = true;
          jieliu = true;
          otherIndentList.value = [];
          getOtherList(1);
          setTimeout(() => {
            msg_reOr.value = false;
          }, 500);
          let id2 = utils_uuid.uuid();
          await new Promise((resolve, reject) => {
            common_vendor.index.connectSocket({
              url: `wss://runningcampujxls.com/api/websocket/${id2}`,
              // url: `ws://39.99.231.129:8121/api/websocket/${id}`,
              complete: resolve,
              fail: reject
            });
          });
          common_vendor.index.onSocketOpen((res2) => {
            console.log("websocket连接已打开");
            let obj = {
              "chat_id": id2,
              // 聊天室ID 用户A和用户B
              "user_id": store.userId,
              // 用户ID: 当前登录用户
              "user_img": store.userInfo.userAvatar,
              // 用户图片: 从pinna拿
              "user_name": store.userInfo.userName,
              //用户名称: 从pinna拿
              "content": "你好,我已接单。",
              //聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
              "content_type": 0,
              //聊天类型，0是普通文本，1是图片
              "user_other": orderId
            };
            console.log(obj);
            common_vendor.index.sendSocketMessage({
              data: JSON.stringify(obj)
            });
          });
          common_vendor.index.onSocketClose((res2) => {
            console.log("websocket 打开失败 请检查!.", res2);
          });
        } else if (res.data.code = 40101) {
          common_vendor.index.redirectTo({
            url: "/subpages/takeaway/takeaway"
          });
        }
      });
    };
    const otherIndentList = common_vendor.ref([]);
    const getOtherList = async (current) => {
      if (jieliu) {
        request_index.request({
          url: "submitOrder/my/list/page/vo",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          },
          data: {
            "current": current,
            "id": "",
            "isDelete": 0,
            "order_state": 0,
            "pageSize": 10,
            "schoolId": 0,
            "sortField": "",
            "sortOrder": "",
            "submit_index": 0,
            "userId": 0
          }
        }).then((res) => {
          console.log("其他订单", res.data);
          if (res.data.data.records.length == 0) {
            jieliu = false;
          } else {
            loadShow.value = true;
            setTimeout(() => {
              loadShow.value = false;
              otherIndentList.value.push(...res.data.data.records);
            }, 1e3);
          }
        });
      }
    };
    const goDetail = (cartId, state) => {
      let obj = {
        cartId,
        state
      };
      common_vendor.index.navigateTo({
        url: `/subpages/pay/pay?orderDetail=${encodeURIComponent(JSON.stringify(obj))}`
      });
    };
    common_vendor.index.onSocketClose((res) => {
      console.log("当前连接已关闭");
    });
    common_vendor.onHide(() => {
      common_vendor.index.closeSocket();
    });
    const dateTime = (i) => {
      let date = new Date(i);
      let time = (parseInt(date.getMonth()) + 1).toString() + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分";
      return time;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(feedIndentList.value, (i, index2, i0) => {
          return {
            a: common_vendor.t(dateTime(i.createTime)),
            b: common_vendor.t(dateTime(i.delivery_time)),
            c: common_vendor.o(($event) => goDetail(i.cart_id, i.state + 1), index2),
            d: common_vendor.o(($event) => receiveOrder(i.cart_id, i.user_id), index2),
            e: "14bfbae0-3-" + i0 + "," + ("14bfbae0-2-" + i0),
            f: common_vendor.p({
              type: "primary",
              disabled: i.user_id == common_vendor.unref(store).userId
            }),
            g: "14bfbae0-2-" + i0 + ",14bfbae0-1",
            h: common_vendor.p({
              price: i.money,
              title: i.delivery_address,
              thumb: i.user_head_img,
              lazyLoad: true
            }),
            i: index2
          };
        }),
        b: common_vendor.p({
          color: "#1989fa",
          type: "spinner"
        }),
        c: loadShow.value,
        d: common_vendor.p({
          title: "外卖订单"
        }),
        e: common_vendor.f(otherIndentList.value, (i, index2, i0) => {
          return {
            a: common_vendor.t(JSON.parse(i.content).explain.replace(/null/g, "")),
            b: common_vendor.t(dateTime(JSON.parse(i.content).expectTime)),
            c: common_vendor.o(($event) => orderRequest(i.id, i.userId), index2),
            d: "14bfbae0-7-" + i0 + "," + ("14bfbae0-6-" + i0),
            e: common_vendor.p({
              type: "primary",
              disabled: i.userId == common_vendor.unref(store).userId
            }),
            f: "14bfbae0-6-" + i0 + ",14bfbae0-5",
            g: common_vendor.p({
              title: JSON.parse(i.content).className,
              price: JSON.parse(i.content).order_money,
              lazyLoad: true
            }),
            h: index2
          };
        }),
        f: common_vendor.p({
          color: "#1989fa",
          type: "spinner"
        }),
        g: loadShow.value,
        h: common_vendor.p({
          title: "其他订单"
        }),
        i: common_vendor.o(checkTab),
        j: common_vendor.p({
          animated: true,
          swipeable: true,
          sticky: true
        }),
        k: msg_reOr.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/pages/list/list.vue"]]);
wx.createPage(MiniProgramPage);
