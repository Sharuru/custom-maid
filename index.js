//设置首页天气信息
function setIndexWeatherInfo() {
	console.log('In setIndexWeatherInfo');
	var localStorage = window.localStorage;
	if (localStorage.getItem('cachedWeatherInfo') != null) {
		//本地存在缓存天气记录
		console.log('Weather info have cache.');
		//取出记录
		var localObj = localStorage.getItem('cachedWeatherInfo');
		var cleanStr = JSON.stringify(localObj).replace(/\\/g, '');
		cleanStr = cleanStr.substr(1, cleanStr.length - 2);
		var cleanObj = JSON.parse(cleanStr);
		//比对 UTC 时间进行更新检测
		//获得缓存 UTC 时间
		var cachedUTC = cleanObj['HeWeather data service 3.0'][0].basic.update.utc;
		//解析缓存 UTC 时间
		var cacheUTCDay = cachedUTC.substr(8,2);
		var cacheUTCHour = cachedUTC.substr(10,2);
		//获得本地 UTC 时间
		var d = new Date();
		var localUTCDay = d.getUTCDate();
		//补足两位数
		if(localUTCDay < 10){
			localUTCDay = '0' + localUTCDay;
		}
		var localUTCHour = d.getUTCHours();
		//补足两位数
		if(localUTCHour < 10){
			localUTCHour = '0' + localUTCHour;
		}		
	} else {
		console.log('Weather info need update');
		//mui.toast('Updating weather info...');
		//需要更新天气信息的场合
		//城市硬编码
		var respObj = getWeatherInfo('shanghai');
		//成功获得结果
		if (respObj['HeWeather data service 3.0'][0].status == 'ok') {
			indexWeatherInfoHandler(respObj);
			mui.toast('天气信息更新完成');
			//写入本地缓存
			localStorage.setItem('cachedWeatherInfo', JSON.stringify(respObj, '123'));
		} else {
			mui.toast('天气信息获取失败！');
		}
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
	switch (nowCond) {
		case '阴':
			document.getElementById('todayWeatherDetail').style.backgroundImage = "url(res/images/weatherBackgroundOvercast.jpg)";
			break;
		case '雾':
			document.getElementById('todayWeatherDetail').style.backgroundImage = "url(res/images/weatherBackgroundFog.jpg)";
			break;
		case '晴':
			document.getElementById('todayWeatherDetail').style.backgroundImage = "url(res/images/weatherBackgroundSunny.png)";
			break;
		case '多云':
			document.getElementById('todayWeatherDetail').style.backgroundImage = "url(res/images/weatherBackgroundCloudy.jpg)";
			break;
		default:
			break;
	}
}

function getLocation() {
	// 使用百度地图地位模块获取位置信息
	plus.geolocation.getCurrentPosition(function(p) {
		alert("B-Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude);
	}, function(e) {
		alert("B-Geolocation error: " + e.message);
	}, {
		provider: 'baidu'
	});
}

function afterLoad() {
	console.log("当前页面URL：" + plus.webview.currentWebview().getURL());
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	//检测是否首次启动程序
	appInitialize();
	//设置首页天气信息
	setIndexWeatherInfo();
	//页面加载完毕后绑定事件
	document.getElementById('btnGetLocation').addEventListener('tap', function() {
		getLocation();
	});
	document.getElementById('navLifeDiv').addEventListener('tap', function() {
		mui.openWindow({
			url: 'life/lifeMain.html',
			id: 'lifeMain',
			extras: {
				passNowCond: '今日天气：' + document.getElementById('nowCond').innerText,
				passTodayTmp: '温度：' + document.getElementById('todayTmp').innerText,
				passNowWind: '风向:' + document.getElementById('nowWind').innerText
			}
		});
	});
	document.getElementById('navTravelDiv').addEventListener('tap', function() {
		mui.openWindow({
			url: 'outing/outingMain.html',
			id: 'outgingMain'
		});
	});
	document.getElementById('navFinanceDiv').addEventListener('tap', function() {
		mui.openWindow({
			url: 'finance/financeMain.html',
			id: 'financeMain'
		});
	});
	//禁止滚动
	window.addEventListener('tap', function() {
		mui('#maidContent').scroll().setStopped(true); //暂时禁止滚动
		var webview = plus.webview.currentWebview();
	});
	//首页返回键处理
	//处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		if (!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if (new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	};
}