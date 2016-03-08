var findByTrainNumberButton = document.getElementById('buttonFindByTrain');
var trainNum = document.getElementById('trainNumberInput');
var findByStationButton = document.getElementById('buttonFindByStation');
var startPos = document.getElementById('startStation');
var arrivePos = document.getElementById('arriveStation');

function initializeCX001() {
	document.getElementById('slider').addEventListener('slide', function(e) {
		console.log(e.detail.slideNumber);
	});
	//按车次查询
	findByTrainNumberButton.addEventListener('tap', function() {
		findByTrainNo();
	});
	//按站到站查询
	//传值事件绑定
	window.addEventListener('setLocation', function(event) {
		document.getElementById(event.detail.triggerId).innerHTML = event.detail.loc;
		document.getElementById(event.detail.triggerId).style.color = '#000000';
	});
	//选择站点点击事件
	mui("body").on('tap', '.select-style', function() {
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
	findByStationButton.addEventListener('tap', function() {
		findByStation();
	});
}

/**
 * 按车次查询
 */
function findByTrainNo() {
	addDisabledTrain();
	//合法 check
	mui.ajax(serverAddr + '/travel/train/id', {
		data: {
			id: trainNum.value
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			//无条目的场合
			if (requestData.error_code != 0) {
				mui.toast(requestData.reason);
				cancelDisabledTrain();
			} else {
				var contentStr = '';
				var cycleStr = '';
				contentStr += '<p class="font-w300-s16">查询结果：</p>';
				contentStr += '<div class="mui-row padding-5-t"><div class="mui-col-xs-12 font-w300-s16">';
				contentStr += requestData.result.list.train_no + ' ' + requestData.result.list.train_type;
				contentStr += '</div></div><div class="mui-row padding-5-t">';
				contentStr += '<div class="mui-col-xs-5 align-center"><p class="station-name">';
				contentStr += requestData.result.list.start_station + '</p></div>';
				contentStr += '<div class="mui-col-xs-3 align-center">';
				contentStr += '<span class="icon iconfont icon-arrowRight"></span>';
				contentStr += '</div><div class="mui-col-xs-4 align-center"><p class="station-name">';
				contentStr += requestData.result.list.end_station + '</p></div></div>';
				contentStr += '<div class="mui-row padding-5-t"><div class="mui-col-xs-5 align-center">';
				contentStr += '<p class="tips-info">' + requestData.result.list.start_time + '</p></div>';
				contentStr += '<div class="mui-col-xs-3 align-center"><p class="tips-info-small">';
				contentStr += requestData.result.list.run_time + '</p></div>';
				contentStr += '<div class="mui-col-xs-4 align-center"><p class="tips-info">';
				contentStr += requestData.result.list.end_time + '</p></div></div>';
				contentStr += '<div class="mui-row padding-5-t"><div class="mui-col-xs-3 font-w300-s16">参考票价</div>';
				contentStr += '<div class="mui-col-xs-8"><p class="tips-info-small">';
				if (requestData.result.list.price_list.item.length % 2 == 0) {
					for (var i = parseInt(requestData.result.list.price_list.item.length / 2 - 1); i >= 0; i--) {
						cycleStr += requestData.result.list.price_list.item[2 * i + 1].price_type;
						cycleStr += ' : ￥' + requestData.result.list.price_list.item[2 * i + 1].price;
						cycleStr += '<label class="padding-10-l padding-10-r">||</label>';
						cycleStr += requestData.result.list.price_list.item[2 * i].price_type;
						cycleStr += ' : ￥' + requestData.result.list.price_list.item[2 * i].price + '<br>';
					}
					cycleStr = cycleStr.substring(0, cycleStr.lastIndexOf('<br>'));
				} else {
					for (var i = parseInt(requestData.result.list.price_list.item.length / 2); i >= 0; i--) {
						if (i == 0) {
							cycleStr += requestData.result.list.price_list.item[0].price_type;
							cycleStr += ' : ￥' + requestData.result.list.price_list.item[0].price + '<br>';
						} else {
							cycleStr += requestData.result.list.price_list.item[2 * i].price_type;
							cycleStr += ' : ￥' + requestData.result.list.price_list.item[2 * i].price;
							cycleStr += '<label class="padding-10-l padding-10-r">||</label>';
							cycleStr += requestData.result.list.price_list.item[2 * i - 1].price_type;
							cycleStr += ' : ￥' + requestData.result.list.price_list.item[2 * i - 1].price + '<br>';
						}
					}
					cycleStr = cycleStr.substring(0, cycleStr.lastIndexOf('<br>'));
				}
				contentStr += cycleStr;
				contentStr += '</p></div></div>';
				document.getElementById('resultByTrain').innerHTML = contentStr;
				cancelDisabledTrain();
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
function addDisabledTrain() {
	trainNum.disabled = 'disabled';
	findByTrainNumberButton.disabled = true;
	findByTrainNumberButton.innerHTML = '正在查询...';
}

/**
 * 按车次查询页面解除禁用输入框和查询按钮
 */
function cancelDisabledTrain() {
	trainNum.disabled = '';
	findByTrainNumberButton.disabled = false;
	findByTrainNumberButton.innerHTML = '开始查询';
}

function findByStation() {
	addDisabledStation();
	mui.ajax(serverAddr + '/travel/train/station', {
		data: {
			from: startPos.value,
			to: arrivePos.value
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success:function(requestData){
			console.log(JSON.stringify(requestData));
			//无条目的场合
			if (requestData.error_code != 0) {
				mui.toast(requestData.reason);
				cancelDisabledStation();
			} else {
				cancelDisabledStation();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得车次信息', '重试', function() {
				findByStation();
			});
		}
	});
}

/**
 * 按站到站查询页面禁用输入框和查询按钮
 */
function addDisabledStation() {
	mui("body").off('tap', '.select-style');
	findByStationButton.disabled = true;
	findByStationButton.innerHTML = '正在查询...';
}

/**
 * 按站到站查询页面解除禁用输入框和查询按钮
 */
function cancelDisabledStation() {
	mui("body").on('tap', '.select-style', function() {
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
	findByStationButton.disabled = false;
	findByStationButton.innerHTML = '开始查询';
}