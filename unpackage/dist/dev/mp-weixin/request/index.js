"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://www.runningcampujxls.com/api/";
const request = (obj) => {
  obj.url = obj.url || "";
  obj.method = obj.method || "GET";
  obj.data = obj.data || {};
  obj.header = obj.header || {
    "Content-Type": "application/json"
  };
  obj.loading = obj.loading === false ? false : true;
  obj.requestTime = obj.requestTime || 1e3;
  let loadingStatus = true;
  setTimeout(() => {
    if (loadingStatus && obj.loading) {
      common_vendor.index.showLoading({
        title: "加载中",
        mask: true
      });
    }
  }, obj.requestTime);
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + obj.url,
      method: obj.method,
      data: obj.data,
      withCredentials: true,
      header: {
        ...obj.header
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        if (loadingStatus && obj.loading) {
          common_vendor.index.hideLoading();
        }
        loadingStatus = false;
      }
    });
  });
};
exports.request = request;
