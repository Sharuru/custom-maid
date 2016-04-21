/**
 * ActualBus 页面初始化
 * 跳转实时公交外接页面
 */
function initActualBus() {
	var self = plus.webview.currentWebview();
	console.log(self.data);
	var wv = plus.webview.create('http://xxbs.sh.gov.cn:8080/weixinpage/index.html');
	wv.setStyle({
		top: "49px",
		bottom: "0px"
	});
	wv.show();
	wv.evalJS('$("footer").remove();$("#text").val(' + self.data + ');$("#text").focus();');
}