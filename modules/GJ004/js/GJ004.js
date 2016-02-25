/*
 * GJ004 画面初始化
 */
function initializeGJ004() {
	console.log('In GJ004');
	//延迟200ms后嵌入显示页面
	setTimeout(function() {
		var wv = plus.webview.create('http://dianhua.118114.cn:8088/yp114/index.do/channelno=211&type=0&cityName=%e4%b8%8a%e6%b5%b7');
		wv.setStyle({
			top: "49px",
			bottom: "0px;"
		});
		wv.show();
	}, 200);
}