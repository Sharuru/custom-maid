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