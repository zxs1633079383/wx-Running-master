"use strict";
const common_vendor = require("../common/vendor.js");
const request_index = require("../request/index.js");
const Store = common_vendor.defineStore("counter", () => {
  const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
  const userInfo = common_vendor.ref({});
  const userId = null;
  const LBList = common_vendor.ref([]);
  const getLBData = (obj) => {
    request_index.request({
      ...obj
    }).then((value) => LBList.value = value.data.data.records);
  };
  const schoolStoreList = common_vendor.ref([]);
  const getSchoolStoreData = async (obj) => {
    await request_index.request({
      url: "schoolStore/list/page",
      method: "POST",
      data: obj
    }).then((value) => {
      if (value.data.data.records.length != 0) {
        schoolStoreList.value.push(...value.data.data.records);
      }
    });
  };
  const storeDetailData = common_vendor.ref([]);
  const getStoreDetail = async (obj) => {
    await request_index.request({
      url: "schoolStoreFeeds/list/page",
      method: "POST",
      data: obj
    }).then((value) => {
      storeDetailData.value = value.data.data.records;
    });
  };
  const classData = common_vendor.ref([]);
  const getClassTitle = (obj) => {
    request_index.request({
      url: "schoolStoreFeeds/toList/ByLeftTarbar",
      method: "POST",
      data: obj
    }).then((value) => {
      classData.value = value.data.data || null;
      console.log(value);
    });
  };
  const clearGood = async (obj) => {
    await request_index.request({
      url: "userCart/delete/ByCartIdAndFeedId",
      method: "POST",
      header: {
        "content-type": "application/json",
        "Cookie": storedCookie
      },
      data: obj
    }).then((value) => {
      console.log("删除成功", value);
    });
  };
  return {
    LBList,
    userInfo,
    userId,
    getLBData,
    schoolStoreList,
    getSchoolStoreData,
    storeDetailData,
    getStoreDetail,
    classData,
    getClassTitle,
    clearGood
  };
});
exports.Store = Store;
