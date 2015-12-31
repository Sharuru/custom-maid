var localStorage = window.localStorage;

function initializeCX002() {
	console.log("In CX002");
	//根据当前cityid嵌入对应功能页面
	currView = plus.webview.currentWebview();
	var content = plus.webview.create(localStorage.getItem('cityId') + '.html', 'PAGE_METRO', {
		top: '49px'
	});
	currView.append(content);
}