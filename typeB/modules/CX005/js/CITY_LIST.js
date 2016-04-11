/**
 * 初始化城市列表 
 */
function initializeCITY_LIST() {
//	console.log('In cityList');
	var self = plus.webview.currentWebview();
//	console.log('Get passed: ' + self.triggerId);
	//城市点击事件
	mui('.mui-table-view').on('tap', '.mui-indexed-list-item', function() {
		console.log('Choosed: ' + this.innerText);
		//传值给CX005
		var backPage = plus.webview.getWebviewById('PAGE_CX005');
		mui.fire(backPage, 'setLocation', {
			loc: this.innerText
		});
		mui.back();
	});
}