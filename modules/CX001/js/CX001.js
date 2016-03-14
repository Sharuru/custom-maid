var findByTrainNumberButton = document.getElementById('buttonFindByTrain');
var trainNum = document.getElementById('trainNumberInput');
var findByStationButton = document.getElementById('buttonFindByStation');
var startPos = document.getElementById('startStation');
var arrivePos = document.getElementById('arriveStation');
var startValue = '';
var endValue = '';

function initializeCX001() {
	//	getDays('13:20', '6:59', '17小时39分钟');
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
	mui('.station-select').on('tap', '.select-style', function() {
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
		if (startPos.innerHTML != '请选择站点') {
			startValue = startPos.innerHTML;
		}
		if (arrivePos.innerHTML != '请选择站点') {
			endValue = arrivePos.innerHTML;
		}
		document.getElementById('resultByStation').innerHTML = '';
		findByStation(startValue, endValue);
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

function findByStation(startPosition, endPosition) {
	addDisabledStation();
	mui.ajax(serverAddr + '/travel/train/station', {
		data: {
			from: startPosition,
			to: endPosition
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			//无条目的场合
			if (requestData.error_code != 0) {
				mui.toast(requestData.reason);
				cancelDisabledStation();
			} else {
				var contentStr = '';
				contentStr += '<p class="font-w300-s16">查询结果： </p>';
				for (var i = 0; i < requestData.result.list.length; i++) {
					var startTime = requestData.result.list[i].start_time;
					var totalTime = requestData.result.list[i].run_time;
					var arriveTips = getDays(startTime, totalTime);
					contentStr += '<div class="list-block"><div class="mui-row padding-5-t">';
					contentStr += '<div class="mui-col-xs-12 padding-10-l align-left">';
					contentStr += '<p class="font-w300-s14 color-black">' + requestData.result.list[i].train_no;
					contentStr += '<label class="font-w300-s14 padding-10-l">';
					contentStr += requestData.result.list[i].train_type + '</label></p></div></div>';
					contentStr += '<div class="mui-row padding-5-t" style="line-height: 22px;">';
					contentStr += '<div class="mui-col-xs-8 padding-20-l"><div class="start-circle float-left">';
					contentStr += '<span class="circle-text">' + requestData.result.list[i].start_station_type;
					contentStr += '</span></div><div class="tips-info-small float-left padding-10-l">';
					contentStr += requestData.result.list[i].start_station + '<label class="font-w300-s14 padding-10-l">(';
					contentStr += startTime + ')</label></div></div>';
					contentStr += '<div class="mui-col-xs-4 align-center"><label class="font-w300-s14">';
					contentStr += totalTime + '</label></div></div>';
					contentStr += '<div class="mui-row padding-5" style="line-height: 22px;">';
					contentStr += '<div class="mui-col-xs-8 padding-20-l">';
					if (requestData.result.list[i].end_station_type == '终') {
						contentStr += '<div class="arrive-circle float-left"><span class="circle-text">终';
					} else {
						contentStr += '<div class="pass-circle float-left"><span class="circle-text">';
						contentStr += requestData.result.list[i].end_station_type;
					}
					contentStr += '</span></div><div class="tips-info-small float-left padding-10-l">';
					contentStr += requestData.result.list[i].end_station + '<label class="font-w300-s14 padding-10-l">(';
					contentStr += requestData.result.list[i].end_time + ')</label></div></div>';
					contentStr += '<div class="mui-col-xs-4 align-center"><label class="font-w300-s14">';
					contentStr += arriveTips + '</label></div></div></div>';
				}
				document.getElementById('resultByStation').innerHTML = contentStr;
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