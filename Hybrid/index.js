//主页加载后设置各个元素
function initialize() {
	console.log("Setting landing page...");
	//初次运行检查
	checkIsFirstRun(setLocationHeader);
}

function checkIsFirstRun(callback) {
	var localStorage = window.localStorage;
	if (localStorage.getItem("isFirstRun") == '0') {
		mui.toast('欢迎回来');
	}
	//不存在键值或标记为 1 的场合
	else {
		mui.toast('正在配置资源，请稍候...');
		//设置天气资源信息
		var weatherSource = [];
		weatherSource = [{
			weatherType: '晴',
			weatherSrc: 'res/images/icons/weather/sunny.png'
		}, {
			weatherType: '多云',
			weatherSrc: 'res/images/icons/weather/cloudy.png'
		}, {
			weatherType: '阴',
			weatherSrc: 'res/images/icons/weather/overcast.png'
		}, {
			weatherType: '阵雨',
			weatherSrc: 'res/images/icons/weather/shower.png'
		}, {
			weatherType: '雷阵雨',
			weatherSrc: 'res/images/icons/weather/thunder-shower.png'
		}, {
			weatherType: '雷阵雨伴有冰雹',
			weatherSrc: 'res/images/icons/weather/thunder-shower-with-hail.png'
		}, {
			weatherType: '雨夹雪',
			weatherSrc: 'res/images/icons/weather/sleet.png'
		}, {
			weatherType: '小雨',
			weatherSrc: 'res/images/icons/weather/light-rain.png'
		}, {
			weatherType: '中雨',
			weatherSrc: 'res/images/icons/weather/moderate-rain.png'
		}, {
			weatherType: '大雨',
			weatherSrc: 'res/images/icons/weather/heavy-rain.png'
		}, {
			weatherType: '暴雨',
			weatherSrc: 'res/images/icons/weather/storm.png'
		}, {
			weatherType: '大暴雨',
			weatherSrc: 'res/images/icons/weather/heavy-storm.png'
		}, {
			weatherType: '特大暴雨',
			weatherSrc: 'res/images/icons/weather/severe-storm.png'
		}, {
			weatherType: '阵雪',
			weatherSrc: 'res/images/icons/weather/snow-flurry.png'
		}, {
			weatherType: '小雪',
			weatherSrc: 'res/images/icons/weather/light-snow.png'
		}, {
			weatherType: '中雪',
			weatherSrc: 'res/images/icons/weather/moderate-snow.png'
		}, {
			weatherType: '大雪',
			weatherSrc: 'res/images/icons/weather/heavy-snow.png'
		}, {
			weatherType: '暴雪',
			weatherSrc: 'res/images/icons/weather/snow-storm.png'
		}, {
			weatherType: '雾',
			weatherSrc: 'res/images/icons/weather/foggy.png'
		}, {
			weatherType: '冻雨',
			weatherSrc: 'res/images/icons/weather/ice-rain.png'
		}, {
			weatherType: '沙尘暴',
			weatherSrc: 'res/images/icons/weather/dust-storm.png'
		}, {
			weatherType: '小到中雨',
			weatherSrc: 'res/images/icons/weather/moderate-rain.png'
		}, {
			weatherType: '中到大雨',
			weatherSrc: 'res/images/icons/weather/heavy-rain.png'
		}, {
			weatherType: '大到暴雨',
			weatherSrc: 'res/images/icons/weather/storm.png'
		}, {
			weatherType: '暴雨到大暴雨',
			weatherSrc: 'res/images/icons/weather/heavy-storm.png'
		}, {
			weatherType: '大暴雨到特大暴雨',
			weatherSrc: 'res/images/icons/weather/severe-storm.png'
		}, {
			weatherType: '小到中雪',
			weatherSrc: 'res/images/icons/weather/moderate-snow.png'
		}, {
			weatherType: '中到大雪',
			weatherSrc: 'res/images/icons/weather/heavy-snow.png'
		}, {
			weatherType: '大到暴雪',
			weatherSrc: 'res/images/icons/weather/snow-storm.png'
		}, {
			weatherType: '浮尘',
			weatherSrc: 'res/images/icons/weather/dust.png'
		}, {
			weatherType: '扬沙',
			weatherSrc: 'res/images/icons/weather/sand.png'
		}, {
			weatherType: '强沙尘暴',
			weatherSrc: 'res/images/icons/weather/sand-storm.png'
		}, {
			weatherType: '霾',
			weatherSrc: 'res/images/icons/weather/haze.png'
		}, {
			weatherType: '无',
			weatherSrc: 'res/images/icons/weather/unknown.png'
		}];
		localStorage.setItem('allKindWeather', JSON.stringify(weatherSource));
		//设置模块资源信息
		localStorage.setItem('SH001', '快递');
		localStorage.setItem('SH002', '美食');
		localStorage.setItem('SH003', '团购');
		localStorage.setItem('SH004', '银行');
		localStorage.setItem('SH005', '影院');
		localStorage.setItem('CX001', '火车');
		localStorage.setItem('CX002', '地铁');
		localStorage.setItem('CX003', '长途汽车');
		localStorage.setItem('CX004', '公交');
		localStorage.setItem('CX005', '出行');
		localStorage.setItem('GJ001', '汇率换算');
		localStorage.setItem('GJ002', '彩票');
		localStorage.setItem('GJ003', '证券');
		localStorage.setItem('GJ004', '在线翻译');
		localStorage.setItem('HJ001', '台风查询');
		localStorage.setItem('HJ002', '天气');
		//通用模块
		localStorage.setItem('comModuleList', 'SH001,CX001,CX003,CX004,GJ001,GJ002,GJ003,GJ004,HJ001,HJ002');
		localStorage.setItem('isFirstRun', '0');
		//币种字典
		localStorage.setItem('人民币', 'CNY');
		localStorage.setItem('美元', 'USD');
		localStorage.setItem('欧元', 'EUR');
		localStorage.setItem('港币', 'HKD');
		localStorage.setItem('日元', 'JPY');
		localStorage.setItem('英镑', 'GBP');
		localStorage.setItem('澳大利亚元', 'AUD');
		localStorage.setItem('加拿大元', 'CAD');
		localStorage.setItem('泰国铢', 'THB');
		localStorage.setItem('新加坡元', 'SGD');
		localStorage.setItem('挪威克朗', 'NOK');
		localStorage.setItem('林吉特', 'MYR');
		localStorage.setItem('澳门元', 'MOP');
		localStorage.setItem('韩国元', 'KRW');
		localStorage.setItem('瑞士法郎', 'CHF');
		localStorage.setItem('丹麦克朗', 'DKK');
		localStorage.setItem('瑞典克朗', 'SEK');
		localStorage.setItem('卢布', 'RUB');
		localStorage.setItem('新西兰元', 'NZD');
		localStorage.setItem('菲律宾比索', 'PHP');
		localStorage.setItem('新台币', 'TWD');
		//mui.toast('配置完毕');
	}
	callback(loadIndexPage);
}

function setLocationHeader(callback) {
	//获得地理位置
	var currLocation = "";
	plus.geolocation.getCurrentPosition(function(p) {
			currLocation = p.coords.latitude + "," + p.coords.longitude;
			//上报获取省市名
			mui.ajax(serverAddr + 'initialize/modules', {
				data: {
					//TODO: 虚拟机调试用
					location: "31.223421,121.53847"
						//					location: "32.123456,101.654321"
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
					//document.getElementById('headerLoaction').innerHTML = localStorage.getItem("province");
					console.log("Modules: " + localStorage.getItem("modules"));
					callback();
				},
				error: function(xhr, type, errorThrown) {
					//异常处理
					console.log(type);
					mui.alert('远程服务器连接失败', '无法获得地理信息', '重试', function() {
						setLocationHeader();
					});
				}
			});
		},
		function(e) {
			alert("获取地理位置时发生异常");
		}, {
			provider: 'baidu'
		});
}

function loadIndexPage() {
	currView = plus.webview.currentWebview();
	var content = plus.webview.create('modules.html', 'content', {
		top: '0px',
		bottom: '0px',
	});
	currView.append(content);
	content.addEventListener('loaded', function() {
		mui.toast("信息更新完毕");
	});
}