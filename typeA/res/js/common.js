//var serverAddr = 'http://192.157.231.72:8080/MaidGuild/';
var serverAddr = 'http://172.16.64.43:8080/MaidGuild/';

//function getLocation() {
//	//TODO: 虚拟机调试不能使用百度 SDK 应当使用 GPS 模拟
//	//使用百度地图地位模块获取位置信息
//	plus.geolocation.getCurrentPosition(function(p) {
//		alert("B-Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude);
//	}, function(e) {
//		alert("B-Geolocation error: " + e.message);
//	}, {
//		provider: 'baidu'
//	});
//	//	plus.geolocation.getCurrentPosition(function(p) {
//	//		alert("B-Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude);
//	//		return p.coords.latitude + ',' + p.coords.longitude;
//	//	}, function(e) {
//	//		alert("B-Geolocation error: " + e.message);
//	//	});

//}

/**
 * 根据class获取元素
 * 
 * @param String tagName 标签名
 * @param String selectClassName 目标class名
 */
function getElementByClass(tagName, selectClassName) {
	var elementResult = [];
	var allElement = document.getElementsByTagName(tagName);
	for (var i = 0; i < allElement.length; i++) {
		if (allElement[i].className == selectClassName) {
			elementResult.push(allElement[i]);
		}
	}
	return elementResult;
}