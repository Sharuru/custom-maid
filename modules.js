//设置功能列表
function setModuleList() {
	console.log("Setting modules...");
	//获取可用模块列表
	var localStorage = window.localStorage;
	var avalModuleList = localStorage.getItem("modules").split(",");
	for (var i = 0; i < avalModuleList.length; i++) {
		document.getElementById('moduleBody').innerHTML += '<div style="width:25%;height:80px;float:left;border:1px solid red;}">' + avalModuleList[i] + '</div>';
	}
	console.log("Setting modules finished.");
}