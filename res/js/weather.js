//设置首页天气信息
function setIndexWeatherInfo() {
	console.log('In setIndexWeatherInfo');
	var localStorage = window.localStorage;
	if (localStorage.getItem('cachedWeatherInfo') != null) {
		//本地存在缓存天气记录
		console.log('Weather info have cache.');
		//TODO 比对 UTC 时间进行更新检测
	} else {
		console.log('Weather info need update');
		//需要更新天气信息的场合
		//城市硬编码
		var respObj = getWeatherInfo('shanghai');
		console.log('Get weather json: ' + JSON.stringify(respObj));
		//获得指定数据
		var nowTmp = respObj['HeWeather data service 3.0'][0].now.tmp;
		var todayMinTmp = respObj['HeWeather data service 3.0'][0].daily_forecast[0].tmp.min;
		var todayMaxTmp = respObj['HeWeather data service 3.0'][0].daily_forecast[0].tmp.max;
		var nowCond = respObj['HeWeather data service 3.0'][0].now.cond.txt;
		var nowWind = respObj['HeWeather data service 3.0'][0].now.wind.dir;
		var nowHum = respObj['HeWeather data service 3.0'][0].now.hum;
		var todayPm25 = respObj['HeWeather data service 3.0'][0].aqi.city.pm25;
		var todayQlty = respObj['HeWeather data service 3.0'][0].aqi.city.qlty;
		//设置画面
		var d = new Date();
		document.getElementById('nowTmp').innerText = nowTmp + '℃';
		document.getElementById('todayTmp').innerText = todayMinTmp + '℃/' + todayMaxTmp + '℃';
		document.getElementById('nowCond').innerText = nowCond;
		document.getElementById('today').innerText = getWeekday(d.getDay()) + ' ' +  (d.getMonth()+1) + '/' + d.getDate();
		document.getElementById('nowWind').innerText = nowWind;
		document.getElementById('nowHum').innerText = '湿度：' + nowHum + '%';
		document.getElementById('todayQlty').innerText = todayQlty;
		document.getElementById('todayPm25').innerText = todayPm25;
	
	}
}

//获取天气信息
function getWeatherInfo(reqCity) {
	//拼接请求地址
	var reqUrl = 'https://api.heweather.com/x3/weather?city=' + reqCity + '&key=' + getAPIKey('weatherAPIKey');
	return getJsonObj(reqUrl);
}

// 获得星期
function getWeekday(day){
	var weekDays = new Array(7);
	weekDays[0] = "周日";
	weekDays[1] = "周一";
	weekDays[2] = "周二";
	weekDays[3] = "周三";
	weekDays[4] = "周四";
	weekDays[5] = "周五";
	weekDays[6] = "周六";
	return weekDays[day];
}