/*
 * HJ001 画面初始化
 */
function initializeHJ001() {
	console.log('In HJ001');
	//嵌入页面
	var wv = plus.webview.create('http://typhoon.zjwater.gov.cn/wap.htm');
	wv.setStyle({top:"49px",bottom:"0px;"});
	wv.show();
}