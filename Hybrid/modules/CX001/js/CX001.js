//按始末城市查询功能参数
var resultContent = mui('.resultInfo')[0];
var startCityEle = document.getElementById('startStationCity');
var arriveCityEle = document.getElementById('arriveStationCity');
var searchListButton = document.getElementById('searchByCity');
var toTopButton = mui('.topButton')[0];
var startCity = '';
var arriveCity = '';
//按车次查询功能参数
var trainNum = document.getElementById('trainNumberInput');
var searchButton = document.getElementById('searchByNum');

/**
 * CX001 画面初始化
 */
function initializeCX001() {
	document.getElementById('searchSlider').addEventListener('slide', function(e) {
		//		console.log(e.detail.slideNumber);
		//		window.scroll(0, 0);
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		if (e.detail.slideNumber == 1) {
			startCityEle.innerHTML = '请选择城市';
			arriveCityEle.innerHTML = '请选择城市';
			startCityEle.style.color = '#8f8f94';
			arriveCityEle.style.color = '#8f8f94';
		} else {
			trainNum.value = '';
			trainNum.blur();
		}
	});
	//按始末城市查询
	//传值事件绑定
	window.addEventListener('setLocation', function(event) {
		document.getElementById(event.detail.triggerId).innerHTML = event.detail.loc;
		document.getElementById(event.detail.triggerId).style.color = '#000000';
	});
	//选择站点点击事件
	mui('.search-key').on('tap', '.search-tips', function() {
		var triggerId = this.id;
		//按钮动效现时完毕后再切换页面
		setTimeout(function() {
			mui.openWindow({
				url: 'CITY_LIST.html',
				id: 'PAGE_CITY_LIST',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					triggerId: triggerId
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});
	//查询按钮点击事件
	searchListButton.addEventListener('tap', function() {
		if (startCityEle.innerHTML != '请选择城市') {
			startCity = startCityEle.innerHTML;
		}
		if (arriveCityEle.innerHTML != '请选择城市') {
			arriveCity = arriveCityEle.innerHTML;
		}
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		findByCity(startCity, arriveCity);
		//		findByCity('上海虹桥', '北京南');
	});
	//交换按钮点击事件
	document.getElementById('exchangeCity').addEventListener('tap', function() {
		var exchangeEle = '';
		exchangeEle = startCityEle.innerHTML;
		startCityEle.innerHTML = arriveCityEle.innerHTML;
		arriveCityEle.innerHTML = exchangeEle;
		resultContent.innerHTML = '';
		resultContent.style.border = '';
	});
	//按车次查询
	searchButton.addEventListener('tap', function() {
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		findByTrainNo();
	});
	//点击按钮回到顶端
	toTopButton.addEventListener('tap', function() {
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 200)
	});
}

/**
 * 滚动到500位置时显示返回顶端按钮
 */
window.onscroll = function() {
	if (document.body.scrollTop > 300) {
		toTopButton.style.display = 'block';
	} else {
		toTopButton.style.display = 'none';
	}
}

/**
 * 根据始末城市查找火车信息
 * 
 * @param {String} startPosition
 * @param {String} endPosition
 */
function findByCity(startPosition, endPosition) {
	addDisabledCity();
	mui.ajax(serverAddr + '/travel/train/station', {
		data: {
			from: startPosition,
			to: endPosition
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//			console.log(JSON.stringify(requestData));
			//无条目的场合
			if (requestData.error_code != 0) {
				mui.toast(requestData.reason);
				cancelDisabledCity();
			} else {
				var contentStr = '';
				contentStr += '<p class="font-s16" style="margin-bottom: 3px;">查询结果</p>';
				for (var i = 0; i < requestData.result.list.length; i++) {
					var startTime = requestData.result.list[i].start_time;
					var totalTime = requestData.result.list[i].run_time;
					var arriveTips = getDays(startTime, totalTime);
					contentStr +=
						'<div class="result-block">' +
						'	<div class="mui-row padding-10-l">' +
						'		<p class="font-s18 color-black remove-margin-b">' +
						requestData.result.list[i].train_no +
						'			<label class="font-s18 padding-10-l">' +
						requestData.result.list[i].train_type +
						'			</label>' +
						'		</p>' +
						'	</div>' +
						'	<div class="mui-row padding-5-t" style="line-height: 24px;">' +
						'		<div class="mui-col-xs-8 padding-20-l">' +
						checkType(requestData.result.list[i].start_station_type) +
						'			<div class="font-s18 float-left padding-10-l">' +
						requestData.result.list[i].start_station +
						'				<label class="font-s16 padding-10-l">(' + startTime + ')</label>' +
						'			</div>' +
						'		</div>' +
						'		<div class="mui-col-xs-4 align-center">' +
						'			<label class="font-s16">' + totalTime + '</label>' +
						'		</div>' +
						'	</div>' +
						'	<div class="mui-row" style="line-height: 22px;padding-top: 3px;">' +
						'		<div class="mui-col-xs-8 padding-20-l">' +
						checkType(requestData.result.list[i].end_station_type) +
						'			<div class="font-s18 float-left padding-10-l">' +
						requestData.result.list[i].end_station +
						'				<label class="font-s16 padding-10-l">' +
						'(' + requestData.result.list[i].end_time + ')' +
						'				</label>' +
						'</div>' +
						'		</div>' +
						'		<div class="mui-col-xs-4 align-center">' +
						'			<label class="font-s16">' + arriveTips + '</label>' +
						'		</div>' +
						'	</div>' +
						'</div>';
				}
				resultContent.innerHTML = contentStr;
				resultContent.style.border = '#DDDDDD solid 1px';
				cancelDisabledCity();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得车次信息', '重试', function() {
				findByCity();
			});
		}
	});
}

/**
 * 按站到站查询页面禁用输入框和查询按钮
 */
function addDisabledCity() {
	mui('.search-key').off('tap', '.search-tips');
	searchListButton.disabled = true;
	searchListButton.innerHTML = '正在查询...';
}

/**
 * 按站到站查询页面解除禁用输入框和查询按钮
 */
function cancelDisabledCity() {
	mui('.search-key').on('tap', '.search-tips', function() {
		var triggerId = this.id;
		//按钮动效现时完毕后再切换页面
		setTimeout(function() {
			mui.openWindow({
				url: 'CITY_LIST.html',
				id: 'PAGE_CITY_LIST',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					triggerId: triggerId
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});
	searchListButton.disabled = false;
	searchListButton.innerHTML = '开始查询';
}

/**
 * 按车次查询
 */
function findByTrainNo() {
	addDisabledNum();
	//合法 check
	mui.ajax(serverAddr + '/travel/train/id', {
		data: {
			id: trainNum.value
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//			console.log(JSON.stringify(requestData));
			//无条目的场合
			if (requestData.error_code != 0) {
				mui.toast(requestData.reason);
				cancelDisabledNum();
			} else {
				var contentStr = '';
				contentStr += '<p class="font-s16" style="margin-bottom: 3px;">查询结果</p>';
				var startTime = requestData.result.list.start_time;
				var totalTime = requestData.result.list.run_time;
				var arriveTips = getDays(startTime, totalTime);
				contentStr +=
					'<div class="detail-block">' +
					'	<div class="mui-row padding-10-l">' +
					'		<p class="font-s18 color-black remove-margin-b">' +
					requestData.result.list.train_no +
					'			<label class="font-s18 padding-10-l">' +
					requestData.result.list.train_type +
					'			</label>' +
					'		</p>' +
					'	</div>' +
					'	<div class="mui-row padding-5-t" style="line-height: 24px;">' +
					'		<div class="mui-col-xs-8 padding-20-l">' +
					checkType(requestData.result.list.start_station_type) +
					'			<div class="font-s18 float-left padding-10-l">' +
					requestData.result.list.start_station +
					'				<label class="font-s16 padding-10-l">(' + startTime + ')</label>' +
					'			</div>' +
					'		</div>' +
					'		<div class="mui-col-xs-4 align-center">' +
					'			<label class="font-s16">' + totalTime + '</label>' +
					'		</div>' +
					'	</div>' +
					'	<div class="mui-row" style="line-height: 22px;padding-top: 3px;">' +
					'		<div class="mui-col-xs-8 padding-20-l">' +
					checkType(requestData.result.list.end_station_type) +
					'			<div class="font-s18 float-left padding-10-l">' +
					requestData.result.list.end_station +
					'				<label class="font-s16 padding-10-l">' +
					'(' + requestData.result.list.end_time + ')' +
					'				</label>' +
					'			</div>' +
					'		</div>' +
					'		<div class="mui-col-xs-4 align-center">' +
					'			<label class="font-s16">' + arriveTips + '</label>' +
					'		</div>' +
					'	</div>' +
					'	<div class="mui-row padding-10-t">' +
					'		<div class="mui-col-xs-4 padding-10-l font-s16">参考票价</div>' +
					'	</div>';
				if (requestData.result.list.price_list.item.length % 2 == 0) {
					for (var i = parseInt(requestData.result.list.price_list.item.length / 2 - 1); i >= 0; i--) {
						contentStr +=
							'<div class="mui-row padding-5-t">' +
							'	<div class="mui-col-xs-6 align-center font-s16">' +
							requestData.result.list.price_list.item[2 * i + 1].price_type + ' : ￥' + requestData.result.list.price_list.item[2 * i + 1].price +
							'	</div>' +
							'	<div class="mui-col-xs-6 align-center font-s16">' +
							requestData.result.list.price_list.item[2 * i].price_type + ' : ￥' + requestData.result.list.price_list.item[2 * i].price +
							'	</div>' +
							'</div>';
					}
				} else {
					for (var i = parseInt(requestData.result.list.price_list.item.length / 2); i >= 0; i--) {
						contentStr +=
							'<div class="mui-row padding-5-t">';
						if (i == 0) {
							contentStr +=
								'<div class="mui-col-xs-6 align-center font-s16">' +
								requestData.result.list.price_list.item[0].price_type + ' : ￥' + requestData.result.list.price_list.item[0].price +
								'</div>';
						} else {
							contentStr +=
								'<div class="mui-col-xs-6 align-center font-s16">' +
								requestData.result.list.price_list.item[2 * i].price_type + ' : ￥' + requestData.result.list.price_list.item[2 * i].price +
								'</div>' +
								'<div class="mui-col-xs-6 align-center font-s16">' +
								requestData.result.list.price_list.item[2 * i - 1].price_type + ' : ￥' + requestData.result.list.price_list.item[2 * i - 1].price +
								'</div>';
						}
						contentStr +=
							'</div>';
					}
				}
				contentStr +=
					'</div>';
				resultContent.innerHTML = contentStr;
				resultContent.style.border = '#DDDDDD solid 1px';
				cancelDisabledNum();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得车次信息', '重试', function() {
				findByTrainNo();
			});
		}
	});
}

/**
 * 按车次查询页面禁用输入框和查询按钮
 */
function addDisabledNum() {
	trainNum.disabled = 'disabled';
	searchButton.disabled = true;
	searchButton.innerHTML = '正在查询...';
}

/**
 * 按车次查询页面解除禁用输入框和查询按钮
 */
function cancelDisabledNum() {
	trainNum.disabled = '';
	searchButton.disabled = false;
	searchButton.innerHTML = '开始查询';
}

/**
 * 判断到站天数
 * 
 * @param {String} startT 发车时间
 * @param {String} totalT 总时长
 */
function getDays(startT, totalT) {
	var returnStr = '';
	var startH = startT.substring(0, startT.indexOf(':'));
	var startM = startT.substring(startT.indexOf(':') + 1, startT.length);
	var totalH = totalT.substring(0, totalT.indexOf('小'));
	if (totalH == '') {
		totalH = 0;
	}
	var totalM = totalT.substring(totalT.indexOf('时') + 1, totalT.indexOf('分'));
	if (totalM == '') {
		totalM = 0;
	}
	var n = totalH / 24;
	var m = totalH % 24;
	if (parseFloat(totalM) + parseFloat(startM) >= 60) {
		m += 1;
	}
	if (m + parseFloat(startH) >= 24) {
		n += 1;
	}
	n = parseInt(n);
	if (n == 0) {
		returnStr = '当日到达';
	} else if (n == 1) {
		returnStr = '次日达到';
	} else {
		returnStr = '第' + parseFloat(n + 1) + '天到达';
	}
	return returnStr;
}

/**
 * 判断始终站点
 * 
 * @param {String} typeStr 站点种类
 */
function checkType(typeStr) {
	var returnStr = '';
	if (typeStr == '始') {
		returnStr +=
			'<div class="start-circle float-left">' +
			'	<span class="circle-text">始</span>' +
			'</div>';
	} else if (typeStr == '终') {
		returnStr +=
			'<div class="arrive-circle float-left">' +
			'	<span class="circle-text">终</span>' +
			'</div>';
	} else {
		returnStr +=
			'<div class="pass-circle float-left">' +
			'	<span class="circle-text">' + typeStr + '</span>' +
			'</div>';
	}
	return returnStr;
}