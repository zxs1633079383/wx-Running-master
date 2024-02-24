"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_counter = require("../../stores/counter.js");
const request_index = require("../../request/index.js");
if (!Array) {
  const _component_van_field = common_vendor.resolveComponent("van-field");
  const _component_van_cell_group = common_vendor.resolveComponent("van-cell-group");
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_uploader = common_vendor.resolveComponent("van-uploader");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_overlay = common_vendor.resolveComponent("van-overlay");
  (_component_van_field + _component_van_cell_group + _component_van_icon + _component_van_uploader + _component_van_button + _component_van_overlay)();
}
const _sfc_main = {
  __name: "updateme",
  setup(__props) {
    stores_counter.Store();
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    const fileList = common_vendor.ref([]);
    const msg_text = common_vendor.ref("");
    let from = {
      name: null,
      image: null
    };
    let a = common_vendor.ref(true);
    const getUserName = (e) => {
      if (e.detail.value.trim().length != 0) {
        from.name = e.detail.value;
        a.value = true;
      } else {
        a.value = false;
      }
    };
    const showWarning = common_vendor.ref(false);
    const msg = common_vendor.ref("");
    const update = async () => {
      console.log("更新请求");
      console.log(from.name);
      console.log(msg_text.value);
      await request_index.request({
        url: "/user/update/meNameAndAvatr",
        method: "POST",
        header: {
          "content-type": "application/json",
          "Cookie": storedCookie
        },
        data: {
          "userName": from.name,
          "content": msg_text.value
        }
      }).then((res) => {
        if (res.data.code == 0) {
          msg.value = "更新成功！";
          showWarning.value = true;
          setTimeout(() => {
            showWarning.value = false;
            common_vendor.index.switchTab({
              url: "/pages/me/me"
            });
          }, 1200);
        } else {
          msg.value = "更新失败,请检查输入信息是否正确！";
          showWarning.value = true;
          setTimeout(() => {
            showWarning.value = false;
          }, 800);
        }
      });
    };
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
        },
        fail(err) {
          console.log("读取失败");
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(getUserName),
        b: common_vendor.p({
          placeholder: "请输入名称",
          label: "名称:",
          required: true,
          maxlength: 6
        }),
        c: common_vendor.p({
          size: "60rpx",
          name: "photo-o"
        }),
        d: common_vendor.o(uploadImage),
        e: common_vendor.p({
          maxSize: 8388608,
          value: fileList.value,
          multiple: true,
          accept: "image/*"
        }),
        f: common_vendor.o(update),
        g: common_vendor.p({
          type: "primary",
          round: true,
          size: "large"
        }),
        h: common_vendor.t(msg.value),
        i: common_vendor.p({
          show: showWarning.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/subpages/updateme/updateme.vue"]]);
wx.createPage(MiniProgramPage);
