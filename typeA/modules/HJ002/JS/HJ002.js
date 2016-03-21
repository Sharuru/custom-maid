/*
 * HJ002 画面初始化
 */
function initializeHJ002() {
	console.log('In HJ002');
	//延迟200ms后嵌入显示页面
	setTimeout(function() {
		var wv = plus.webview.create('http://zfb.ipe.org.cn/index.htm');
		wv.setStyle({
			top: "49px",
			bottom: "0px;"
		});
		wv.show();
	}, 200);
}