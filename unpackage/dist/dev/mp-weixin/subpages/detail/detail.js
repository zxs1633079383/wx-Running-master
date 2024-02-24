"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
const request_index = require("../../request/index.js");
const utils_uuid = require("../../utils/uuid.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_nav_bar = common_vendor.resolveComponent("van-nav-bar");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_sidebar_item = common_vendor.resolveComponent("van-sidebar-item");
  const _component_van_sidebar = common_vendor.resolveComponent("van-sidebar");
  const _component_van_card = common_vendor.resolveComponent("van-card");
  const _component_van_empty = common_vendor.resolveComponent("van-empty");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  (_component_van_icon + _component_van_nav_bar + _component_van_button + _component_van_sidebar_item + _component_van_sidebar + _component_van_card + _component_van_empty + _component_van_popup)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const store = stores_counter.Store();
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    const cartId = common_vendor.ref(null);
    const storeData = common_vendor.ref({});
    common_vendor.onLoad(async (options) => {
      if ("params" in options) {
        storeData.value = JSON.parse(decodeURIComponent(options.params));
      }
      console.log(storeData.value);
      if (common_vendor.index.getStorageSync(storeData.value.id)) {
        giveCartGoods();
      } else {
        cartId.value = utils_uuid.uuid();
        common_vendor.index.setStorageSync(storeData.value.id, cartId.value);
        giveCartGoods();
      }
      await store.getClassTitle({
        "category1Id": parseInt(storeData.value.category1Id),
        "category2Id": parseInt(storeData.value.id),
        "category3Name": "",
        "category3id": 0,
        "current": 0,
        "feed_name": "",
        "feed_state": 0,
        "id": 0,
        "isDelete": 0,
        "pageSize": 0,
        "sortField": "",
        "sortOrder": "",
        "state": 0
      });
      await setTimeout(() => {
        store.getStoreDetail({
          "category1Id": parseInt(storeData.value.category1Id),
          "category2Id": parseInt(storeData.value.id),
          "category3Name": "",
          "category3id": store.classData[0].category3id,
          "current": 1,
          "feed_name": "",
          "feed_state": 0,
          "id": 0,
          "isDelete": 0,
          "pageSize": 5,
          "sortField": "",
          "sortOrder": "",
          "state": 0
        });
      }, 1500);
    });
    const onClickLeft = async () => {
      let setArr = [];
      for (let s of set) {
        setArr.push(s);
        console.log("缓存id为： " + s + "  商铺为： " + storeData.value.storeName);
      }
      common_vendor.index.setStorageSync(storeData.value.storeName, setArr);
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    const storeDetail = common_vendor.computed(() => store.storeDetailData);
    console.log(storeDetail.value);
    const goodsClassification = common_vendor.computed(() => store.classData);
    console.log(goodsClassification.value);
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
          "cartId": common_vendor.index.getStorageSync(storeData.value.id),
          "current": 1,
          "id": 0,
          "isDelete": 0,
          "num": 0,
          "pageSize": 10,
          "schoolId": parseInt(storeData.value.category1Id),
          "schoolStoreFeedId": 0,
          "sortField": "",
          "sortOrder": "",
          "state": 0,
          "sum_money": 0,
          "userId": 0
        }
      }).then((value) => {
        cartList.value = value.data.data || null;
      });
    };
    const addNoticeBtn = common_vendor.ref(false);
    const set = /* @__PURE__ */ new Set();
    const addCart = async (i) => {
      if (common_vendor.index.getStorageSync(storeData.value.storeName)) {
        console.log("缓存存在 当前商铺");
        common_vendor.index.getStorageSync(storeData.value.storeName).forEach((i2) => {
          set.add(i2);
        });
      }
      console.log(i);
      addNoticeBtn.value = true;
      if (set.has(i.id)) {
        changeNum(1, { schoolStoreFeedId: i.id, feeds: { new_money: i.new_money } });
      } else {
        set.add(i.id);
        await request_index.request({
          url: "userCart/add",
          method: "POST",
          data: {
            "cartId": common_vendor.index.getStorageSync(storeData.value.id),
            "num": 1,
            "schoolId": parseInt(i.category1Id),
            "schoolStoreFeedId": parseInt(i.id),
            "sum_money": i.new_money
          },
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          }
        }).then((value) => {
          console.log("添加到购物车消息", value);
          giveCartGoods();
        });
      }
      await setTimeout(() => addNoticeBtn.value = false, 1e3);
    };
    const changeNum = async (num1, i) => {
      console.log(num1, i);
      await cartList.value.forEach((item) => {
        if (item.schoolStoreFeedId === i.schoolStoreFeedId && item.num + num1 > 0) {
          item.num += num1;
          request_index.request({
            url: "userCart/update/by/Cart/Id",
            method: "POST",
            data: {
              "cartId": common_vendor.index.getStorageSync(storeData.value.id),
              "num": item.num,
              "schoolId": parseInt(storeData.value.category1Id),
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
    const show = common_vendor.ref(false);
    const showPopup = () => {
      show.value = true;
    };
    const onClose = () => {
      show.value = false;
    };
    const delCartGood = async (id) => {
      await store.clearGood({
        "cartId": common_vendor.index.getStorageSync(storeData.value.id),
        "feedId": id
      });
      giveCartGoods();
    };
    const goPay = (length) => {
      if (length > 0) {
        let obj = {
          cartId: common_vendor.index.getStorageSync(storeData.value.id),
          schoolId: parseInt(storeData.value.category1Id),
          storeName: storeData.value.storeName
        };
        common_vendor.index.navigateTo({
          url: `/subpages/pay/pay?goodsStore=${encodeURIComponent(JSON.stringify(obj))}`
        });
      }
    };
    const class_good_id = async (id) => {
      await store.getStoreDetail({
        "category1Id": storeData.value.category1Id,
        "category2Id": parseInt(storeData.value.id),
        "category3Name": "",
        "category3id": id,
        "current": 1,
        "feed_name": "",
        "feed_state": 0,
        "id": 0,
        "isDelete": 0,
        "pageSize": 5,
        "sortField": "",
        "sortOrder": "",
        "state": 0
      });
    };
    const goodsSellState = ["热销中", "促销中", "已售空"];
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: storeData.value.imageUrl,
        b: common_vendor.p({
          name: "search"
        }),
        c: common_vendor.p({
          name: "phone-o"
        }),
        d: common_vendor.p({
          name: "share-o"
        }),
        e: common_vendor.o(onClickLeft),
        f: common_vendor.p({
          leftArrow: true,
          safeAreaInsetTop: false
        }),
        g: storeData.value.imageUrl,
        h: common_vendor.t(storeData.value.storeName),
        i: common_vendor.p({
          icon: "plus",
          type: "default",
          size: "mini"
        }),
        j: common_vendor.t(storeData.value.score),
        k: common_vendor.t(storeData.value.delivery_time),
        l: common_vendor.t(storeData.value.address),
        m: common_vendor.f(common_vendor.unref(goodsClassification), (i, index, i0) => {
          return {
            a: common_vendor.o(($event) => class_good_id(i.category3id), index),
            b: index,
            c: "5fad50b1-6-" + i0 + ",5fad50b1-5",
            d: common_vendor.p({
              title: i.category3Name
            })
          };
        }),
        n: common_vendor.f(common_vendor.unref(storeDetail), (i, k0, i0) => {
          return common_vendor.e({
            a: i.state === 0
          }, i.state === 0 ? {
            b: common_vendor.o(($event) => addCart(i), i.id),
            c: "5fad50b1-7-" + i0,
            d: common_vendor.p({
              tag: goodsSellState[i.feed_state],
              price: i.new_money,
              originPrice: i.old_money,
              desc: "已售出" + i.count + "份",
              title: i.feed_name,
              thumb: i.url
            })
          } : {}, {
            e: i.id
          });
        }),
        o: cartList.value.length != 0 ? 1 : "",
        p: cartList.value == null || cartList.value.length === 0
      }, cartList.value == null || cartList.value.length === 0 ? {} : {
        q: common_vendor.t(cartList.value.length)
      }, {
        r: common_vendor.o(showPopup),
        s: cartList.value != null ? 1 : "",
        t: common_vendor.o(($event) => goPay(cartList.value != null ? cartList.value.length : 0)),
        v: common_vendor.o(onClose),
        w: common_vendor.p({
          size: "50rpx",
          name: "cross"
        }),
        x: cartList.value == null || cartList.value.length == 0
      }, cartList.value == null || cartList.value.length == 0 ? {
        y: common_vendor.p({
          image: "https://img.yzcdn.cn/vant/custom-empty-image.png",
          description: "请选择商品"
        })
      } : {
        z: common_vendor.f(cartList.value, (i, index, i0) => {
          return {
            a: common_vendor.o(($event) => changeNum(-1, i), index),
            b: "5fad50b1-12-" + i0 + "," + ("5fad50b1-11-" + i0),
            c: common_vendor.t(i.num),
            d: common_vendor.o(($event) => changeNum(1, i), index),
            e: "5fad50b1-13-" + i0 + "," + ("5fad50b1-11-" + i0),
            f: common_vendor.o(($event) => delCartGood(i.schoolStoreFeedId), index),
            g: "5fad50b1-14-" + i0 + "," + ("5fad50b1-11-" + i0),
            h: index,
            i: "5fad50b1-11-" + i0 + ",5fad50b1-8",
            j: common_vendor.p({
              price: i.sum_money,
              title: i.feeds.feed_name,
              thumb: i.feeds.url
            })
          };
        }),
        A: common_vendor.p({
          size: "mini"
        }),
        B: common_vendor.p({
          size: "mini"
        }),
        C: common_vendor.p({
          size: "mini"
        })
      }, {
        D: common_vendor.p({
          show: show.value,
          position: "bottom",
          customStyle: "height: 60%;",
          round: true,
          overlay: show.value
        }),
        E: addNoticeBtn.value
      }, addNoticeBtn.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5fad50b1"], ["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/subpages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
