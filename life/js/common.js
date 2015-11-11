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
		localStorage.setIem('baiduAPIKey','Wikpdmp0xVzHMSDYjQ5arfAi');
		
	}
}

//根据 index 获取对应 API
function getAPIKey(index) {
	return window.localStorage.getItem(index);
}

function getJsonObj(reqUrl) {
	mui.ajax(reqUrl,{
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		async: false,
		timeout:5000,//超时时间设置为5秒；
		success:function(data){
			console.log("Get json: " + JSON.stringify(data));
			returnData = data;
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			console.log('Err: ' + type);
		}
	});
	return returnData;
}

function getImageSrc(compareElement,elementId){
	switch (compareElement) {
		case '晴':
			document.getElementById(elementId).src = "../res/images/sun.png";
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

function getBackgroundImage(compareElement,elementId){
	switch (compareElement) {
		case '阴':
			document.getElementById(elementId).style.backgroundImage = "url(../res/images/weatherBackgroundOvercast.jpg)";
			break;
		case '雾':
			document.getElementById(elementId).style.backgroundImage = "url(../res/images/weatherBackgroundFog.jpg)";
			break;
		case '晴':
			document.getElementById(elementId).style.backgroundImage = "url(../res/images/weatherBackgroundSunny.png)";
			break;
		case '多云':
			document.getElementById(elementId).style.backgroundImage = "url(../res/images/weatherBackgroundCloudy.jpg)";
			break;
		default:
			break;
	}
}
