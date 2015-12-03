//主页加载后设置各个元素
function initialize() {
	console.log("Setting landing page...");
	//初次运行检查
	checkIsFirstRun(setDateTimeHeader);	
//	//设置顶部导航栏日期
//	setDateTimeHeader(setLocationHeader);
}

function checkIsFirstRun(callback){
	var localStorage = window.localStorage;
	if(localStorage.getItem("isFirstRun") == '0'){
		mui.toast('欢迎回来');
	}
	//不存在键值或标记为 1 的场合
	else{
		mui.toast('正在配置资源，请稍候...');
		//设置天气资源信息
		localStorage.setItem('多云','res/images/icons/weather/cloudy.png');
		localStorage.setItem('阴','res/images/icons/weather/overcast.png');
		localStorage.setItem('晴','res/images/icons/weather/sunny.png');
		localStorage.setItem('小雨','res/images/icons/weather/rain.png');
		localStorage.setItem('阵雨','res/images/icons/weather/heavy-rain.png');
		console.log('--->' + localStorage.getItem('晴'));
	}
	callback(setLocationHeader);
}

function setDateTimeHeader(callback) {
	//声明 Date Object
	var d = new Date();
	//拼接日期字符串
	//拼接月
	var dateString = d.getMonth() + 1 + "月";
	//拼接日
	dateString += d.getDate() + "日";
	//拼接星期
	dateString += " 星期" + "天一二三四五六".charAt(d.getDay());
	//赋值
	document.getElementById('headerDate').innerText = dateString;
	callback(setIndexWeather);

}

function setLocationHeader(callback) {
	//获得地理位置
	var currLocation = "";
	plus.geolocation.getCurrentPosition(function(p) {
			currLocation = p.coords.latitude + "," + p.coords.longitude;
			//上报获取省市名
			mui.ajax('http://192.157.231.72:8080/MaidGuild/initialize/modules', {
				data: {
					//TODO: 虚拟机调试用
					location: "31.223421,121.53847"
					//location: currLocation
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型
				timeout: 10000, //超时时间设置为 10 秒；
				success: function(data) {
					//本地保存结果
					var localStorage = window.localStorage;
					localStorage.setItem("province", data.province);
					localStorage.setItem("modules", data.avalModuleList);
					//赋值
					document.getElementById('headerLoaction').innerHTML = localStorage.getItem("province");
					console.log("Modules: " + localStorage.getItem("modules"));
					callback(loadModulesPage);
				},
				error: function(xhr, type, errorThrown) {
					//异常处理
					console.log(type);
					mui.alert("在连接服务器时发生异常");
				}
			});
		},
		function(e) {
			alert("获取地理位置时发生异常");
		}, {
			provider: 'baidu'
		});
}

function setIndexWeather(callback) {
	//读取当前省市
	var localStorage = window.localStorage;
	var currProvince = localStorage.getItem("province");
	console.log(currProvince);
	//上报获得天气信息
	mui.ajax('http://192.157.231.72:8080/MaidGuild/weather/recent', {
		data: {
			cityName: currProvince
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为 10 秒；
		success: function(data) {
			//本地保存结果
			//TODO: 本地缓存
			localStorage.setItem("weatherJson", JSON.stringify(data));
			console.log("Weather json: " + JSON.stringify(data));
			//赋值
			//设置今日信息
			document.getElementById('todayCurrWeatherTemp').innerText = data.retData.today.curTemp;
			document.getElementById('todayWeatherTempRange').innerText = data.retData.today.lowtemp + "~" + data.retData.today.hightemp;
			document.getElementById('todayWeatherType').innerText = data.retData.today.type;
			setIndexWeatherIcon('todayWeatherIcon', data.retData.today.type);
			//设置预报信息 
			//+1
			document.getElementById('weatherForecastDay1').innerText = data.retData.forecast[0].week;
			setIndexWeatherIcon('weatherForecastIcon1', data.retData.forecast[0].type);
			document.getElementById('weatherForecastTempRange1').innerText = data.retData.forecast[0].lowtemp + "~" + data.retData.forecast[0].hightemp;
			//+2
			document.getElementById('weatherForecastDay2').innerText = data.retData.forecast[1].week;
			setIndexWeatherIcon('weatherForecastIcon2', data.retData.forecast[1].type);
			document.getElementById('weatherForecastTempRange2').innerText = data.retData.forecast[1].lowtemp + "~" + data.retData.forecast[1].hightemp;
			//+3
			document.getElementById('weatherForecastDay3').innerText = data.retData.forecast[2].week;
			setIndexWeatherIcon('weatherForecastIcon3', data.retData.forecast[2].type);
			document.getElementById('weatherForecastTempRange3').innerText = data.retData.forecast[2].lowtemp + "~" + data.retData.forecast[1].hightemp;
			document.getElementById('headerLoaction').innerText = localStorage.getItem("province");
			//设置更新时间
			var d = new Date();
			var nowHours = d.getHours();
			var nowMinutes = d.getMinutes();
			//Trim
			if (nowHours < 10) {
				nowHours = '0' + nowHours;
			}
			if (nowMinutes < 10) {
				nowMinutes = '0' + nowMinutes;
			}
			document.getElementById('headerUpdateTime').innerText = '更新时间： ' + nowHours + ':' + nowMinutes;
			callback();
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert("在连接服务器时发生异常");
		}
	});
}

function loadModulesPage() {
	currView = plus.webview.currentWebview();
	var content = plus.webview.create('modules.html', 'content', {
		top: '154px',
		bottom: '51px',
	});
	currView.append(content);
	content.addEventListener('loaded', function() {
		mui.toast("信息更新完毕");
	});
}

function setIndexWeatherIcon(targetId, weatherType) {
	var localStorage = window.localStorage;
	var targetObj = document.getElementById(targetId);
	console.log(weatherType);
	console.log('晴' == weatherType);
	console.log(localStorage.getItem('weatherType'));
	console.log(localStorage.getItem('晴') + '<-----');
	targetObj.src = localStorage.getItem('weatherType');
//	var imgSrc = 'res/images/icons/weather/';
//	switch (weatherType) {
//		case '多云':
//			imgSrc += 'cloudy.png';
//			targetObj.src = imgSrc;
//			break;
//		case '阴':
//			imgSrc += 'overcast.png';
//			targetObj.src = imgSrc;
//			break;
//		case '晴':
//			imgSrc += 'sunny.png';
//			targetObj.src = imgSrc;
//			break;
//		case '小雨':
//			imgSrc += 'rain.png';
//			targetObj.src = imgSrc;
//			break;
//		case '阵雨':
//			imgSrc += 'heavy-rain.png';
//			targetObj.src = imgSrc;
//			break;
//		default:
//			break;
//	}
}