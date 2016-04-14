var localStorage = window.localStorage;
var resultContent = mui('.weather-main')[0];

function initializeHJ003() {
	//传值事件绑定
	window.addEventListener('setCityName', function(event) {
		//console.log('event is ' + event.detail.loc);
		getCityWeather(event.detail.loc);
	});
	initWeather(addTap);
}

function initWeather(callback) {
	resultContent.innerHTML = '';
	var currProvince = localStorage.getItem('province');
	getCityWeather(currProvince);
	callback();
}

function addTap() {
	mui('.weather-main').on('tap', '#changeLocation', function() {
		mui.openWindow({
			url: 'CITY_DETAIL.html',
			id: 'PAGE_CITY_DETAIL',
			show: {
				aniShow: 'pop-in',
				duration: 200
			},
			waiting: {
				autoShow: false
			}
		});
	});
}

function getCityWeather(cityStr) {
	//读取当前省市
	mui.ajax(serverAddr + 'weather/recent', {
		data: {
			cityName: cityStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			if (requestData.errNum != 0 || requestData == null) {
				mui.toast('发生未知错误');
			} else {
				weatherDetail(cityStr, requestData.retData);
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得天气信息', '重试', function() {
				getCityWeather(cityStr);
			});
		}
	})
}

function weatherDetail(cityName, resultData) {
	var contentStr = '';
	contentStr +=
		'<div class="mui-row">' +
		'	<div class="mui-col-xs-6">' +
		'		<p class="weather-location">' +
		dealDate() + ' ' + resultData.today.week +
		'		</p>' +
		'	</div>' +
		'	<div class="mui-col-xs-6 align-right">' +
		'		<p class="weather-location" id="changeLocation">' +
		'			<span class="mui-icon iconfont icon-location"></span>' +
		cityName +
		'		</p>' +
		'	</div>' +
		'</div>' +
		dealTodayWeather(resultData.today) +
		dealTodayTips(resultData.today.index) +
		dealForecast(resultData.forecast);
	resultContent.innerHTML = contentStr;
}

function dealDate() {
	var dateStr = '';
	var todayDate = new Date();
	dateStr += todayDate.getMonth() + 1;
	dateStr += '.' + todayDate.getDate();
	return dateStr;
}

function dealTodayWeather(resultData) {
	var contentStr = '';
	contentStr +=
		'<div class="opacity-layer">' +
		'	<div class="mui-row padding-10-l padding-10-r border-b" style="padding-bottom: 2px;">' +
		'		<div class="mui-col-xs-5 font-s18">今日</div>' +
		'		<div class="mui-col-xs-7 font-s18 align-right">' +
		'			<label class="font-s16">空气指数：</label>' +
		checkAQI(resultData.aqi) +
		'		</div>' +
		'	</div>' +
		'	<div class="mui-row padding-5-t">' +
		'		<div class="mui-col-xs-3 align-center">' +
		'			<img src="' + getWeatherSrc(resultData.type) + '" width="80" />' +
		'		</div>' +
		'		<div class="mui-col-xs-9 padding-10-l">' +
		'			<div style="padding-top: 3px;">' +
		'				<label style="font-size: 24px;">' +
		resultData.type +
		'				</label>' +
		'				<label class="font-s16 padding-10-l">' +
		resultData.fengxiang + resultData.fengli +
		'				</label>' +
		'			</div>' +
		'			<div style="font-size: 26px;margin-top: 5px;">' +
		resultData.lowtemp + '~' + resultData.hightemp +
		'			</div>' +
		'			<div style="margin-top: 4px;">' +
		'				<label class="font-s16">当前温度:</label>' +
		'				<label class="font-s18 padding-10-l">' +
		resultData.curTemp +
		'				</label>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'</div>';
	return contentStr;
}

function dealTodayTips(resultData) {
	var contentStr = '';
	contentStr +=
		'<div class="slider-content">' +
		'	<p class="font-s16 remove-margin-b">今日指数</p>';
	for (var i = 0; i < resultData.length; i++) {
		contentStr +=
			'<div class="today-tips">' +
			'	<label class="font-s16">' + resultData[i].name + ':</label>' +
			'	<p>' + resultData[i].details + '</p>' +
			'</div>';
	}
	contentStr +=
		'</div>';
	return contentStr;
}

function dealForecast(resultData) {
	var contentStr = '';
	contentStr +=
		'<div class="slider-content">' +
		'	<p class="font-s16 remove-margin-b border-b">未来四天</p>';
	for (var i = 0; i < resultData.length; i++) {
		contentStr +=
			'<div class="opacity-layer">' +
			'	<div class="font-s16 padding-10-l padding-10-r border-b" style="padding-bottom: 2px;">' +
			resultData[i].week +
			'	</div>' +
			'	<div class="mui-row padding-5-t">' +
			'		<div class="mui-col-xs-3 align-center">' +
			'			<img src="' + getWeatherSrc(resultData[i].type) + '" width="70" />' +
			'		</div>' +
			'		<div class="mui-col-xs-9 padding-10-l">' +
			'			<div style="padding-top: 3px;">' +
			'				<label style="font-size: 20px;">' +
			resultData[i].type +
			'				</label>' +
			'			</div>' +
			'			<div style="font-size: 22px;">' +
			resultData[i].lowtemp + '~' + resultData[i].hightemp +
			'			</div>' +
			'			<div class="font-s16">' +
			resultData[i].fengxiang + resultData[i].fengli +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>';
	}
	contentStr +=
		'</div>';
	return contentStr;
}

function checkAQI(aqiNum) {
	var aqiStr = '';
	if (aqiNum >= 0 && aqiNum <= 50) {
		aqiStr += '<label class="font-s16 aqi-first">' + aqiNum + ' 优</label>';
	} else if (aqiNum > 50 && aqiNum <= 100) {
		aqiStr += '<label class="font-s16 aqi-second">' + aqiNum + ' 良</label>';
	} else if (aqiNum > 100 && aqiNum <= 150) {
		aqiStr += '<label class="font-s16 aqi-third">' + aqiNum + ' 轻度</label>';
	} else if (aqiNum > 150 && aqiNum <= 200) {
		aqiStr += '<label class="font-s16 aqi-forth">' + aqiNum + ' 中度</label>';
	} else if (aqiNum > 200 && aqiNum <= 300) {
		aqiStr += '<label class="font-s16 aqi-fifth">' + aqiNum + ' 重度</label>';
	} else if (aqiNum > 300) {
		aqiStr += '<label class="font-s16 aqi-sixth">' + aqiNum + ' 严重</label>';
	}
	return aqiStr;
}

function getWeatherSrc(typeStr) {
	var returnSrc = '../../res/images/icons/weather/unknown.png';
	var kindList = [];
	var allKind = localStorage.getItem('allKindWeather');
	if (allKind == null || allKind == '[]') {
		mui.toast('天气配置出错');
		return returnSrc;
	}
	kindList = JSON.parse(allKind);
	for (var i = 0; i < kindList.length; i++) {
		if (kindList[i].weatherType == typeStr) {
			returnSrc = '../../' + kindList[i].weatherSrc;
		}
	}
	return returnSrc;
}