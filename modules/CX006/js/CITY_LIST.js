
function initializeCITY_LIST() {
	console.log('In cityList');
	var self = plus.webview.currentWebview();
	console.log('Get passed: ' + self.triggerId);
	//设置标题
	if(self.triggerId == 'fromButton'){
		document.getElementById('titleText').innerText = '出发城市';
	}
	else{
		document.getElementById('titleText').innerText = '到达城市';
	}
}