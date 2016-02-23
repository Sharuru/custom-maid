/*
 * HJ001 画面初始化
 */
function initializeHJ001() {
	console.log('In HJ001');
	//延迟200ms后嵌入显示页面
	setTimeout(function() {
		var wv = plus.webview.create('http://www.pm25.com/shanghai.html');
		//var wv = plus.webview.create('http://www.cnemc.cn/citystatus/waterWeekReportMore.jsp?selWaterSystem=%BC%AA%C1%D6%BC%AA%C1%D6%CF%AA%C0%CB%BF%DA&chkmWaterSystem');
		wv.setStyle({
			top: "49px",
			bottom: "0px;"
		});
		wv.show();
	}, 200);
}