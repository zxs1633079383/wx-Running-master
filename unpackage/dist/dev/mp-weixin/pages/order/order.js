"use strict";
const common_vendor = require("../../common/vendor.js");
const request_index = require("../../request/index.js");
const stores_counter = require("../../stores/counter.js");
if (!Array) {
  const _component_van_sidebar_item = common_vendor.resolveComponent("van-sidebar-item");
  const _component_van_sidebar = common_vendor.resolveComponent("van-sidebar");
  const _component_van_card = common_vendor.resolveComponent("van-card");
  const _component_van_empty = common_vendor.resolveComponent("van-empty");
  const _component_van_tab = common_vendor.resolveComponent("van-tab");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_tabs = common_vendor.resolveComponent("van-tabs");
  const _component_van_overlay = common_vendor.resolveComponent("van-overlay");
  const _component_van_loading = common_vendor.resolveComponent("van-loading");
  (_component_van_sidebar_item + _component_van_sidebar + _component_van_card + _component_van_empty + _component_van_tab + _component_van_button + _component_van_tabs + _component_van_overlay + _component_van_loading)();
}
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const store = stores_counter.Store();
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    let state = ["创建接单", "暂无接单", "派送中", "已完成"];
    let otherState = ["暂无接单", "派送中", "已完成"];
    const finishOrder = common_vendor.ref(false);
    const hideT = () => {
      finishOrder.value = false;
    };
    let cart_id = null;
    let Id = null;
    let submitId = null;
    const propValue1 = (cartId) => {
      finishOrder.value = true;
      cart_id = cartId;
    };
    const propValue2 = (id, submit_id) => {
      finishOrder.value = true;
      Id = id;
      submitId = submit_id;
    };
    const changeState = () => {
      if (cart_id) {
        changeOrderState(cart_id);
        cart_id = null;
      } else {
        updateOtherState(Id, submitId);
        Id = null;
        submitId = null;
      }
    };
    const changeOrderState = async (cartId) => {
      finishOrder.value = false;
      await request_index.request({
        // url:'userCart/update/state/by/CartIdAndUserId',
        url: "/userCart/update/state/by/CartIdAndUserIdOfOrderSuccess",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        },
        data: {
          "cartId": cartId,
          "state": 3
        }
      }).then((value) => {
        console.log(value);
        if (value.data.code === 0) {
          serverFoodList.value = [];
          FWWMCurrent = 1;
          jieliu3 = true;
          FWWM();
        }
      });
    };
    const updateOtherState = async (id, submit_id) => {
      console.log(id, submit_id);
      finishOrder.value = false;
      await request_index.request({
        url: "holdOrder/update/success",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        },
        data: {
          "id": id,
          "submit_id": submit_id
        }
      }).then((value) => {
        if (value.data.code === 0) {
          serverOtherList.value = [];
          FWQTCurrent = 1;
          jieliu4 = true;
          FWQT();
        }
      });
    };
    common_vendor.onLoad(() => {
      FBWM();
    });
    let tab_index = 0;
    const checkTab = (e) => {
      tab_index = e.detail.index;
      if (tab_index == 0) {
        publishActiveKey.value = 0;
        foodsPublishList.value = [];
        otherPublishList.value = [];
        FBWMCurrent = 1;
        FBQTCurrent = 1;
        jieliu1 = true;
        jieliu2 = true;
        FBWM();
      } else if (tab_index == 1) {
        serverActiveKey.value = 0;
        serverFoodList.value = [];
        serverOtherList.value = [];
        FWWMCurrent = 1;
        FWQTCurrent = 1;
        jieliu3 = true;
        jieliu4 = true;
        FWWM();
      }
    };
    const loadShow = common_vendor.ref(false);
    common_vendor.onPullDownRefresh(() => {
      jieliu1 = true;
      jieliu2 = true;
      jieliu3 = true;
      jieliu4 = true;
      foodsPublishList.value = [];
      FBWMCurrent = 1;
      FBWM();
    });
    let FBWMCurrent = 1;
    let FBQTCurrent = 1;
    let FWWMCurrent = 1;
    let FWQTCurrent = 1;
    common_vendor.onReachBottom(async () => {
      loadShow.value = true;
      await setTimeout(() => {
        loadShow.value = false;
        if (tab_index == 0 && publishActiveKey.value == 0) {
          console.log("发布外卖订单");
          FBWMCurrent++;
          FBWM();
        } else if (tab_index == 0 && publishActiveKey.value == 1) {
          console.log("发布其他订单");
          FBQTCurrent++;
          FBQT();
        } else if (tab_index == 1 && serverActiveKey.value == 0) {
          console.log("服务外卖订单");
          FWWMCurrent++;
          FWWM();
        } else if (tab_index == 1 && serverActiveKey.value == 1) {
          console.log("服务其他订单");
          FWQTCurrent++;
          FWQT();
        }
      }, 800);
    });
    const nullServerFood = common_vendor.ref(false);
    let jieliu1 = true;
    const publishSideNav = common_vendor.ref(true);
    const publishActiveKey = common_vendor.ref(0);
    const foodsPublishList = common_vendor.ref([]);
    const FBWM = async () => {
      if (!publishSideNav.value && publishActiveKey.value == 1) {
        foodsPublishList.value = [];
        jieliu1 = true;
        FBWMCurrent = 1;
      }
      publishSideNav.value = true;
      publishActiveKey.value = 0;
      if (jieliu1) {
        await request_index.request({
          url: "userCart/my/list/page/vo",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          },
          data: {
            "cartId": 0,
            "current": FBWMCurrent,
            "id": 0,
            "isDelete": 0,
            "num": 0,
            "pageSize": 10,
            "schoolId": 1,
            "schoolStoreFeedId": 0,
            "sortField": "createTime",
            "sortOrder": "ascend",
            "state": 4,
            "sum_money": 0,
            "user_id": store.userId
          }
        }).then((res) => {
          if (res.data.data.length == 0) {
            jieliu1 = false;
            console.log(res.data);
          } else {
            console.log("发布外卖订单:", res.data.data);
            foodsPublishList.value.push(...res.data.data);
            nullServerFood.value = false;
          }
          if (foodsPublishList.value.length == 0)
            nullServerFood.value = true;
        });
      }
    };
    let jieliu2 = true;
    const otherPublishList = common_vendor.ref([]);
    const FBQT = async () => {
      if (publishSideNav.value && publishActiveKey.value == 0) {
        otherPublishList.value = [];
        jieliu2 = true;
        FBQTCurrent = 1;
      }
      publishSideNav.value = false;
      publishActiveKey.value = 1;
      if (jieliu2) {
        await request_index.request({
          url: "submitOrder/my/list/page/vo",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          },
          data: {
            "current": FBQTCurrent,
            "id": "",
            "isDelete": 0,
            "order_state": 4,
            "pageSize": 10,
            "schoolId": 0,
            "sortField": "",
            "sortOrder": "",
            "submit_index": 0,
            "userId": store.userId
          }
        }).then((res) => {
          if (res.data.data.records.length == 0) {
            jieliu2 = false;
            console.log(res.data);
          } else {
            otherPublishList.value.push(...res.data.data.records);
            console.log("发布其他订单", res.data.data.records);
            nullServerFood.value = false;
          }
          if (otherPublishList.value.length == 0)
            nullServerFood.value = true;
        });
      }
    };
    let jieliu3 = true;
    const serverSideNav = common_vendor.ref(true);
    const serverActiveKey = common_vendor.ref(0);
    const serverFoodList = common_vendor.ref([]);
    const FWWM = async () => {
      if (!serverSideNav.value && serverActiveKey.value == 1) {
        serverFoodList.value = [];
        jieliu3 = true;
        FWWMCurrent = 1;
      }
      serverSideNav.value = true;
      serverActiveKey.value = 0;
      if (jieliu3) {
        await request_index.request({
          url: "feedOrderCenter/my/holdOrder/list",
          method: "POST",
          data: {
            "current": FWWMCurrent,
            "pageSize": 10,
            "id": 0,
            "mpOpenId": "",
            "sortField": "",
            "sortOrder": "",
            "unionId": "",
            "userMoney": 0,
            "userName": "",
            "userProfile": "",
            "userRole": ""
          },
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          }
        }).then((res) => {
          console.log(res);
          if (res.data.data == null) {
            jieliu3 = false;
            console.log(res.data);
          } else {
            serverFoodList.value.push(...res.data.data);
            nullServerFood.value = false;
          }
          if (serverFoodList.value.length == 0) {
            nullServerFood.value = true;
          }
          console.log("服务外卖订单", serverFoodList.value);
        });
      }
    };
    let jieliu4 = true;
    const serverOtherList = common_vendor.ref([]);
    const FWQT = async () => {
      if (serverSideNav.value && serverActiveKey.value == 0) {
        serverOtherList.value = [];
        jieliu4 = true;
        FWQTCurrent = 1;
      }
      serverSideNav.value = false;
      serverActiveKey.value = 1;
      if (jieliu4) {
        await request_index.request({
          url: "holdOrder/my/hold/list",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          },
          data: {
            "current": FWQTCurrent,
            "pageSize": 10
          }
        }).then((res) => {
          if (res.data.data == null) {
            jieliu4 = false;
            console.log(res.data);
          } else {
            nullServerFood.value = false;
            serverOtherList.value.push(...res.data.data);
            console.log("服务其他订单", serverOtherList.value);
          }
          if (serverOtherList.value.length == 0) {
            nullServerFood.value = true;
          }
        });
      }
    };
    const goPayDetail = (cartId, state2) => {
      console.log(state2, cartId);
      let obj = null;
      if (state2 == 2) {
        obj = {
          cartId,
          state: state2
        };
      }
      common_vendor.index.navigateTo({
        url: `/subpages/pay/pay?orderDetail=${encodeURIComponent(JSON.stringify(obj))}`
      });
    };
    const goOtherDetail = (content, state2) => {
      if (state2 < 2) {
        common_vendor.index.navigateTo({
          url: `/subpages/publish/publish?content=${content}`
        });
      }
    };
    const dateTime = (i) => {
      let date = new Date(i);
      let time = (parseInt(date.getMonth()) + 1).toString() + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分";
      return time;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(FBWM),
        b: common_vendor.p({
          title: "外卖订单",
          dot: true
        }),
        c: common_vendor.o(FBQT),
        d: common_vendor.p({
          title: "其他订单",
          dot: true
        }),
        e: common_vendor.p({
          activeKey: publishActiveKey.value
        }),
        f: common_vendor.f(foodsPublishList.value, (i, index, i0) => {
          return {
            a: common_vendor.t(dateTime(i.createTime)),
            b: common_vendor.t(dateTime(i.deliveryTime)),
            c: "5837877e-5-" + i0 + ",5837877e-1",
            d: common_vendor.p({
              price: i.sum_money,
              title: i.feeds.feed_name,
              thumb: i.feeds.url,
              tag: common_vendor.unref(state)[i.state],
              lazyLoad: true
            }),
            e: index
          };
        }),
        g: nullServerFood.value,
        h: common_vendor.p({
          description: "暂无订单"
        }),
        i: publishSideNav.value,
        j: common_vendor.f(otherPublishList.value, (i, index, i0) => {
          return {
            a: common_vendor.t(JSON.parse(i.content).explain.replace(/null/g, "")),
            b: common_vendor.t(dateTime(JSON.parse(i.content).expectTime)),
            c: "5837877e-7-" + i0 + ",5837877e-1",
            d: common_vendor.p({
              title: JSON.parse(i.content).className,
              price: JSON.parse(i.content).order_money
            }),
            e: common_vendor.t(common_vendor.unref(otherState)[i.order_state]),
            f: common_vendor.o(($event) => goOtherDetail(i.content, i.order_state), index),
            g: index
          };
        }),
        k: nullServerFood.value,
        l: common_vendor.p({
          description: "暂无订单"
        }),
        m: !publishSideNav.value,
        n: common_vendor.p({
          title: "发布订单"
        }),
        o: common_vendor.o(FWWM),
        p: common_vendor.p({
          title: "外卖订单",
          dot: true
        }),
        q: common_vendor.o(FWQT),
        r: common_vendor.p({
          title: "其他订单",
          dot: true
        }),
        s: common_vendor.p({
          activeKey: serverActiveKey.value
        }),
        t: common_vendor.f(serverFoodList.value, (i, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(dateTime(i.createTime)),
            b: common_vendor.t(dateTime(i.deliveryTime)),
            c: "5837877e-13-" + i0 + ",5837877e-9",
            d: common_vendor.p({
              title: i.storeName,
              thumb: i.schoolStoreFeeds.url,
              tag: common_vendor.unref(state)[i.state],
              lazyLoad: true
            }),
            e: common_vendor.o(($event) => goPayDetail(i.cartId, i.state), index),
            f: i.state == 3
          }, i.state == 3 ? {} : {
            g: common_vendor.o(($event) => propValue1(i.cartId), index),
            h: "5837877e-14-" + i0 + ",5837877e-9",
            i: common_vendor.p({
              type: "primary",
              size: "small"
            })
          }, {
            j: index
          });
        }),
        v: nullServerFood.value,
        w: common_vendor.p({
          description: "暂无订单"
        }),
        x: serverSideNav.value,
        y: common_vendor.f(serverOtherList.value, (i, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(JSON.parse(i.submitOrder.content).explain.replace(/null/g, "")),
            b: common_vendor.t(dateTime(JSON.parse(i.submitOrder.content).expectTime)),
            c: "5837877e-16-" + i0 + ",5837877e-9",
            d: common_vendor.p({
              title: JSON.parse(i.submitOrder.content).className,
              price: JSON.parse(i.submitOrder.content).order_money
            }),
            e: common_vendor.o(($event) => goOtherDetail(i.submitOrder.content, i.submitOrder.order_state), index),
            f: i.submitOrder.order_state == 2
          }, i.submitOrder.order_state == 2 ? {} : {
            g: common_vendor.o(($event) => propValue2(i.id, i.submit_id), index),
            h: "5837877e-17-" + i0 + ",5837877e-9",
            i: common_vendor.p({
              type: "primary",
              size: "small"
            })
          }, {
            j: index
          });
        }),
        z: nullServerFood.value,
        A: common_vendor.p({
          description: "暂无订单"
        }),
        B: !serverSideNav.value,
        C: common_vendor.p({
          title: "服务订单"
        }),
        D: common_vendor.o(checkTab),
        E: common_vendor.p({
          animated: true,
          swipeable: true,
          sticky: true
        }),
        F: common_vendor.o(changeState),
        G: common_vendor.p({
          type: "primary",
          size: "large",
          round: true,
          color: "linear-gradient(to right, #ff2950, #f64a06)"
        }),
        H: common_vendor.o(hideT),
        I: common_vendor.p({
          show: finishOrder.value
        }),
        J: common_vendor.p({
          color: "#1989fa",
          type: "spinner"
        }),
        K: loadShow.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/pages/order/order.vue"]]);
wx.createPage(MiniProgramPage);
