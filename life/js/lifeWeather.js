//设置天气信息
function setLifeWeatherInfo() {
	console.log('In setLifeWeatherInfo');
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
	//mui.toast('Updating weather info...');
	//需要更新天气信息的场合
	//城市硬编码
	var respObj = getWeatherInfo('shanghai');
	//成功获得结果
	if (respObj['HeWeather data service 3.0'][0].status == 'ok') {
		lifeWeatherInfoHandler(respObj);
		mui.toast('天气信息更新完成');
		//写入本地缓存
		//localStorage.setItem('cachedWeatherInfo', JSON.stringify(respObj, '123'));
	} else {
		mui.toast('天气信息获取失败！');
		//		}
	}
}

function lifeWeatherInfoHandler(jsonObj) {
	//获得指定数据
	var updateTime = jsonObj['HeWeather data service 3.0'][0].basic.update.loc;
	var nowTmp = jsonObj['HeWeather data service 3.0'][0].now.tmp;
	var todayMinTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[0].tmp.min;
	var todayMaxTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[0].tmp.max;
	var nowCond = jsonObj['HeWeather data service 3.0'][0].now.cond.txt;
	var nowWind = jsonObj['HeWeather data service 3.0'][0].now.wind.dir;
	var nowWindSc = jsonObj['HeWeather data service 3.0'][0].now.wind.sc;
	var nowHum = jsonObj['HeWeather data service 3.0'][0].now.hum;
	var firstDaySS = jsonObj['HeWeather data service 3.0'][0].daily_forecast[1].astro.ss;
	var secondDaySS = jsonObj['HeWeather data service 3.0'][0].daily_forecast[2].astro.ss;
	var lastDaySS = jsonObj['HeWeather data service 3.0'][0].daily_forecast[3].astro.ss;
	var firstDayCondDay = jsonObj['HeWeather data service 3.0'][0].daily_forecast[1].cond.txt_d;
	var firstDayCondNight = jsonObj['HeWeather data service 3.0'][0].daily_forecast[1].cond.txt_n;
	var secondDayCondDay = jsonObj['HeWeather data service 3.0'][0].daily_forecast[2].cond.txt_d;
	var secondDayCondNight = jsonObj['HeWeather data service 3.0'][0].daily_forecast[2].cond.txt_n;
	var lastDayCondDay = jsonObj['HeWeather data service 3.0'][0].daily_forecast[3].cond.txt_d;
	var lastDayCondNight = jsonObj['HeWeather data service 3.0'][0].daily_forecast[3].cond.txt_n;
	var firstDayMaxTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[1].tmp.max;
	var firstDayMinTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[1].tmp.min;
	var secondDayMaxTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[2].tmp.max;
	var secondDayMinTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[2].tmp.min;
	var lastDayMaxTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[3].tmp.max;
	var lastDayMinTmp = jsonObj['HeWeather data service 3.0'][0].daily_forecast[3].tmp.min;

	firstDaySS = firstDaySS.substring(0, 2);
	secondDaySS = secondDaySS.substring(0, 2);
	lastDaySS = lastDaySS.substring(0, 2);

	//设置画面信息
	var d = new Date();
	document.getElementById('nowTmp').innerText = nowTmp + '℃';
	document.getElementById('todayTmp').innerText = todayMinTmp + '℃/' + todayMaxTmp + '℃';
	document.getElementById('nowCond').innerText = nowCond;
	document.getElementById('today').innerText = getWeekday(d.getDay()) + ' ' + (d.getMonth() + 1) + '/' + d.getDate();
	document.getElementById('nowWind').innerText = nowWind + ' ' + nowWindSc + '级';
	document.getElementById('nowHum').innerText = '湿度：' + nowHum + '%';
	document.getElementById('updateTime').innerText = '和风天气	更新时间：' + updateTime;
	document.getElementById('theDayNow').innerText = getWeekday(d.getDay());
	document.getElementById('firstDayAfter').innerText = getWeekday(d.getDay() + 1);
	document.getElementById('secondDayAfter').innerText = getWeekday(d.getDay() + 2);
	document.getElementById('lastDayAfter').innerText = getWeekday(d.getDay() + 3);
	document.getElementById('theDayNowIconTem').innerText = todayMinTmp + '℃/' + todayMaxTmp + '℃';
	document.getElementById('firstDayAfterIconTem').innerText = firstDayMinTmp + '℃/' + firstDayMaxTmp + '℃';
	document.getElementById('secondDayAfterIconTem').innerText = secondDayMinTmp + '℃/' + secondDayMaxTmp + '℃';
	document.getElementById('lastDayAfterIconTem').innerText = lastDayMinTmp + '℃/' + lastDayMaxTmp + '℃';
	switch (nowCond) {
		case '晴':
			document.getElementById('theDayNowIcon').src = "../res/images/sun.png";
			break;
		case '多云':
			document.getElementById('theDayNowIcon').src = "../res/images/cloudy.png";
			break;
		case '阴':
			document.getElementById('theDayNowIcon').src = "../res/images/overcast.png";
			break;
		case '小雨':
			document.getElementById('theDayNowIcon').src = "../res/images/spitRain.png";
			break;
		case '中雨':
			document.getElementById('theDayNowIcon').src = "../res/images/moderateRain.png";
			break;
		case '大雨':
			document.getElementById('theDayNowIcon').src = "../res/images/heavyRain.png";
			break;
		default:
			break;
	}
	if (d.getHours() < firstDaySS) {
		switch (firstDayCondDay) {
			case '晴':
				document.getElementById('firstDayAfterIcon').src = "../res/images/sun.png";
				break;
			case '多云':
				document.getElementById('firstDayAfterIcon').src = "../res/images/cloudy.png";
				break;
			case '阴':
				document.getElementById('firstDayAfterIcon').src = "../res/images/overcast.png";
				break;
			case '小雨':
				document.getElementById('firstDayAfterIcon').src = "../res/images/spitRain.png";
				break;
			case '中雨':
				document.getElementById('firstDayAfterIcon').src = "../res/images/moderateRain.png";
				break;
			case '大雨':
				document.getElementById('firstDayAfterIcon').src = "../res/images/heavyRain.png";
				break;
			default:
				break;
		}
	} else {
		switch (firstDayCondNight) {
			case '晴':
				document.getElementById('firstDayAfterIcon').src = "../res/images/sun.png";
				break;
			case '多云':
				document.getElementById('firstDayAfterIcon').src = "../res/images/cloudy.png";
				break;
			case '阴':
				document.getElementById('firstDayAfterIcon').src = "../res/images/overcast.png";
				break;
			case '小雨':
				document.getElementById('firstDayAfterIcon').src = "../res/images/spitRain.png";
				break;
			case '中雨':
				document.getElementById('firstDayAfterIcon').src = "../res/images/moderateRain.png";
				break;
			case '大雨':
				document.getElementById('firstDayAfterIcon').src = "../res/images/heavyRain.png";
				break;
			default:
				break;
		}
	}
	if (d.getHours() < secondDaySS) {
		switch (secondDayCondDay) {
			case '晴':
				document.getElementById('secondDayAfterIcon').src = "../res/images/sun.png";
				break;
			case '多云':
				document.getElementById('secondDayAfterIcon').src = "../res/images/cloudy.png";
				break;
			case '阴':
				document.getElementById('secondDayAfterIcon').src = "../res/images/overcast.png";
				break;
			case '小雨':
				document.getElementById('secondDayAfterIcon').src = "../res/images/spitRain.png";
				break;
			case '中雨':
				document.getElementById('secondDayAfterIcon').src = "../res/images/moderateRain.png";
				break;
			case '大雨':
				document.getElementById('secondDayAfterIcon').src = "../res/images/heavyRain.png";
				break;
			default:
				break;
		}
	} else {
		switch (secondDayCondNight) {
			case '晴':
				document.getElementById('secondDayAfterIcon').src = "../res/images/sun.png";
				break;
			case '多云':
				document.getElementById('secondDayAfterIcon').src = "../res/images/cloudy.png";
				break;
			case '阴':
				document.getElementById('secondDayAfterIcon').src = "../res/images/overcast.png";
				break;
			case '小雨':
				document.getElementById('secondDayAfterIcon').src = "../res/images/spitRain.png";
				break;
			case '中雨':
				document.getElementById('secondDayAfterIcon').src = "../res/images/moderateRain.png";
				break;
			case '大雨':
				document.getElementById('secondDayAfterIcon').src = "../res/images/heavyRain.png";
				break;
			default:
				break;
		}
	}
	if (d.getHours() < lastDaySS) {
		switch (lastDayCondDay) {
			case '晴':
				document.getElementById('lastDayAfterIcon').src = "../res/images/sun.png";
				break;
			case '多云':
				document.getElementById('lastDayAfterIcon').src = "../res/images/cloudy.png";
				break;
			case '阴':
				document.getElementById('lastDayAfterIcon').src = "../res/images/overcast.png";
				break;
			case '小雨':
				document.getElementById('lastDayAfterIcon').src = "../res/images/spitRain.png";
				break;
			case '中雨':
				document.getElementById('lastDayAfterIcon').src = "../res/images/moderateRain.png";
				break;
			case '大雨':
				document.getElementById('lastDayAfterIcon').src = "../res/images/heavyRain.png";
				break;
			default:
				break;
		}
	} else {
		switch (lastDayCondNight) {
			case '晴':
				document.getElementById('lastDayAfterIcon').src = "../res/images/sun.png";
				break;
			case '多云':
				document.getElementById('lastDayAfterIcon').src = "../res/images/cloudy.png";
				break;
			case '阴':
				document.getElementById('lastDayAfterIcon').src = "../res/images/overcast.png";
				break;
			case '小雨':
				document.getElementById('lastDayAfterIcon').src = "../res/images/spitRain.png";
				break;
			case '中雨':
				document.getElementById('lastDayAfterIcon').src = "../res/images/moderateRain.png";
				break;
			case '大雨':
				document.getElementById('lastDayAfterIcon').src = "../res/images/heavyRain.png";
				break;
			default:
				break;
		}
	}
	//设置背景图片
	switch (nowCond) {
		case '阴':
			document.getElementById('todayWeatherDetail').style.backgroundImage = "url(res/images/weatherBackgroundOvercast.jpg)";
			break;
		case '雾':
			document.getElementById('todayWeatherDetail').style.backgroundImage = "url(res/images/weatherBackgroundFog.jpg)";
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
	if (day > 6) {
		day = day - 7;
	}
	var weekDays = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
	return weekDays[day];
}