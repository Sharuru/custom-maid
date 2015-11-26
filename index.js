//主页加载后设置各个元素
function initialize() {
	console.log("Setting landing page...");
	//设置顶部导航栏日期
	setDateTimeHeader();
	//设置顶部地理位置
	setLocationHeader();
	//设置首页天气信息
	setIndexWeather();
}

function setDateTimeHeader() {
	//声明 Date Object
	var d = new Date();
	//拼接日期字符串
	//拼接月
	var dateString = d.getMonth() + 1 + "月";
	//拼接日
	dateString += d.getDate() + "日";
	//拼接星期
	dateString += " 星期" + "日一二三四五六".charAt(d.getDay());
	//赋值
	document.getElementById('headerDate').innerText = dateString
}

function setLocationHeader() {
	//获得地理位置
	var fakeLocation = "31.12345,121.54321";
	//上报获取省市名
	mui.ajax('http://192.157.231.72:8080/MaidGuild/initialize/modules', {
		data: {
			location: fakeLocation
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 5000, //超时时间设置为 5 秒；
		success: function(data) {
			//本地保存结果
			var localStorage = window.localStorage;
			localStorage.setItem("province", data.province);
			localStorage.setItem("modules", data.avalModuleList);
			//赋值
			document.getElementById('headerLoaction').innerHTML = localStorage.getItem("province");
			console.log("Modules: " + localStorage.getItem("modules"));
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert("在连接服务器时发生异常");
		}
	});
}

function setIndexWeather() {
	//读取当前省市
	var localStorage = window.localStorage;
	var currProvince = localStorage.getItem("province");
	//上报获得天气信息
	mui.ajax('http://192.157.231.72:8080/MaidGuild/weather/recent', {
		data: {
			cityName : currProvince
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 5000, //超时时间设置为 5 秒；
		success: function(data) {
			//本地保存结果
			//TODO: 本地缓存
			localStorage.setItem("weatherJson", JSON.stringify(data));
			console.log("Weather json: " + localStorage.getItem("weatherJson"));
			//赋值
			document.getElementById('todayCurrWeatherTemp').innerText = data.retData.today.curTemp;
			document.getElementById('todayWeatherTempRange').innerText = data.retData.today.lowtemp + "~" +data.retData.today.hightemp;
			document.getElementById('todayWeatherType').innerText = data.retData.today.type;
//			document.getElementById('headerLoaction').innerHTML = localStorage.getItem("province");
//			console.log("Modules: " + localStorage.getItem("modules"));
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert("在连接服务器时发生异常");
		}
	});


}