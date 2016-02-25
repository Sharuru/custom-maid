/*
 * CX005 画面初始化
 */
function initializeCX005() {
	console.log('In CX005');
	//延迟200ms后嵌入显示页面
	setTimeout(function() {
		var wv = plus.webview.create('http://xxbs.sh.gov.cn:8080/weixinpage/index.html');
		wv.setStyle({
			top: "49px",
			bottom: "0px;"
		});
		wv.show();
	}, 200);
}