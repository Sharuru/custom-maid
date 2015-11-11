//进入 APP 时初始化操作
function appInitialize() {
	var localStorage = window.localStorage;
	if (localStorage.getItem("isFirstRun") == "0") {
		//再次打开
		console.log('Welcome back');
		mui.toast('お帰りなさいご主人様');
	} else {
		//初次安装设置配置缓存
		console.log('First run, creating file');
		mui.toast('初めまして');
		localStorage.setItem('isFirstRun', '0');
		//设置 API key
		//天气 API key
		localStorage.setItem('weatherAPIKey', 'ffeb476b3fe24929959cfadd168fdf1d');
		//百度 API key
		localStorage.setItem('baiduAPIKey', 'Wikpdmp0xVzHMSDYjQ5arfAi');

	}
}

//根据 index 获取对应 API
function getAPIKey(index) {
	return window.localStorage.getItem(index);
}

function getJsonObj(reqUrl) {
	mui.ajax(reqUrl, {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		async: false,
		timeout: 5000, //超时时间设置为5秒；
		success: function(data) {
			console.log("Get json: " + JSON.stringify(data));
			returnData = data;
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log('Err: ' + type);
		}
	});
	return returnData;
}

//获得本地天气信息
function getIndexWeatherInfo() {
	var localStorage = window.localStorage;
	if (localStorage.getItem('cachedWeatherInfo') != null) {
		//本地存在缓存天气记录
		console.log('Weather info have cache.');
		//取出记录
		var localObj = localStorage.getItem('cachedWeatherInfo')
		var updateObj;
		var cleanStr = JSON.stringify(localObj).replace(/\\/g, '');
		cleanStr = cleanStr.substr(1, cleanStr.length - 2);
		var cleanObj = JSON.parse(cleanStr);
		var d = new Date();
		var updateUTCTimeStamp = parseInt(Date.parse(new Date(cleanObj['HeWeather data service 3.0'][0].basic.update.utc)));
		var localUTCTime = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate() + ' ' + d.getUTCHours() + ':' + d.getUTCMinutes();
		var localUTCTimeStamp = parseInt(Date.parse(localUTCTime));
		if (localUTCTimeStamp > (updateUTCTimeStamp + 3600000)) {
			updateObj = updateIndexWeatherInfo();
			return updateObj;
		} else {
			console.log('Do with cache')
			return cleanObj;
		}
	} else {
		updateObj = updateIndexWeatherInfo();
		return updateObj;
	}
}

function getLocation() {
	//TODO: 虚拟机调试不能使用百度 SDK 应当使用 GPS 模拟
	// 使用百度地图地位模块获取位置信息
	//	plus.geolocation.getCurrentPosition(function(p) {
	//		alert("B-Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude);
	//	}, function(e) {
	//		alert("B-Geolocation error: " + e.message);
	//	}, {
	//		provider: 'baidu'
	//	});
	plus.geolocation.getCurrentPosition(function(p) {
		alert("B-Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude);
		return p.coords.latitude + ',' + p.coords.longitude;
	}, function(e) {
		alert("B-Geolocation error: " + e.message);
	});

}