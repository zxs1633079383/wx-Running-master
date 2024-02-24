"use strict";
const common_vendor = require("../../common/vendor.js");
const request_index = require("../../request/index.js");
if (!Array) {
  const _component_van_field = common_vendor.resolveComponent("van-field");
  const _component_van_cell_group = common_vendor.resolveComponent("van-cell-group");
  const _component_van_datetime_picker = common_vendor.resolveComponent("van-datetime-picker");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_overlay = common_vendor.resolveComponent("van-overlay");
  (_component_van_field + _component_van_cell_group + _component_van_datetime_picker + _component_van_popup + _component_van_button + _component_van_overlay)();
}
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const storedCookie = common_vendor.index.getStorageSync("sessionCookie");
    const number = common_vendor.ref(null);
    const show = common_vendor.ref(true);
    common_vendor.onLoad((option) => {
      if (option.index) {
        show.value = false;
        number.value = parseInt(option.index);
      }
      if ("content" in option) {
        show.value = true;
        let from = JSON.parse(option.content);
        console.log(from);
        number.value = from.type;
        deliveryId_value.value = from.deliveryId;
        name_value.value = from.name;
        phoneEnd_value.value = from.phoneEnd;
        studentId_value.value = from.studentId;
        storeName_value.value = from.storeName;
        num_value.value = from.num;
        deliveryMoney_value.value = from.deliveryMoney;
        title_value.value = from.title;
        content_value.value = from.content;
        context_value.value = from.context;
        runningRange_value.value = from.runningRange;
        confirm({
          detail: from.deliveryTime
        });
        confirm({
          detail: from.dateTime
        });
        kg_value.value = from.kg;
        subject_value.value = from.subject;
        sex_value.value = from.sex;
        dormitoryId_value.value = from.dormitoryId;
        roomId_value.value = from.roomId;
        score_value.value = from.score;
        address_value.value = from.address;
        money_value.value = from.money + "元";
      }
      if (number.value >= 8)
        from1.value.sex = "男";
    });
    const dateTime = common_vendor.ref({
      minDate: (/* @__PURE__ */ new Date()).getTime(),
      maxDate: /* @__PURE__ */ new Date("2025/10/1"),
      minHour: 8,
      maxHour: 23
    });
    const time = common_vendor.ref("请选择送达时间");
    const dateShow = common_vendor.ref(false);
    const showTimeSelect = () => {
      if (!show.value) {
        dateShow.value = true;
      }
    };
    let a = true;
    const confirm = (e) => {
      dateShow.value = false;
      if (e.detail && a) {
        let date = new Date(e.detail);
        let showTime = date.getFullYear() + "年" + (date.getMonth() - "0" + 1).toString() + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分";
        time.value = showTime;
        runningTime.value = showTime;
        startTime.value = showTime;
        classTime.value = showTime;
        checkTime.value = showTime;
        examTime.value = showTime;
        from1.value.deliveryTime = date.getTime();
        from1.value.dateTime = date.getTime();
        if (show.value)
          a = false;
      }
    };
    const cancel = () => {
      dateShow.value = false;
      if (show) {
        checkText(from1.value.dateTime || "");
      }
    };
    const deliveryId_value = common_vendor.ref("");
    const deliveryId = (e) => {
      checkText(e.detail.value);
      from1.value.deliveryId = parseInt(e.detail.value);
    };
    const name_value = common_vendor.ref("");
    const name = (e) => {
      checkText(e.detail.value);
      from1.value.name = e.detail.value;
    };
    const phoneEnd_value = common_vendor.ref("");
    const phoneEnd = (e) => {
      checkText(e.detail.value);
      from1.value.phoneEnd = e.detail.value;
    };
    const studentId_value = common_vendor.ref("");
    const studentId = (e) => {
      from1.value.studentId = e.detail.value;
    };
    const storeName_value = common_vendor.ref("");
    const storeName = (e) => {
      checkText(e.detail.value);
      from1.value.storeName = e.detail.value;
    };
    const num_value = common_vendor.ref("");
    const num = (e) => {
      checkText(e.detail.value);
      from1.value.num = parseInt(e.detail.value);
    };
    const deliveryMoney_value = common_vendor.ref("");
    const deliveryMoney = (e) => {
      checkText(e.detail.value);
      from1.value.deliveryMoney = parseInt(e.detail.value);
      from1.value.money = from1.value.deliveryMoney;
    };
    const title_value = common_vendor.ref("");
    const title = (e) => {
      checkText(e.detail.value);
      from1.value.title = e.detail.value;
    };
    const context_value = common_vendor.ref("");
    const context = (e) => {
      checkText(e.detail.value);
      from1.value.context = e.detail.value;
    };
    const runningRange_value = common_vendor.ref("");
    const runningRange = (e) => {
      checkText(e.detail.value);
      from1.value.runningRange = e.detail.value;
    };
    const runningTime = common_vendor.ref("请选择起跑预计时间");
    const kg_value = common_vendor.ref("");
    const kg = (e) => {
      checkText(e.detail.value);
      from1.value.kg = parseInt(e.detail.value);
    };
    const startTime = common_vendor.ref("请选择开始预计时间");
    const subject_value = common_vendor.ref("");
    const subject = (e) => {
      checkText(e.detail.value);
      from1.value.subject = e.detail.value;
    };
    const classTime = common_vendor.ref("请选择上课时间");
    const sex_value = common_vendor.ref("");
    const radioChange = (e) => {
      checkText(e.detail.value);
      from1.value.sex = e.detail.value;
    };
    const dormitoryId_value = common_vendor.ref("");
    const dormitoryId = (e) => {
      checkText(e.detail.value);
      from1.value.dormitoryId = e.detail.value;
    };
    const roomId_value = common_vendor.ref("");
    const roomId = (e) => {
      checkText(e.detail.value);
      from1.value.roomId = e.detail.value;
    };
    const checkTime = common_vendor.ref("请输入查寝时间");
    const examTime = common_vendor.ref("请选择考试时间");
    const score_value = common_vendor.ref("");
    const score = (e) => {
      checkText(e.detail.value);
      from1.value.score = parseInt(e.detail.value);
    };
    const address_value = common_vendor.ref("");
    const address = (e) => {
      checkText(e.detail.value);
      from1.value.address = e.detail.value;
    };
    const money_value = common_vendor.ref("");
    const money = (e) => {
      checkText(e.detail.value);
      from1.value.money = parseInt(e.detail.value);
    };
    const content_value = common_vendor.ref("");
    const content = (e) => {
      from1.value.content = e.detail.value;
    };
    const checkSwitch = common_vendor.ref(false);
    const checkText = (value) => {
      if (value.trim().length == 0 || value == void 0) {
        checkSwitch.value = false;
      } else {
        checkSwitch.value = true;
      }
    };
    const showWarning = common_vendor.ref(false);
    const showT = () => {
      showWarning.value = true;
    };
    const hideT = () => {
      showWarning.value = false;
    };
    const showMsg = common_vendor.ref(false);
    const msg = common_vendor.ref("");
    const from1 = common_vendor.ref({});
    const publishOrder = async () => {
      if (!checkSwitch.value) {
        showT();
      } else {
        await request_index.request({
          url: "submitOrder/addmq",
          method: "POST",
          data: {
            // "content": JSON.stringify(from1.value),
            "content": from1.value,
            "id": "",
            "schoolId": 1,
            "submit_index": number.value
          },
          header: {
            "content-type": "application/json",
            "Cookie": storedCookie
          }
        }).then((res2) => {
          console.log(res2.data);
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
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: number.value == 1
      }, number.value == 1 ? {
        b: common_vendor.o(deliveryId),
        c: common_vendor.p({
          type: "number",
          required: true,
          clearable: true,
          label: "快递号",
          placeholder: "请输入快递号",
          value: deliveryId_value.value,
          readonly: show.value
        }),
        d: common_vendor.o(address),
        e: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        }),
        f: common_vendor.t(time.value),
        g: common_vendor.o(showTimeSelect),
        h: common_vendor.o(money),
        i: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      } : number.value == 2 ? {
        k: common_vendor.o(name),
        l: common_vendor.p({
          required: true,
          clearable: true,
          label: "姓名",
          maxlength: 6,
          placeholder: "请输入取外卖姓名",
          value: name_value.value,
          readonly: show.value
        }),
        m: common_vendor.o(phoneEnd),
        n: common_vendor.p({
          required: true,
          clearable: true,
          label: "手机号后4位",
          type: "number",
          maxlength: 4,
          placeholder: "请输入手机号后4位",
          value: phoneEnd_value.value,
          readonly: show.value
        }),
        o: common_vendor.o(address),
        p: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        }),
        q: common_vendor.t(time.value),
        r: common_vendor.o(showTimeSelect),
        s: common_vendor.o(money),
        t: common_vendor.p({
          label: "酬金",
          type: "number",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      } : number.value == 3 ? {
        w: common_vendor.o(name),
        x: common_vendor.p({
          required: true,
          clearable: true,
          label: "姓名",
          maxlength: 6,
          placeholder: "请输入姓名",
          value: name_value.value,
          readonly: show.value
        }),
        y: common_vendor.o(studentId),
        z: common_vendor.p({
          clearable: true,
          label: "学号",
          maxlength: 18,
          placeholder: "请输入学号",
          value: studentId_value.value,
          readonly: show.value
        }),
        A: common_vendor.o(address),
        B: common_vendor.p({
          label: "地址",
          placeholder: "请输入交付地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        }),
        C: common_vendor.t(time.value),
        D: common_vendor.o(showTimeSelect),
        E: common_vendor.o(money),
        F: common_vendor.p({
          label: "酬金",
          type: "number",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      } : number.value == 4 ? {
        H: common_vendor.o(storeName),
        I: common_vendor.p({
          required: true,
          clearable: true,
          label: "商品名称",
          maxlength: 18,
          placeholder: "请输入商品名称",
          value: storeName_value.value,
          readonly: show.value
        }),
        J: common_vendor.o(num),
        K: common_vendor.p({
          required: true,
          clearable: true,
          label: "商品数量",
          type: "digit",
          maxlength: 3,
          placeholder: "请输入商品数量",
          value: num_value.value,
          readonly: show.value
        }),
        L: common_vendor.o(deliveryMoney),
        M: common_vendor.p({
          required: true,
          clearable: true,
          label: "酬金",
          type: "digit",
          maxlength: 3,
          placeholder: "请输入酬金金额",
          value: deliveryMoney_value.value,
          readonly: show.value
        }),
        N: common_vendor.t(time.value),
        O: common_vendor.o(showTimeSelect),
        P: common_vendor.o(address),
        Q: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        })
      } : number.value == 5 ? {
        S: common_vendor.o(title),
        T: common_vendor.p({
          required: true,
          clearable: true,
          label: "标题",
          maxlength: 18,
          placeholder: "例:打水",
          value: title_value.value,
          readonly: show.value
        }),
        U: common_vendor.o(context),
        V: common_vendor.p({
          required: true,
          clearable: true,
          label: "具体细节",
          maxlength: 25,
          placeholder: "",
          value: context_value.value,
          readonly: show.value
        }),
        W: common_vendor.o(money),
        X: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        }),
        Y: common_vendor.t(startTime.value),
        Z: common_vendor.o(showTimeSelect),
        aa: common_vendor.o(address),
        ab: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        })
      } : number.value == 6 ? {
        ad: common_vendor.o(runningRange),
        ae: common_vendor.p({
          required: true,
          clearable: true,
          label: "跑步距离",
          maxlength: 10,
          placeholder: "例:800米",
          value: runningRange_value.value,
          readonly: show.value
        }),
        af: common_vendor.t(runningTime.value),
        ag: common_vendor.o(showTimeSelect),
        ah: common_vendor.o(address),
        ai: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        }),
        aj: common_vendor.o(money),
        ak: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      } : number.value == 7 ? {
        am: common_vendor.o(kg),
        an: common_vendor.p({
          required: true,
          clearable: true,
          label: "Kg",
          maxlength: 3,
          placeholder: "单位kg默认为kg",
          type: "number",
          value: kg_value.value,
          readonly: show.value
        }),
        ao: common_vendor.t(startTime.value),
        ap: common_vendor.o(showTimeSelect),
        aq: common_vendor.o(address),
        ar: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        }),
        as: common_vendor.o(money),
        at: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      } : number.value == 8 ? common_vendor.e({
        aw: common_vendor.o(subject),
        ax: common_vendor.p({
          required: true,
          clearable: true,
          label: "科目",
          maxlength: 16,
          placeholder: "请输入上课科目",
          value: subject_value.value,
          readonly: show.value
        }),
        ay: common_vendor.o(address),
        az: common_vendor.p({
          label: "地址",
          placeholder: "请输入地址",
          maxlength: 16,
          required: true,
          value: address_value.value,
          readonly: show.value
        }),
        aA: common_vendor.t(classTime.value),
        aB: common_vendor.o(showTimeSelect),
        aC: !show.value
      }, !show.value ? {
        aD: common_vendor.o(radioChange)
      } : {
        aE: common_vendor.t(sex_value.value)
      }, {
        aF: common_vendor.o(money),
        aG: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      }) : number.value == 9 ? common_vendor.e({
        aI: common_vendor.o(dormitoryId),
        aJ: common_vendor.p({
          required: true,
          clearable: true,
          label: "宿舍楼号",
          maxlength: 10,
          placeholder: "请输入宿舍楼号",
          value: dormitoryId_value.value,
          readonly: show.value
        }),
        aK: common_vendor.o(roomId),
        aL: common_vendor.p({
          required: true,
          clearable: true,
          label: "房间号",
          maxlength: 10,
          placeholder: "请输入房间号",
          value: roomId_value.value,
          readonly: show.value
        }),
        aM: common_vendor.t(checkTime.value),
        aN: common_vendor.o(showTimeSelect),
        aO: !show.value
      }, !show.value ? {
        aP: common_vendor.o(radioChange)
      } : {
        aQ: common_vendor.t(sex_value.value)
      }, {
        aR: common_vendor.o(money),
        aS: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      }) : number.value == 10 ? common_vendor.e({
        aU: common_vendor.o(subject),
        aV: common_vendor.p({
          required: true,
          clearable: true,
          label: "科目",
          maxlength: 10,
          placeholder: "请输入考试科目",
          value: subject_value.value,
          readonly: show.value
        }),
        aW: common_vendor.o(address),
        aX: common_vendor.p({
          required: true,
          clearable: true,
          label: "考试地点",
          maxlength: 20,
          placeholder: "请输入考试地点",
          value: address_value.value,
          readonly: show.value
        }),
        aY: common_vendor.t(examTime.value),
        aZ: common_vendor.o(showTimeSelect),
        ba: common_vendor.o(score),
        bb: common_vendor.p({
          required: true,
          clearable: true,
          label: "预期分数",
          maxlength: 2,
          type: "number",
          placeholder: "请输入预期分数",
          value: score_value.value,
          readonly: show.value
        }),
        bc: !show.value
      }, !show.value ? {
        bd: common_vendor.o(radioChange)
      } : {
        be: common_vendor.t(sex_value.value)
      }, {
        bf: common_vendor.o(money),
        bg: common_vendor.p({
          label: "酬金",
          type: "digit",
          placeholder: "请输入酬金额度",
          required: true,
          value: money_value.value,
          readonly: show.value
        })
      }) : {}, {
        j: number.value == 2,
        v: number.value == 3,
        G: number.value == 4,
        R: number.value == 5,
        ac: number.value == 6,
        al: number.value == 7,
        av: number.value == 8,
        aH: number.value == 9,
        aT: number.value == 10,
        bh: common_vendor.o(content),
        bi: common_vendor.p({
          label: "备注",
          placeholder: "请输入备注信息50字以内",
          maxlength: 50,
          type: "textarea",
          value: content_value.value,
          readonly: show.value
        }),
        bj: common_vendor.o(confirm),
        bk: common_vendor.o(cancel),
        bl: common_vendor.p({
          type: "datetime",
          minDate: dateTime.value.minDate,
          maxDate: dateTime.value.maxDate,
          minHour: dateTime.value.minHour
        }),
        bm: common_vendor.p({
          show: dateShow.value,
          round: true,
          position: "bottom",
          customStyle: "height: 40%"
        }),
        bn: common_vendor.o(hideT),
        bo: common_vendor.p({
          type: "primary",
          size: "large",
          round: true,
          color: "linear-gradient(to right, #ff2950, #f64a06)"
        }),
        bp: common_vendor.p({
          show: showWarning.value
        }),
        bq: common_vendor.t(msg.value),
        br: common_vendor.p({
          show: showMsg.value
        }),
        bs: !show.value
      }, !show.value ? {
        bt: common_vendor.o(publishOrder),
        bv: common_vendor.p({
          type: "primary",
          round: true,
          size: "large"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyRuanJian/hm-vue/xingqiu/wx-Running-master/subpages/publish/publish.vue"]]);
wx.createPage(MiniProgramPage);
