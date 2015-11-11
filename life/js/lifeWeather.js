//设置天气信息
function setLifeWeatherInfo() {
	//缓存检测与读取
	console.log('In setLifeWeatherInfo');
		var respObj = window.localStorage.getItem('cachedWeatherInfo');
		console.log(JSON.stringify(respObj));
		lifeWeatherInfoHandler(respObj);
		//mui.toast('天气信息更新完成');
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
	document.getElementById('theDayNowTem').innerText = todayMinTmp + '℃/' + todayMaxTmp + '℃';
	document.getElementById('firstDayAfterTem').innerText = firstDayMinTmp + '℃/' + firstDayMaxTmp + '℃';
	document.getElementById('secondDayAfterTem').innerText = secondDayMinTmp + '℃/' + secondDayMaxTmp + '℃';
	document.getElementById('lastDayAfterTem').innerText = lastDayMinTmp + '℃/' + lastDayMaxTmp + '℃';
	//设置天气小图标
	setLifeWeatherIcon(nowCond,'theDayNowIcon');
	if (d.getHours() < firstDaySS) {
		setLifeWeatherIcon(firstDayCondDay,'firstDayAfterIcon');
	} else {
		setLifeWeatherIcon(firstDayCondNight,'firstDayAfterIcon');
	}
	if (d.getHours() < secondDaySS) {
		setLifeWeatherIcon(secondDayCondDay,'secondDayAfterIcon');
	} else {
		setLifeWeatherIcon(secondDayCondNight,'secondDayAfterIcon');
	}
	if (d.getHours() < lastDaySS) {
		setLifeWeatherIcon(lastDayCondDay,'lastDayAfterIcon');
	} else {
		setLifeWeatherIcon(lastDayCondNight,'lastDayAfterIcon');
	}
	//设置背景图片
	setLifeWeatherBackground(nowCond,'todayWeatherPicture');
}

//设置天气小图标
function setLifeWeatherIcon(cond,eleId){
	document.getElementById(eleId).src = '../' + getWeatherIconSrc(cond);
}

//设置背景图片
function setLifeWeatherBackground(cond, eleId){
	document.getElementById(eleId).style.backgroundImage = 'url(../' + getWeatherBackgroundImageSrc(cond)+')'
}