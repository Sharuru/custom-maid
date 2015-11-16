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

function getWeatherIconSrc(compareElement) {
	switch (compareElement) {
		case '晴':
			return '/res/images/sun.png';
			break;
		case '多云':
			return '/res/images/cloudy.png';
			break;
		case '阴':
			return '/res/images/overcast.png';
			break;
		case '小雨':
			return '/res/images/spitRain.png';
			break;
		case '中雨':
			return '/res/images/moderateRain.png';
			break;
		case '大雨':
			return '/res/images/heavyRain.png';
			break;
		case '阵雨':
			return 'res/images/showerRain.png';
			break;
		default:
			break;
	}
}

function getWeatherBackgroundImageSrc(compareElement) {
	switch (compareElement) {
		case '阴':
			return 'res/images/weatherBackgroundOvercast.jpg';
			break;
		case '雾':
			return 'res/images/weatherBackgroundFog.jpg';
			break;
		case '晴':
			return 'res/images/weatherBackgroundSunny.png';
			break;
		case '多云':
			return 'res/images/weatherBackgroundCloudy.jpg';
			break;
		case '阵雨':
			return 'res/images/weatherBackgroundShower.jpg';
			break;
		default:
			break;
	}
}