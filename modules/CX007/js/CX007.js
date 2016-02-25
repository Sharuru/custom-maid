/*
 * CX007 画面初始化
 */
function initializeCX007() {
	console.log('In CX007');
	//延迟200ms后嵌入显示页面
	setTimeout(function() {
		var wv = plus.webview.create('http://m.amap.com/navigation/index/src=alipay&set_adcode=310000');
		wv.setStyle({
			top: "49px",
			bottom: "0px;"
		});
		wv.show();
	}, 200);
}