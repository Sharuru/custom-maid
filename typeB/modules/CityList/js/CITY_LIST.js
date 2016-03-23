/**
 * 初始化城市列表 
 */
function initializeCITY_LIST() {
//	console.log('In cityList');
	var self = plus.webview.currentWebview();
//	console.log('Get passed: ' + self.triggerId);
	//设置标题
	if (self.triggerId == 'startStationCity') {
		document.getElementById('titleText').innerText = '出发城市';
	} else {
		document.getElementById('titleText').innerText = '到达城市';
	}
	//城市点击事件
	mui('.mui-table-view').on('tap', '.mui-indexed-list-item', function() {
		console.log('Choosed: ' + this.innerText);
		var backPage = plus.webview.getWebviewById('PAGE_CX001');
		mui.fire(backPage, 'setLocation', {
			loc: this.innerText,
			triggerId: self.triggerId
		});
		mui.back();
	});
}