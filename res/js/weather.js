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

function setImageSrc(compareElement, elementId) {
	switch (compareElement) {
		case '晴':
			document.getElementById(elementId).src = "res/images/sun.png";
			break;
		case '多云':
			document.getElementById(elementId).src = "../res/images/cloudy.png";
			break;
		case '阴':
			document.getElementById(elementId).src = "../res/images/overcast.png";
			break;
		case '小雨':
			document.getElementById(elementId).src = "../res/images/spitRain.png";
			break;
		case '中雨':
			document.getElementById(elementId).src = "../res/images/moderateRain.png";
			break;
		case '大雨':
			document.getElementById(elementId).src = "../res/images/heavyRain.png";
			break;
		default:
			break;
	}
}

function setBackgroundImage(compareElement, elementId) {
	switch (compareElement) {
		case '阴':
		console.log('here');
			document.getElementById(elementId).style.backgroundImage = "url(res/images/weatherBackgroundOvercast.jpg)";
			break;
		case '雾':
			document.getElementById(elementId).style.backgroundImage = "url(res/images/weatherBackgroundFog.jpg)";
			break;
		case '晴':
			document.getElementById(elementId).style.backgroundImage = "url(res/images/weatherBackgroundSunny.png)";
			break;
		case '多云':
			document.getElementById(elementId).style.backgroundImage = "url(res/images/weatherBackgroundCloudy.jpg)";
			break;
		default:
			break;
	}
}