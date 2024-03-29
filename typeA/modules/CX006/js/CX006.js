//缓存 obj select
var localStorage = window.localStorage;
var fromButton = document.getElementById('fromButton');
var toButton = document.getElementById('toButton');
var searchButton = document.getElementById('searchButton');

/**
 * 初始化CX006
 */
function initializeCX006() {
	console.log('In CX006');
	//文本初始化
	fromButton.innerText = localStorage.getItem("province");
	//传值事件绑定
	window.addEventListener('setLocation', function(event) {
		document.getElementById(event.detail.triggerId).innerText = event.detail.loc;
	});
	//给两个城市按钮绑定点击事件
	mui('.button-text').each(function() {
		this.addEventListener('tap', function() {
			console.log(this.id + ' is clicked.');
			var triggerId = this.id;
			//按钮动效现时完毕后再切换页面
			setTimeout(function() {
				mui.openWindow({
					url: 'CITY_LIST.html',
					id: 'PAGE_CITY_LIST',
					show: {
						aniShow: 'pop-in',
						duration: 200
					},
					extras: {
						triggerId: triggerId
					},
					waiting: {
						autoShow: false
					}
				});
			}, 200);
		})
	});
	//交换按钮点击事件
	document.getElementById('changeButton').addEventListener('tap', function() {
			if (toButton.innerText != '请选择') {
				var temp = fromButton.innerText;
				fromButton.innerText = toButton.innerText
				toButton.innerText = temp;
			} else {
				mui.toast('请先选择到达城市');
			}
		})
		//查询按钮点击事件
	document.getElementById('searchButton').addEventListener('tap', function() {
		if (toButton.innerText != '请选择') {
			getJsonData(fromButton.innerText, toButton.innerText);
		} else {
			mui.toast('请先选择到达城市');
		}
	})
}

/**
 * 获得 json 数据 
 * 
 * @param String from 出发城市
 * @param String to 到达城市
 */
function getJsonData(from, to) {
	console.log('Ask from ' + from + ' to ' + to);
	searchButton.disabled = 'disabled';
	searchButton.innerText = '查询中';
	mui.ajax(serverAddr + 'travel/longDBus', {
		data: {
			from: from,
			to: to
		},
		//服务器返回json格式数据
		dataType: 'json',
		//http请求类型
		type: 'get',
		//超时时间设置为10 秒；
		timeout: 10000,
		success: function(data) {
			//设置
			operateData(from, to, data);
			searchButton.innerText = '正在跳转';
			setTimeout(function() {
				searchButton.disabled = '';
				searchButton.innerHTML = '开始查询';
			}, 200);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得长途汽车信息', '重试', function() {
				getJsonData(from, to);
			});
		}
	});
}

/**
 * 对数据进行处理并传递参数
 * 
 * @param String from 出发城市
 * @param String to 到达城市
 * @param Json data json数据
 */
function operateData(from, to, data) {
	console.log('Setting screen...');
	//没有数据
	if (data == null) {
		mui.toast('没有找到匹配的线路');
	} else {
		//有数据，画面迁移
		mui.openWindow({
			url: 'RESULT_LIST.html',
			id: 'PAGE_RESULT_LIST',
			show: {
				aniShow: 'pop-in',
				duration: 200
			},
			extras: {
				from: from,
				to: to,
				data: data
			},
			waiting: {
				autoShow: false
			}
		});
	}
}