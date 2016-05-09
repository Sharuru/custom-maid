function initIndex() {
	setIndexInfo();
	mui('#moduleList').on('tap', 'a', function() {
		var moduleId = this.getAttribute('id').substr(5);
		if (moduleId == 'SH002' || moduleId == 'SH003' || moduleId == 'SH004' || moduleId == 'SH005') {
			var rangeData = document.getElementById('rangeObj').value + '000';
			mui.openWindow({
				url: 'modules/' + moduleId + '/' + moduleId + '.html',
				id: 'PAGE_' + moduleId,
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					dataObj: rangeData
				},
				waiting: {
					//取消加载动画，模拟原生感
					autoShow: false
				}
			});
		} else {
			mui.openWindow({
				url: 'modules/' + moduleId + '/' + moduleId + '.html',
				id: 'PAGE_' + moduleId,
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				waiting: {
					//取消加载动画，模拟原生感
					autoShow: false
				}
			});
		}
	});

	mui('.mui-input-range').on('change', 'input', function() {
		document.getElementById('rangeValue').innerHTML = document.getElementById('rangeObj').value;
	});

	mui('.module-background').on('tap', '#lifeSearch', function() {
		var searchStr = document.getElementById('inputStr').value;
		if (searchStr == '') {
			mui.toast('未输入关键字');
			return;
		}
		var rangeData = document.getElementById('rangeObj').value + '000';
		mui.openWindow({
			url: 'modules/SH006/SH006.html',
			id: 'PAGE_SH006',
			show: {
				aniShow: 'pop-in',
				duration: 200
			},
			extras: {
				dataObj: rangeData,
				searchKey: searchStr
			},
			waiting: {
				//取消加载动画，模拟原生感
				autoShow: false
			}
		});
	});
}

function setIndexInfo() {
	//读取当前省市
	var localStorage = window.localStorage;
	var currProvince = localStorage.getItem('province');
	console.log(currProvince);
	//上报获得天气信息
	mui.ajax(serverAddr + 'weather/recent', {
		data: {
			cityName: currProvince
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为 10 秒；
		success: function(data) {
			//本地保存结果
			//TODO: 本地缓存
			localStorage.setItem('weatherJson', JSON.stringify(data));
			console.log('Weather json: ' + JSON.stringify(data));
			//TODO： 省市覆盖
			localStorage.setItem('province', data.retData.city);
			localStorage.setItem('cityId', data.retData.cityid);
			//赋值
			//设置定位城市信息
			document.getElementById('locationCity').innerHTML = localStorage.getItem('province');
			var contentStr = '';
			//设置今日日期信息
			var dateStr = setDateTimeHeader();
			contentStr +=
				'<div class="font-s18">' + dateStr + '</div>' +
				//设置今日天气信息
				'<div class="weather-info">' +
				'	<div class="today-weather">' +
				'		<div class="today-weather-pic">' +
				'			<img src="' + getWeatherSrc(data.retData.today.type) + '" width="100%" />' +
				'		</div>' +
				'		<div class="today-weather-data">' +
				'			<p class="today-current-temp">' + data.retData.today.curTemp + '</p>' +
				'			<p class="today-base-info">' +
				data.retData.today.lowtemp + '~' + data.retData.today.hightemp +
				'			</p>' +
				'			<p class="today-base-info">' + data.retData.today.type + '</p>' +
				'		</div>' +
				'	</div>' +
				//设置预报天气信息 
				//+1
				'	<div class="other-weather">' +
				'		<div class="other-weather-block">' +
				'			<p class="other-info padding-5">' + data.retData.forecast[2].week + '</p>' +
				'			<div class="other-weather-pic">' +
				'				<img src="' + getWeatherSrc(data.retData.forecast[2].type) + '" width="26" />' +
				'			</div>' +
				'			<p class="other-info">' +
				data.retData.forecast[2].lowtemp + '~' + data.retData.forecast[2].hightemp +
				'			</p>' +
				'		</div>' +
				//+2
				'		<div class="other-weather-block">' +
				'			<p class="other-info padding-5">' + data.retData.forecast[1].week + '</p>' +
				'			<div class="other-weather-pic">' +
				'				<img src="' + getWeatherSrc(data.retData.forecast[1].type) + '" width="26" />' +
				'			</div>' +
				'			<p class="other-info">' +
				data.retData.forecast[1].lowtemp + '~' + data.retData.forecast[1].hightemp +
				'			</p>' +
				'		</div>' +
				//+3
				'		<div class="other-weather-block">' +
				'			<p class="other-info padding-5">' + data.retData.forecast[0].week + '</p>' +
				'			<div class="other-weather-pic">' +
				'				<img src="' + getWeatherSrc(data.retData.forecast[0].type) + '" width="26" />' +
				'			</div>' +
				'			<p class="other-info">' +
				data.retData.forecast[0].lowtemp + '~' + data.retData.forecast[0].hightemp +
				'			</p>' +
				'		</div>' +
				'	</div>' +
				'</div>';
			//设置更新时间
			var d = new Date();
			var nowHours = d.getHours();
			var nowMinutes = d.getMinutes();
			//Trim
			if (nowHours < 10) {
				nowHours = '0' + nowHours;
			}
			if (nowMinutes < 10) {
				nowMinutes = '0' + nowMinutes;
			}
			contentStr +=
				'<div class="update-time">更新时间' +
				'	<label class="padding-10-l">' +
				nowHours + ':' + nowMinutes +
				'	</label>' +
				'</div>';
			contentStr = '<div class="base-info">' + contentStr + '</div>';
			document.getElementById('weatherBase').innerHTML = contentStr;
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得天气信息', '重试', function() {
				setIndexInfo();
			});
		}
	});
}

function setDateTimeHeader() {
	//声明 Date Object
	var d = new Date();
	//拼接日期字符串
	//拼接年
	var dateString = d.getFullYear() + '.';
	//拼接月
	dateString += d.getMonth() + 1;
	//拼接日
	dateString += '.' + d.getDate();
	//拼接星期
	dateString += ' 星期' + '天一二三四五六'.charAt(d.getDay());
	return dateString;
}

function getWeatherSrc(typeStr) {
	var returnSrc = 'res/images/icons/weather/unknown.png';
	var kindList = [];
	var allKind = localStorage.getItem('allKindWeather');
	if (allKind == null || allKind == '[]') {
		mui.toast('天气配置出错');
		return returnSrc;
	}
	kindList = JSON.parse(allKind);
	for (var i = 0; i < kindList.length; i++) {
		if (kindList[i].weatherType == typeStr) {
			returnSrc = kindList[i].weatherSrc;
		}
	}
	return returnSrc;
}