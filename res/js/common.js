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