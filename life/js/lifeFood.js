//设置美食首页列表
function setLifeEventListInfo(reqPage) {
	console.log('In setLifeEventListInfo');
	//拼接请求字符串
	//TODO：region 硬编码
	var reqUrl = 'http://api.map.baidu.com/place/v2/eventsearch?query=美食&event=all' +
		'&region=' + '上海' + '&location=' + getLocation() + '&radius=5000&output=json' +
		'&page_size=20' + '&page_num=' + reqPage + '&ak=' + getAPIKey(baiduAPIKey);
	//获得 Json 响应
	var respObj = getJsonObj(reqUrl);
	//解析 Json 结果
	lifeEventListInfoHandler(respObj);
}

function lifeEventListInfoHandler(jsonObj){
	//解析数据
}
