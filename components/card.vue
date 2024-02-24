<template>
	<van-card v-else
	v-for="(i,index) in cartList" 
	:key="index" 
	:price="i.sum_money" 
	:title="i.feeds.feed_name"
	:thumb="i.feeds.url">
		<view slot="footer">
			<van-button size="mini" @click='changeNum(-1,i.schoolStoreFeedId)'>-</van-button>
			<text style="padding: 0 10rpx;background-color: #fff;">{{i.num}}</text>
			<van-button size="mini" @click='changeNum(1,i.schoolStoreFeedId)'>+</van-button>
			<van-button size="mini" @click='delCartGood(index,i.schoolStoreFeedId)'>删除</van-button>
		</view>
	</van-card>
</template>

<script setup>
	import {  
		defineProps
	} from 'vue';
	const props = defineProps()
</script>

<style>
</style>