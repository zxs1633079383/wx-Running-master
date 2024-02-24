<template>
	<view class="publish">
		<van-cell-group v-if="number==1">
			<!-- 代取快递 -->
			<van-field @blur='deliveryId' type="number" required clearable label="快递号" placeholder="请输入快递号"
				:value='deliveryId_value' :readonly='show' />
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>送达时间
				</view>
				<view class="delivery-time-right">
					<text>{{time}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==2">
			<!-- 代取外卖 -->
			<van-field required clearable label="姓名" :maxlength='6' placeholder="请输入取外卖姓名" @blur='name'
				:value='name_value' :readonly='show' />
			<van-field required clearable label="手机号后4位" type='number' :maxlength='4' placeholder="请输入手机号后4位"
				@blur='phoneEnd' :value='phoneEnd_value' :readonly='show' />
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>送达时间
				</view>
				<view class="delivery-time-right">
					<text>{{time}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="酬金" type='number' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==3">
			<!-- 笔记代写 -->
			<van-field required clearable label="姓名" :maxlength='6' placeholder="请输入姓名" @blur='name' :value='name_value'
				:readonly='show' />
			<van-field clearable label="学号" :maxlength='18' placeholder="请输入学号" @blur='studentId'
				:value='studentId_value' :readonly='show' />
			<van-field label="地址" placeholder="请输入交付地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>完成时间
				</view>
				<view class="delivery-time-right">
					<text>{{time}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="酬金" type='number' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==4">
			<!-- 超市代购 -->
			<van-field required clearable label="商品名称" :maxlength='18' placeholder="请输入商品名称" @blur='storeName'
				:value='storeName_value' :readonly='show' />
			<van-field required clearable label="商品数量" type='digit' :maxlength='3' placeholder="请输入商品数量" @blur='num'
				:value='num_value' :readonly='show' />
			<van-field required clearable label="酬金" type='digit' :maxlength='3' placeholder="请输入酬金金额"
				@blur='deliveryMoney' :value='deliveryMoney_value' :readonly='show' />
				
				<!-- @blur='deliveryMoney' :value='deliveryMoney_value' :readonly='show' -->
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>完成时间
				</view>
				<view class="delivery-time-right">
					<text>{{time}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==5">
			<!-- 校园跑腿 -->
			<van-field required clearable label="标题" :maxlength='18' placeholder="例:打水" @blur='title'
				:value='title_value' :readonly='show' />
			<van-field required clearable label="具体细节" :maxlength='25' placeholder="" @blur='context'
				:value='context_value' :readonly='show' />
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>开始时间
				</view>
				<view class="delivery-time-right">
					<text>{{startTime }}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if='number==6'>
			<!-- 校园代跑 -->
			<van-field required clearable label="跑步距离" :maxlength='10' placeholder="例:800米" @blur='runningRange'
				:value='runningRange_value' :readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>起跑时间
				</view>
				<view class="delivery-time-right">
					<text>{{runningTime}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==7">
			<!-- 帮搬东西 -->
			<van-field required clearable label="Kg" :maxlength='3' placeholder="单位kg默认为kg" type='number' @blur='kg'
				:value='kg_value' :readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>开始时间
				</view>
				<view class="delivery-time-right">
					<text>{{startTime }}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==8">
			<!-- 代替上课 -->
			<van-field required clearable label="科目" :maxlength='16' placeholder="请输入上课科目" @blur='subject'
				:value='subject_value' :readonly='show' />
			<van-field label="地址" placeholder="请输入地址" :maxlength='16' required @blur='address' :value='address_value'
				:readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>上课时间
				</view>
				<view class="delivery-time-right">
					<text>{{classTime }}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<view class="sex-style">
				<view class="sex-style-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>
					<text>性别:</text>
				</view>
				<radio-group @change="radioChange" class="sex-style-right" v-if="!show">
					<view>
						<radio value='男' checked></radio>男
					</view>
					<view>
						<radio value='女'></radio>女
					</view>
				</radio-group>
				<text v-else>
					{{sex_value}}
				</text>
			</view>
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==9">
			<!-- 代替查寝 -->
			<van-field required clearable label="宿舍楼号" :maxlength='10' placeholder="请输入宿舍楼号" @blur='dormitoryId'
				:value='dormitoryId_value' :readonly='show' />
			<van-field required clearable label="房间号" :maxlength='10' placeholder="请输入房间号" @blur='roomId'
				:value='roomId_value' :readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>查寝时间
				</view>
				<view class="delivery-time-right">
					<text>{{checkTime}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<view class="sex-style">
				<view class="sex-style-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>
					<text>性别:</text>
				</view>
				<radio-group @change="radioChange" class="sex-style-right" v-if="!show">
					<view>
						<radio value='男' checked></radio>男
					</view>
					<view>
						<radio value='女'></radio>女
					</view>
				</radio-group>
				<text v-else>
					{{sex_value}}
				</text>
			</view>
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group v-else-if="number==10">
			<!-- 代替考试 -->
			<van-field required clearable label="科目" :maxlength='10' placeholder="请输入考试科目" @blur='subject'
				:value='subject_value' :readonly='show' />
			<van-field required clearable label="考试地点" :maxlength='20' placeholder="请输入考试地点" @blur='address'
				:value='address_value' :readonly='show' />
			<view class="deliveryTime" @click='showTimeSelect'>
				<view class="delivery-time-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>考试时间
				</view>
				<view class="delivery-time-right">
					<text>{{examTime}}</text>
					<view class="iconfont icon-xiangyoujiantou"></view>
				</view>
			</view>
			<van-field required clearable label="预期分数" :maxlength='2' type='number' placeholder="请输入预期分数" @blur='score'
				:value='score_value' :readonly='show' />
			<view class="sex-style">
				<view class="sex-style-left">
					<view class="iconfont icon-bitian" style="color: #ff3838;"></view>
					<text>性别:</text>
				</view>
				<radio-group @change="radioChange" class="sex-style-right" v-if="!show">
					<view>
						<radio value='男' checked></radio>男
					</view>
					<view>
						<radio value='女'></radio>女
					</view>
				</radio-group>
				<text v-else>
					{{sex_value}}
				</text>
			</view>
			<van-field label="酬金" type='digit' placeholder="请输入酬金额度" required @blur='money' :value='money_value'
				:readonly='show' />
		</van-cell-group>
		<van-cell-group>
			<van-field label="备注" placeholder="请输入备注信息50字以内" :maxlength='50' type='textarea' @blur='content'
				:value='content_value' :readonly='show' />
		</van-cell-group>
		<van-popup :show="dateShow" round position="bottom" custom-style="height: 40%">
			<van-datetime-picker type="datetime" :min-date="dateTime.minDate" :max-date="dateTime.maxDate"
				:min-hour="dateTime.minHour" @confirm="confirm" @cancel="cancel" />
		</van-popup>
		<view class="overlay">
			<van-overlay :show="showWarning">
				<view class="wrapper">
					<view class="contant">
						<text>请填写必要信息</text>
						<view style="height: 50rpx;"></view>
						<van-button type="primary" size="large" round
							color="linear-gradient(to right, #ff2950, #f64a06)" @click="hideT">确定</van-button>
					</view>
				</view>
			</van-overlay>
		</view>
		<view class="overlay">
			<van-overlay :show="showMsg">
				<view class="msg-wrapper">
					<view class="msg-contant">
						<text>{{msg}}</text>
					</view>
				</view>
			</van-overlay>
		</view>
		<van-button v-if="!show" type="primary" round size="large" @click='publishOrder'>发布订单</van-button>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import request from '../../request';
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	// 业务类型展示
	const number = ref(null)
	// 不同人访问展示不同按钮开关
	const show = ref(true)
	onLoad((option) => {
		if (option.index) {
			show.value = false
			number.value = parseInt(option.index)
		}
		if ('content' in option) {
			show.value = true
			let from = JSON.parse(option.content)
			console.log(from);
			number.value = from.type
			deliveryId_value.value = from.deliveryId
			name_value.value = from.name
			phoneEnd_value.value = from.phoneEnd
			studentId_value.value = from.studentId
			storeName_value.value = from.storeName
			num_value.value = from.num
			deliveryMoney_value.value = from.deliveryMoney
			title_value.value = from.title
			content_value.value = from.content
			context_value.value = from.context
			runningRange_value.value = from.runningRange
			confirm({
				detail: from.deliveryTime
			})
			confirm({
				detail: from.dateTime
			})
			kg_value.value = from.kg
			subject_value.value = from.subject
			sex_value.value = from.sex
			dormitoryId_value.value = from.dormitoryId
			roomId_value.value = from.roomId
			score_value.value = from.score
			address_value.value = from.address
			money_value.value = from.money + '元'
		}
		if (number.value >= 8) from1.value.sex = '男'
	})
	// 时间选择器参数
	const dateTime = ref({
		minDate: new Date().getTime(),
		maxDate: new Date("2025/10/1"),
		minHour: 8,
		maxHour: 23
	})
	// 时间选择后显示
	const time = ref('请选择送达时间')
	//时间选择器显示控制
	const dateShow = ref(false)
	const showTimeSelect = () => {
		if (!show.value) {
			dateShow.value = true
		}
	}
	// 时间选择器确认点击
	let a = true
	const confirm = (e) => {
		dateShow.value = false
		if (e.detail && a) {
			let date = new Date(e.detail);
			let showTime = date.getFullYear() + '年' + (date.getMonth() - '0' + 1).toString() + '月' + date.getDate() +
				'日' + date.getHours() + '时' + date.getMinutes() + '分'
			time.value = showTime
			runningTime.value = showTime
			startTime.value = showTime
			classTime.value = showTime
			checkTime.value = showTime
			examTime.value = showTime
			from1.value.deliveryTime = date.getTime()
			from1.value.dateTime = date.getTime()
			if (show.value) a = false
		}
	}
	// 时间选择器取消点击
	const cancel = () => {
		dateShow.value = false
		if (show) {
			checkText(from1.value.dateTime || '')
		}
	}
	// 快递单号
	const deliveryId_value = ref('')
	const deliveryId = (e) => {
		checkText(e.detail.value)
		from1.value.deliveryId = parseInt(e.detail.value)
	}
	// 顾客姓名
	const name_value = ref('')
	const name = (e) => {
		checkText(e.detail.value)
		from1.value.name = e.detail.value
	}
	// 手机号后4位
	const phoneEnd_value = ref('')
	const phoneEnd = (e) => {
		checkText(e.detail.value)
		from1.value.phoneEnd = e.detail.value
	}

	// 学号
	const studentId_value = ref('')
	const studentId = (e) => {
		from1.value.studentId = e.detail.value
	}

	// 商品名称
	const storeName_value = ref('')
	const storeName = (e) => {
		checkText(e.detail.value)
		from1.value.storeName = e.detail.value
	}
	// 商品数量
	const num_value = ref('')
	const num = (e) => {
		checkText(e.detail.value)
		from1.value.num = parseInt(e.detail.value)
	}
	// 酬金
	const deliveryMoney_value = ref('')
	const deliveryMoney = (e) => {
		checkText(e.detail.value)
		from1.value.deliveryMoney = parseInt(e.detail.value)
		from1.value.money = from1.value.deliveryMoney
	}

	// 标题
	const title_value = ref('')
	const title = (e) => {
		checkText(e.detail.value)
		from1.value.title = e.detail.value
	}
	// 内容
	const context_value = ref('')
	const context = (e) => {
		checkText(e.detail.value)
		from1.value.context = e.detail.value
	}

	// 跑步距离
	const runningRange_value = ref('')
	const runningRange = (e) => {
		checkText(e.detail.value)
		from1.value.runningRange = e.detail.value
	}
	// 时间选择后显示
	const runningTime = ref('请选择起跑预计时间')

	// 重量
	const kg_value = ref('')
	const kg = (e) => {
		checkText(e.detail.value)
		from1.value.kg = parseInt(e.detail.value)
	}
	// 开始搬运时间
	const startTime = ref('请选择开始预计时间')

	// 科目
	const subject_value = ref('')
	const subject = (e) => {
		checkText(e.detail.value)
		from1.value.subject = e.detail.value
	}
	// 上课时间
	const classTime = ref('请选择上课时间')
	// 性别
	const sex_value = ref('')
	const radioChange = (e) => {
		checkText(e.detail.value)
		from1.value.sex = e.detail.value
	}

	// 宿舍楼号
	const dormitoryId_value = ref('')
	const dormitoryId = (e) => {
		checkText(e.detail.value)
		from1.value.dormitoryId = e.detail.value
	}
	// 宿舍号
	const roomId_value = ref('')
	const roomId = (e) => {
		checkText(e.detail.value)
		from1.value.roomId = e.detail.value
	}
	const checkTime = ref('请输入查寝时间')

	// 考试时间
	const examTime = ref('请选择考试时间')
	// 要求分数
	const score_value = ref('')
	const score = (e) => {
		checkText(e.detail.value)
		from1.value.score = parseInt(e.detail.value)
	}

	// 送达地址
	const address_value = ref('')
	const address = (e) => {
		checkText(e.detail.value)
		from1.value.address = e.detail.value
	}
	// 酬金
	const money_value = ref('')
	const money = (e) => {
		checkText(e.detail.value)
		from1.value.money = parseInt(e.detail.value)
	}
	// 备注
	const content_value = ref('')
	const content = (e) => {
		from1.value.content = e.detail.value
	}
	// 判断必填框是否为空
	// 验证开关
	const checkSwitch = ref(false)
	const checkText = (value) => {
		if (value.trim().length == 0 || value == undefined) {
			checkSwitch.value = false;
		} else {
			checkSwitch.value = true;
		}
	}
	// 提示框展示控制
	const showWarning = ref(false)
	// 提示框展示
	const showT = () => {
		showWarning.value = true
	}
	// 提示框隐藏
	const hideT = () => {
		showWarning.value = false
	}
	// 展示提交返回信息
	const showMsg = ref(false)
	const msg = ref('')
	// 提交数据 old 
	const from1 = ref({})
	// const publishOrder =async()=>{
	// 	if(!checkSwitch.value){
	// 		showT()
	// 	}else{
	// 		await request({
	// 			url:'submitOrder/add',
	// 			method:"POST",
	// 			data:{
	// 			  "content": JSON.stringify(from1.value),
	// 			  "id": "",
	// 			  "schoolId": 1,
	// 			  "submit_index": number.value
	// 			},
	// 			header: {
	// 				'content-type': 'application/json',
	// 				'Cookie': storedCookie
	// 			}
	// 		}).then(res=>{
	// 			checkFrom1(number.value)
	// 			if(res.data.code==0&&check){
	// 				msg.value='发布成功'
	// 				showMsg.value=true
	// 				setTimeout(()=>{
	// 					showMsg.value=false
	// 					uni.switchTab({
	// 						url:'/pages/index/index'
	// 					})
	// 				},3000)
	// 			}else{
	// 				msg.value='请填写必要信息'
	// 				showMsg.value=true
	// 				setTimeout(()=>{
	// 					showMsg.value=false
	// 				},800)
	// 			}
	// 		})
	// 	}
	// }

	//提交数据 new
	const publishOrder = async () => {
		if (!checkSwitch.value) {
			showT()
		} else {
			await request({
				url: 'submitOrder/addmq',
				method: "POST",
				data: {
					// "content": JSON.stringify(from1.value),
					"content": from1.value,
					"id": "",
					"schoolId": 1,
					"submit_index": number.value
				},
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				}
			}).then(res2 => {
				console.log(res2.data);
				//调起微信支付
				try {
					uni.requestPayment({
						timeStamp: res2.data.timeStamp,
						nonceStr: res2.data.nonceStr,
						package: res2.data.packageVal,
						signType: res2.data.signType,
						paySign: res2.data.paySign,
						appId: res2.data.appid,
						success(res3) {
							console.log('拉起payment success', res3)
							uni.switchTab({
							    url: '/pages/list/list'
							})
						},
						fail(res3) {
							console.log('拉起payment fail', res3)
						},
						complete(res3) {
							console.log('拉起payment complete', res3)
						}
					})
				} catch (error2) {
					console.error("支付请求失败", error2);
				}
			})
		}
	}



	// 检测提交的表单是否完整
	let rules = [
		["deliveryId", "address", "deliveryTime", "money"],
		["name", "phoneEnd", "address", "deliveryTime", "money"],
		["name", , "address", "deliveryTime", "money"],
		["storeName", "num", "deliveryMoney", "deliveryTime", "address"],
		["title", "context", "money", "deliveryTime", "address"],
		["runningRange", "dateTime", "address", "money"],
		["kg", "dateTime", "address", "money"],
		["subject", "address", "dateTime", "sex", "money"],
		["dormitoryId", "roomId", "dateTime", "sex", "money"],
		["subject", "address", "dateTime", "score", "sex", "money"]
	]
	// 检测结果标志
	let check = false
	const checkFrom1 = (num) => {
		let fromKeys = Object.keys(from1.value)
		check = true
		rules[num - 1].forEach(i => {
			if (!fromKeys.includes(i)) {
				check = false
			}
		})
	}
</script>

<style lang="scss">
	.publish {
		position: relative;

		.overlay {
			position: absolute;
			z-index: 10;
		}

		.wrapper {
			width: 500rpx;
			height: 300rpx;
			background-color: #fff;
			border-radius: 30rpx;
			margin: 50%;
			transform: translateX(-50%);

			.contant {
				text-align: center;
				display: flex;
				flex-direction: column;
				padding: 50rpx;
				font-size: 40rpx;
			}

			.msg-contant {
				text-align: center;
				padding: 50rpx;
				font-size: 40rpx;
			}
		}

		.msg-wrapper {
			width: 500rpx;
			height: 300rpx;
			background-color: #fff;
			border-radius: 30rpx;
			margin: 50%;
			transform: translateX(-50%);
			display: flex;
			justify-content: center;
			align-items: center;

			.msg-contant {
				text-align: center;
				padding: 50rpx;
				font-size: 40rpx;
			}
		}

		.deliveryTime {
			width: 100%;
			display: flex;
			justify-content: start;
			align-items: center;
			font-size: 28rpx;
			padding: 32rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #f5f5f5;

			.delivery-time-left {
				width: 29%;
				color: #6a6a6a;
				display: flex;
				justify-content: start;
				margin-left: -28rpx;
			}

			.delivery-time-right {
				width: 70%;
				color: #dadada;
				display: flex;
				justify-content: space-between;
			}
		}

		.sex-style {
			width: 100%;
			font-size: 28rpx;
			padding: 32rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #f5f5f5;
			display: flex;
			justify-content: start;
			align-items: center;

			.sex-style-left {
				width: 29%;
				display: flex;
				justify-content: start;
				margin-left: -28rpx;
			}

			.sex-style-right {
				width: 70%;
				display: flex;
				justify-content: space-around;

				view {
					display: flex;
					justify-content: start;
				}
			}
		}
	}
</style>