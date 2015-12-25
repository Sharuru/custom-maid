var localStorage = window.localStorage;

function initializeCX006() {
	console.log('In CX006');
	var self = plus.webview.currentWebview();
	console.log(self.id);
	document.getElementById('fromButton').innerText = localStorage.getItem("province");
	window.addEventListener('custom', function(event) {
			var value = event.detail.a;
			alert(value);
	});
//事件绑定
document.getElementById('fromButton').addEventListener('click', function() {
	console.log('click');
	setTimeout(function() {
		mui.openWindow({
			url: 'CITY_LIST.html',
			id: 'Page-CITY_LIST',
			show: {
				aniShow: "pop-in",
				duration: 200
			},
			extras: {
				tid: '12345'
			},
			waiting: {
				//取消加载动画，模拟原生感
				autoShow: false
			}
		});
	}, 200);

});
}

function abcd() {
	var self = plus.webview.currentWebview();
	alert(self.a); // 这地方取不到值
}