//设置首页天气信息
function setIndexWeatherInfo() {
	console.log('In setIndexWeatherInfo');
	//var localStorage = window.localStorage;
	//	if (localStorage.getItem('cachedWeatherInfo') != null) {
	//		//本地存在缓存天气记录
	//		console.log('Weather info have cache.');
	//		//取出记录
	//		var localObj = localStorage.getItem('cachedWeatherInfo');
	//		var cleanStr = JSON.stringify(localObj).replace(/\\/g, '');
	//		cleanStr = cleanStr.substr(1, cleanStr.length - 2)
	//		
	//		var cleanObj = JSON.parse(cleanStr);
	//		//比对 UTC 时间进行更新检测
	//		//获得缓存 UTC 时间
	//		var cachedUTC = cleanObj['HeWeather data service 3.0'][0].basic.update.utc;
	//		var cachedUTCDay = cachedUTC
	//		if()
	//		indexWeatherInfoHandler(cleanObj);
	//		
	//	} else {
	console.log('Weather info need update');
	mui.toast('Updating weather info...');
	//需要更新天气信息的场合
	//城市硬编码
	var respObj = getWeatherInfo('shanghai');
	//成功获得结果
	if (respObj['HeWeather data service 3.0'][0].status == 'ok') {
		indexWeatherInfoHandler(respObj);
		mui.toast('Updating weather complete.');
		//写入本地缓存
		//localStorage.setItem('cachedWeatherInfo', JSON.stringify(respObj, '123'));
	} else {
		mui.toast('天气信息获取失败！');
		//		}
	}
}

function indexWeatherInfoHandler(jsonObj) {
	//获得指定数据
	var updateTime = jsonObj['HeWeather data service 3.0'][0].basic.update.loc;
	var nowTmp = jsonObj['HeWeather data service 3.0'][0].now.tmp;
	var todayMinTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[0].tmp.min;
	var todayMaxTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[0].tmp.max;
	var nowCond = jsonObj['HeWeather data service 3.0'][0].now.cond.txt;
	var nowWind = jsonObj['HeWeather data service 3.0'][0].now.wind.dir;
	var nowWindSc = jsonObj['HeWeather data service 3.0'][0].now.wind.sc;
	var nowHum = jsonObj['HeWeather data service 3.0'][0].now.hum;
	var todayPm25 = jsonObj['HeWeather data service 3.0'][0].aqi.city.pm25;
	var todayQlty = jsonObj['HeWeather data service 3.0'][0].aqi.city.qlty;
	//设置画面信息
	var d = new Date();
	document.getElementById('nowTmp').innerText = nowTmp + '℃';
	document.getElementById('todayTmp').innerText = todayMinTmp + '℃-' + todayMaxTmp + '℃';
	document.getElementById('nowCond').innerText = nowCond;
	document.getElementById('today').innerText = getWeekday(d.getDay()) + ' ' + (d.getMonth() + 1) + '/' + d.getDate();
	document.getElementById('nowWind').innerText = nowWind + ' ' + nowWindSc + '级';
	document.getElementById('nowHum').innerText = '湿度：' + nowHum + '%';
	document.getElementById('todayQlty').innerText = todayQlty;
	document.getElementById('todayPm25').innerText = todayPm25;
	document.getElementById('updateTime').innerText = '更新时间：' + updateTime;
	//设置背景图片
	switch (nowCond){
		case '阴':
			document.getElementById('todayWeatherDetail').style.backgroundImage="url(res/images/weatherBackgroundOvercast.jpg)";
			break;
		case '雾':
			document.getElementById('todayWeatherDetail').style.backgroundImage="url(res/images/weatherBackgroundFog.jpg)";
			break;
		default:
			break;
	}
}

//获取天气信息
function getWeatherInfo(reqCity) {
	//拼接请求地址
	var reqUrl = 'https://api.heweather.com/x3/weather?city=' + reqCity + '&key=' + getAPIKey('weatherAPIKey');
	return getJsonObj(reqUrl);
}

// 获得星期
function getWeekday(day) {
	var weekDays = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
	return weekDays[day];
}