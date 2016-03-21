function initIndex(){
	setIndexInfo();
	mui('#moduleList').on('tap', 'a', function() {
		var moduleId = this.getAttribute("id").substr(5);
		mui.openWindow({
			url: 'modules/' + moduleId + '/' + moduleId + '.html',
			id: 'PAGE_' + moduleId,
			show: {
				aniShow: "pop-in",
				duration: 200
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
	var currProvince = localStorage.getItem("province");
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
			localStorage.setItem("weatherJson", JSON.stringify(data));
			console.log("Weather json: " + JSON.stringify(data));
			//TODO： 省市覆盖
			localStorage.setItem('province', data.retData.city);
			localStorage.setItem('cityId', data.retData.cityid);
			//赋值
			//设置定位城市信息
			document.getElementById('locationCity').innerHTML = localStorage.getItem("province");
			var contentStr = '';
			//设置今日日期信息
			var dateStr = setDateTimeHeader();
			contentStr += '<div class="font-w300-s18 color-white">' + dateStr + '</div>';
			//设置今日天气信息
			contentStr += '<div class="weather-info"><div class="today-weather"><div class="today-weather-pic">';
			contentStr += '<img src="' + localStorage.getItem(data.retData.today.type) + '" width="50" />';
			contentStr += '</div><div class="today-weather-data">';
			contentStr += '<p class="today-current-temp">' + data.retData.today.curTemp + '</p>';
			contentStr += '<p class="today-base-info">' + data.retData.today.lowtemp + '~' + data.retData.today.hightemp + '</p>';
			contentStr += '<p class="today-base-info">' + data.retData.today.type + '</p></div></div>';
			//设置预报天气信息 
			//+1
			contentStr += '<div class="other-weather"><div class="other-weather-block">';
			contentStr += '<p class="other-info padding-5">' + data.retData.forecast[0].week + '</p>';
			contentStr += '<div class="other-weather-pic">';
			contentStr += '<img src="' + localStorage.getItem(data.retData.forecast[0].type) + '" width="25" /></div>';
			contentStr += '<p class="other-info">' + data.retData.forecast[0].lowtemp + '~' + data.retData.forecast[0].hightemp;
			//+2
			contentStr += '</p></div><div class="other-weather-block">';
			contentStr += '<p class="other-info padding-5">' + data.retData.forecast[1].week + '</p>';
			contentStr += '<div class="other-weather-pic">';
			contentStr += '<img src="' + localStorage.getItem(data.retData.forecast[1].type) + '" width="25" /></div>';
			contentStr += '<p class="other-info">' + data.retData.forecast[1].lowtemp + '~' + data.retData.forecast[1].hightemp;
			//+3
			contentStr += '</p></div><div class="other-weather-block">';
			contentStr += '<p class="other-info padding-5">' + data.retData.forecast[2].week + '</p>';
			contentStr += '<div class="other-weather-pic">';
			contentStr += '<img src="' + localStorage.getItem(data.retData.forecast[2].type) + '" width="25" /></div>';
			contentStr += '<p class="other-info">' + data.retData.forecast[2].lowtemp + '~' + data.retData.forecast[2].hightemp;
			contentStr += '</p></div></div></div>';
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
			contentStr += '<div class="update-time">更新时间<label class="padding-10-l">';
			contentStr += nowHours + ':' + nowMinutes + '</label></div>';
			contentStr = '<div class="base-info">' + contentStr + '</div>';
			document.getElementById('indexBase').innerHTML = contentStr;
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
	dateString += d.getMonth() + 1 + '.';
	//拼接日
	dateString += d.getDate();
	//拼接星期
	dateString += " 星期" + "天一二三四五六".charAt(d.getDay());
	return dateString;
}