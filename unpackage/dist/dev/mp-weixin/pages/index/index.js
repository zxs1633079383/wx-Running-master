"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
require("../../request/index.js");
if (!Array) {
  const _component_van_notice_bar = common_vendor.resolveComponent("van-notice-bar");
  const _component_van_grid_item = common_vendor.resolveComponent("van-grid-item");
  const _component_van_grid = common_vendor.resolveComponent("van-grid");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_dropdown_item = common_vendor.resolveComponent("van-dropdown-item");
  const _component_van_dropdown_menu = common_vendor.resolveComponent("van-dropdown-menu");
  const _component_van_card = common_vendor.resolveComponent("van-card");
  const _component_van_loading = common_vendor.resolveComponent("van-loading");
  (_component_van_notice_bar + _component_van_grid_item + _component_van_grid + _component_van_button + _component_van_dropdown_item + _component_van_dropdown_menu + _component_van_card + _component_van_loading)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = stores_counter.Store();
    const businessList = common_vendor.ref([
      {
        business: "代取快递",
        type: "icon-rentou"
      },
      {
        business: "代拿外卖",
        type: "icon-tubiaozhizuomoban2-01"
      },
      {
        business: "代写笔记",
        type: "icon-biji"
      },
      {
        business: "超市代购",
        type: "icon-fuwuchaoshi"
      },
      {
        business: "校园跑腿",
        type: "icon-pao"
      },
      {
        business: "校园代跑",
        type: "icon-tiyu-qipao"
      },
      {
        business: "帮搬东西",
        type: "icon-iconfont_loadingbay"
      },
      {
        business: "代替上课",
        type: "icon-tongxueshangke-"
      },
      {
        business: "代替查寝",
        type: "icon-Dorm"
      },
      {
        business: "替试/补考",
        type: "icon-a-kaoshi1"
      }
    ]);
    const indicatorDots = common_vendor.ref(true);
    const autoplay = common_vendor.ref(true);
    const interval = 3e3;
    const duration = 500;
    const imageList = common_vendor.computed(() => store.LBList);
    const value = common_vendor.ref(0);
    const options = [
      { text: "默认排序", value: 0 },
      { text: "好评排序", value: 1 },
      { text: "销量排序", value: 2 }
    ];
    common_vendor.ref(null);
    const scrollStore = () => {
      common_vendor.wx$1.createSelectorQuery().select(`#anchor`).boundingClientRect((rect) => {
        console.log(rect);
        common_vendor.wx$1.pageScrollTo({ scrollTop: rect.top, duration: 300 });
      }).exec();
    };
    const StoreList = common_vendor.computed(() => store.schoolStoreList);
    const stateList = ["营业中", "打样", "暂停"];
    common_vendor.onMounted(async () => {
      await store.getLBData({
        url: "bannerImage/list/page",
        method: "POST",
        data: {
          "createTime": "",
          "current": 0,
          "id": 0,
          "imageName": "",
          "imageUrl": "",
          "isDelete": 0,
          "pageSize": 5,
          "schoolId": 1,
          "sortField": "",
          "sortOrder": "",
          "state": 0,
          "user_id": 0
        }
      });
      await store.getSchoolStoreData({
        "address": "",
        "category1Id": 0,
        "current": current,
        "delivery_price": 0,
        "delivery_time": 0,
        "id": 0,
        "isDelete": 0,
        "pageSize": 5,
        "score": 0,
        "sortField": "",
        "sortOrder": "",
        "start_price": 0,
        "state": 0,
        "storeName": ""
      });
      console.log(store.schoolStoreList);
    }), // 加载完毕
    common_vendor.onLoad(async () => {
      common_vendor.index.getProvider({
        service: "oauth",
        //oauth授权登录
        success: function(res) {
          if (res.provider.includes("weixin")) {
            common_vendor.index.login({
              provider: "weixin",
              //provider	Array	得到的服务供应商
              success: (res2) => {
                if (res2.code) {
                  common_vendor.index.request({
                    // url:'http://39.99.231.129:8121/api/user/login/wx_open',
                    url: "https://www.runningcampujxls.com/api/user/login/wx_open",
                    data: {
                      code: res2.code
                    },
                    method: "GET",
                    success: (res3) => {
                      const setCookieHeader = res3.header["Set-Cookie"];
                      common_vendor.index.setStorageSync("sessionCookie", setCookieHeader);
                      store.userInfo = res3.data.data;
                      store.userId = res3.data.data.id;
                    },
                    fail() {
                      console.log("登录请求发送失败");
                    }
                  });
                } else {
                  console.log("登录失败", res2.errMsg);
                }
              },
              fail() {
                console.log("授权失败");
              }
            });
          }
        }
      });
    });
    let loadShow = common_vendor.ref(false);
    let current = 1;
    common_vendor.onReachBottom(async () => {
      loadShow.value = true;
      await setTimeout(() => {
        loadShow.value = false;
        current++;
        store.getSchoolStoreData({
          "address": "",
          "category1Id": 0,
          "current": current,
          "delivery_price": 0,
          "delivery_time": 0,
          "id": 0,
          "isDelete": 0,
          "pageSize": 5,
          "score": 0,
          "sortField": "",
          "sortOrder": "",
          "start_price": 0,
          "state": 0,
          "storeName": ""
        });
      }, 1e3);
    });
    const goDetail = (i) => {
      let obj = {
        category1Id: i.category1Id,
        imageUrl: i.imageUrl,
        score: i.score,
        storeName: i.storeName,
        delivery_time: i.delivery_time,
        id: i.id,
        address: i.address
      };
      let params = encodeURIComponent(JSON.stringify(obj));
      common_vendor.index.navigateTo({
        url: `/subpages/detail/detail?params=${params}`,
        animationType: "pop-in",
        animationDuration: 200
      });
    };
    const goRecruit = () => {
      common_vendor.index.redirectTo({
        url: "/subpages/takeaway/takeaway"
      });
    };
    const goPublish = (index) => {
      index++;
      common_vendor.index.navigateTo({
        url: `/subpages/publish/publish?index=${index}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(imageList), (item, index, i0) => {
          return {
            a: item.imageUrl,
            b: item.id
          };
        }),
        b: indicatorDots.value,
        c: autoplay.value,
        d: interval,
        e: duration,
        f: common_vendor.p({
          leftIcon: "volume-o",
          text: "在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
        }),
        g: common_vendor.o(scrollStore),
        h: common_vendor.p({
          useSlot: true,
          text: "校园外卖"
        }),
        i: common_vendor.f(businessList.value, (i, index, i0) => {
          return {
            a: common_vendor.n(`${i.type}`),
            b: common_vendor.t(i.business),
            c: common_vendor.o(($event) => goPublish(index), index),
            d: index,
            e: "1cf27b2a-3-" + i0 + ",1cf27b2a-1",
            f: common_vendor.p({
              useSlot: true,
              text: i.business
            })
          };
        }),
        j: common_vendor.p({
          useSlot: true,
          text: "代扫卫生"
        }),
        k: common_vendor.p({
          square: true,
          iconSize: "20px"
        }),
        l: common_vendor.p({
          round: true,
          size: "normal",
          type: "primary"
        }),
        m: common_vendor.o(goRecruit),
        n: common_vendor.p({
          round: true,
          type: "primary"
        }),
        o: common_vendor.p({
          value: value.value,
          options
        }),
        p: common_vendor.f(common_vendor.unref(StoreList), (i, index, i0) => {
          return {
            a: common_vendor.t(stateList[i.state]),
            b: common_vendor.t(i.score),
            c: common_vendor.t(i.start_price),
            d: common_vendor.t(i.delivery_price),
            e: common_vendor.t(i.delivery_time),
            f: "1cf27b2a-9-" + i0,
            g: common_vendor.p({
              desc: i.address,
              title: i.storeName,
              thumb: i.imageUrl
            }),
            h: index,
            i: common_vendor.o(($event) => goDetail(i), index)
          };
        }),
        q: common_vendor.p({
          color: "#1989fa",
          type: "spinner"
        }),
        r: common_vendor.unref(loadShow)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
