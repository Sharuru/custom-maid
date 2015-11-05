function appInitialize() {
	var localStorage = window.localStorage;
	if (localStorage.getItem("isFirstRun") == "0") {
		console.log("Welcome back");
	} else {
		console.log("First run, creating file");
		localStorage.setItem("isFirstRun", "0");
		//设置 API key
		localStorage.setItem("weatherAPIKey", "96d701108326a3e0447fb0008cf526a9");
	}
}

function getJson(reqUrl) {
	mui.ajax('https://api.heweather.com/x3/weather?city=shanghai&key=ffeb476b3fe24929959cfadd168fdf1d', {
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		success: function(data) {
			console.log("String --> " + JSON.stringify(data));
			console.log(data['HeWeather data service 3.0'][0].aqi.city.aqi);
//			mui.each(data, function(index, item) {
//				console.log(item[0].aqi);
//			})
		},
		error: function(data) {
			console.log('err');
		}
	});
	console.log("CPL");
}