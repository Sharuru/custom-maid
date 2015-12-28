var localStorage = window.localStorage;

function initializeCX006() {
	console.log('In CX006');
	//	var self = plus.webview.currentWebview();
	//	console.log(self.id);
	document.getElementById('fromButton').innerText = localStorage.getItem("province");
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
			}, 350);
		})
	});
}