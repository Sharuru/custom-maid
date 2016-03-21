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
		localStorage.setItem('多云', 'res/images/icons/weather/cloudy.png');
		localStorage.setItem('阴', 'res/images/icons/weather/overcast.png');
		localStorage.setItem('晴', 'res/images/icons/weather/sunny.png');
		localStorage.setItem('小雨', 'res/images/icons/weather/rain-s.png');
		localStorage.setItem('中雨', 'res/images/icons/weather/rain-m.png');
		localStorage.setItem('阵雨', 'res/images/icons/weather/heavy-rain.png');
		localStorage.setItem('雨夹雪', 'res/images/icons/weather/rain-with-snow.png');
		//设置模块资源信息
		localStorage.setItem('SH001', '快递');
		localStorage.setItem('SH002', '美食');
		localStorage.setItem('SH003', '团购');
		localStorage.setItem('SH004', '银行');
		localStorage.setItem('SH005', '影院');
		localStorage.setItem('CX001', '火车');
		localStorage.setItem('CX002', '地铁');
		localStorage.setItem('CX003', '航班');
		localStorage.setItem('CX004', '路况');
		localStorage.setItem('CX005', '公交');
		localStorage.setItem('CX006', '长途汽车');
		localStorage.setItem('CX007', '出行');
		localStorage.setItem('GJ001', '汇率换算');
		localStorage.setItem('GJ002', '彩票信息');
		localStorage.setItem('GJ003', '股票信息');
		localStorage.setItem('GJ004', '114 查号');
		localStorage.setItem('GJ005', '在线翻译');
		localStorage.setItem('HJ001', '台风查询');
		localStorage.setItem('HJ002', '空气水质查询');
		localStorage.setItem('HJ003', '天气');
		localStorage.setItem('SP001', '图书馆服务');
		localStorage.setItem('SP002', '志愿者服务');
		localStorage.setItem('JS001', '电子监控');
		localStorage.setItem('JS002', '违章提醒');
		localStorage.setItem('JS003', '驾照违法查询');
		localStorage.setItem('JS004', '车辆年检预约');
		//通用模块
		localStorage.setItem('comModuleList', 'SH001,CX001,CX003,CX006,GJ001,GJ002,GJ003,GJ004,GJ005,GJ005,HJ001');
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
	callback(setLocationHeader);
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
					callback(loadIndexPage);
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