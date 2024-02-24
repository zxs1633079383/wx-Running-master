"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
const request_index = require("../../request/index.js");
const utils_uuid = require("../../utils/uuid.js");
if (!Array) {
  const _component_van_nav_bar = common_vendor.resolveComponent("van-nav-bar");
  const _component_van_field = common_vendor.resolveComponent("van-field");
  const _component_van_card = common_vendor.resolveComponent("van-card");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  (_component_van_nav_bar + _component_van_field + _component_van_card + _component_van_button)();
}
const _sfc_main = {
  __name: "pay",
  setup(__props) {
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    const store = stores_counter.Store();
    const obj = common_vendor.ref({});
    const payFieldBtnShow = common_vendor.ref(true);
    common_vendor.onLoad(async (option) => {
      if ("goodsStore" in option) {
        obj.value = JSON.parse(decodeURIComponent(option.goodsStore));
        console.log(obj.value);
      }
      if ("orderDetail" in option) {
        obj.value = JSON.parse(decodeURIComponent(option.orderDetail));
        console.log(obj.value);
        payFieldBtnShow.value = false;
      }
      console.log(payFieldBtnShow.value);
      giveCartGoods();
    });
    const cartList = common_vendor.ref([]);
    const giveCartGoods = async () => {
      await request_index.request({
        url: "userCart/my/list/page/vo",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        },
        data: {
          "cartId": obj.value.cartId,
          "current": 1,
          "id": 0,
          "isDelete": 0,
          "num": 0,
          "pageSize": 10,
          "schoolId": obj.value.schoolId,
          "schoolStoreFeedId": 0,
          "sortField": "",
          "sortOrder": "",
          "state": obj.value.state || 0,
          "sum_money": 0,
          "userId": 0
        }
      }).then((value) => {
        cartList.value = value.data.data || null;
        console.log("购物车列表", cartList.value);
      });
    };
    const sum_money = common_vendor.computed(() => {
      let sum = 0;
      for (let i of cartList.value) {
        sum += i.num * i.feeds.new_money;
      }
      return sum + 2;
    });
    const changeNum = async (num1, i) => {
      console.log(i);
      await cartList.value.forEach((item) => {
        if (item.schoolStoreFeedId === i.schoolStoreFeedId && item.num + num1 > 0) {
          item.num += num1;
          request_index.request({
            url: "userCart/update/by/Cart/Id",
            method: "POST",
            data: {
              "cartId": obj.value.cartId,
              "num": item.num,
              "schoolId": obj.value.schoolId,
              "schoolStoreFeedId": parseInt(item.schoolStoreFeedId),
              "sum_money": item.num * i.feeds.new_money,
              "userId": 0
            },
            header: {
              "content-type": "application/json",
              "Cookie": storedCookie
            }
          }).then((value) => {
            console.log("修改购物车商品消息", value.data);
            giveCartGoods();
          });
        }
      });
    };
    const address_value = common_vendor.ref("");
    const address = (e) => {
      address_value.value = e.detail.value.trim();
      if (address_value.value.length == 0) {
        msg_address.value = true;
        setTimeout(() => {
          msg_address.value = false;
        }, 500);
      }
    };
    const msg_address = common_vendor.ref(false);
    const notes_value = common_vendor.ref("");
    const notes = (e) => {
      notes_value.value = e.detail.trim();
    };
    const changeCartIdState = async () => {
      if (address_value.value.length > 0) {
        const totalPrice = sum_money.value * 100;
        console.log("总价格: ", totalPrice * 100);
        console.log("购物车ID:", obj.value.cartId);
        await request_index.request({
          url: "userCart/update/state/by/CartIdAndUserIdToMQ",
          method: "POST",
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          },
          data: {
            "cartId": obj.value.cartId,
            "state": 1,
            "address": address_value.value,
            "content": notes_value.value,
            "openid": store.userInfo.mpOpenId,
            "price": totalPrice,
            "goodsid": utils_uuid.uuid(),
            "title": "微信测试页面环境"
          }
        }).then((res2) => {
          console.log("订单状态", res2);
          try {
            common_vendor.index.requestPayment({
              timeStamp: res2.data.timeStamp,
              nonceStr: res2.data.nonceStr,
              package: res2.data.packageVal,
              signType: res2.data.signType,
              paySign: res2.data.paySign,
              appId: res2.data.appid,
              success(res3) {
                console.log("拉起payment success", res3);
                common_vendor.index.switchTab({
                  url: "/pages/list/list"
                });
              },
              fail(res3) {
                console.log("拉起payment fail", res3);
              },
              complete(res3) {
                console.log("拉起payment complete", res3);
              }
            });
          } catch (error2) {
            console.error("支付请求失败", error2);
          }
        });
      } else {
        msg_address.value = true;
        await setTimeout(() => {
          msg_address.value = false;
        }, 500);
      }
    };
    const goback = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goback),
        b: common_vendor.p({
          leftText: "返回",
          leftArrow: true,
          safeAreaInsetTop: false
        }),
        c: common_vendor.o(address),
        d: common_vendor.p({
          value: cartList.value[0].address,
          placeholder: "请输入校内送货地址",
          required: true,
          readonly: !payFieldBtnShow.value,
          autoFocus: true
        }),
        e: common_vendor.t(obj.value.storeName),
        f: common_vendor.t(obj.value.cartId),
        g: common_vendor.f(cartList.value, (i, index, i0) => {
          return common_vendor.e(payFieldBtnShow.value ? {
            a: common_vendor.o(($event) => changeNum(-1, i), index),
            b: common_vendor.t(i.num),
            c: common_vendor.o(($event) => changeNum(1, i), index)
          } : {
            d: common_vendor.t(i.num)
          }, {
            e: index,
            f: "769789ea-2-" + i0,
            g: common_vendor.p({
              price: i.sum_money,
              title: i.feeds.feed_name,
              thumb: i.feeds.url
            })
          });
        }),
        h: payFieldBtnShow.value,
        i: common_vendor.o(notes),
        j: common_vendor.p({
          label: "备注:",
          type: "textarea",
          value: cartList.value[0].content,
          placeholder: "请输入50字以内备注",
          autosize: true,
          readonly: !payFieldBtnShow.value,
          maxlength: 50
        }),
        k: common_vendor.p({
          label: "跑腿酬金:",
          type: "text",
          value: "2元",
          readonly: true
        }),
        l: payFieldBtnShow.value
      }, payFieldBtnShow.value ? {
        m: common_vendor.t(common_vendor.unref(sum_money)),
        n: common_vendor.o(changeCartIdState),
        o: common_vendor.p({
          round: true,
          type: "info",
          color: "linear-gradient(to right, #ff5500, #ff0000)"
        })
      } : {}, {
        p: msg_address.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/subpages/pay/pay.vue"]]);
wx.createPage(MiniProgramPage);
