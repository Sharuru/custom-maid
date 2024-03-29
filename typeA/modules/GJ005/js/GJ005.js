//本地 cache 读写 object
var localStorage = window.localStorage;
var textInput = document.getElementById('inputTextarea');
var textShow = document.getElementById('showTextarea');
var clickButton = document.getElementById('submitButton');
var favoritesButton = document.getElementById('doFavorites');
var favorLayer = document.getElementById('favoritesLayer');
var clearIcon = document.getElementById('clearButton');
var fromTypeStr = '';
var fromNameStr = '';
var toTypeStr = '';
var toNameStr = '';
var isFlg = false;
var favorList = [];
var autoTypeCode = '';
var autoTypeName = '';

/**
 * GJ005 画面初始化
 */
function initializeGJ005() {
	//默认两种语言
	fromTypeStr = 'auto';
	fromNameStr = '自动检测';
	toTypeStr = 'zh';
	toNameStr = '中文';
	getFavor();

	//输入文字变更
	mui('.input-layer').on('keydown', '#inputTextarea', function() {
		clearIcon.style.display = 'block';
		initialSet();
	});

	//点击输入框
	mui('.input-layer').on('tap', '#inputTextarea', function() {
		if (textInput.value != '') {
			clearIcon.style.display = 'block';
			initialSet();
		}
	});

	//清空按钮点击
	mui('.input-layer').on('tap', '#clearButton', function() {
		clearIcon.style.display = 'none';
		textInput.value = '';
		initialSet();
	});

	//删除按钮点击
	mui('#favoritesLayer').on('tap', '.delete-icon', function() {
		var favorIndex = this.id.substring(5, this.id.length);
		var favorInnerHTML = this.parentNode.parentNode.innerHTML;
		var favorContext = favorInnerHTML.substring(favorInnerHTML.lastIndexOf('4">') + 3, favorInnerHTML.lastIndexOf('</p'));
		var btnArray = ['取消', '确定'];
		mui.confirm('是否确定删除收藏记录', '', btnArray, function(e) {
			if (e.index == 1) {
				deleteFavor(favorIndex, favorContext);
			}
		})
	});

	//语言种类变更
	mui('.input-layer').on('change', '.hidden-select', function() {
		//判断选择框性质
		if (this.id.substring(0, 4) == 'from') {
			fromTypeStr = this.value;
			fromNameStr = this.options[this.selectedIndex].text;
			document.getElementById('fromType').innerText = fromNameStr + ' ◢';
		} else {
			toTypeStr = this.value;
			toNameStr = this.options[this.selectedIndex].text;
			document.getElementById('toType').innerText = toNameStr + ' ◢';
		}
		//切换后设置焦点
		textInput.focus();
		//初始化
		initialSet();
	});

	//翻译按钮点击
	mui('.input-layer').on('tap', '#submitButton', function() {
		if (textInput.value == '') {
			mui.toast('未输入需要翻译的文字');
			return;
		}
		getTranslation(fromTypeStr, toTypeStr, textInput.value);
	});

	//收藏按钮点击
	mui('.input-layer').on('tap', '#doFavorites', function() {
		if (isFlg) {
			favoritesButton.innerHTML = '<span class="icon iconfont icon-unfavorites larger-icon"></span>';
			cancelFavor();
		} else {
			favoritesButton.innerHTML = '<span class="icon iconfont icon-favorites larger-icon"></span>';
			var favorInfo = {
				fromTypeInfo: autoTypeCode,
				fromNameInfo: autoTypeName,
				fromSrc: textInput.value,
				toTypeInfo: toTypeStr,
				toNameInfo: toNameStr,
				toDst: textShow.value
			};
			addFavor(favorInfo);
		}
		isFlg = !isFlg;
		getFavor();
	});
}

/**
 * 获取翻译内容
 * 
 * @param String lanFromType 需要翻译的语言种类
 * @param String lanToType 翻译成的语言种类
 * @param String lanContext 翻译的文字
 */
function getTranslation(lanFromType, lanToType, lanContext) {
	addDisabled();
	mui.ajax(serverAddr + 'tools/translation', {
		data: {
			query: lanContext,
			from: lanFromType,
			to: lanToType
		},
		//服务器返回json格式数据
		dataType: 'json',
		//http请求类型
		type: 'get',
		//超时时间设置为10 秒；
		timeout: 10000,
		success: function(requestData) {
			if (requestData.errNum != '0') {
				mui.toast(requestData.errMsg);
				cancelDisabled();
			} else {
				var objectFlg = false;
				for (var keyElement in requestData.retData) {
					objectFlg = true;
				}
				if (objectFlg) {
					favoritesButton.innerHTML = '<span class="icon iconfont icon-unfavorites larger-icon"></span>';
					favoritesButton.style.display = 'block';
					autoTypeCode = requestData.retData.from;
					autoTypeName = getTypeName(autoTypeCode);
					textShow.value = requestData.retData.trans_result[0].dst;
				} else {
					mui.toast('发生未知错误,请重新操作');
				}
				cancelDisabled();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得翻译信息', '重试', function() {
				getTranslation(lanFromType, lanToType, lanContext);
			});
		}
	});
}

/**
 * 添加收藏记录
 */
function addFavor(InfoStr) {
	favorList.unshift(InfoStr);
	localStorage.setItem('favorRecord', JSON.stringify(favorList));
	mui.toast('收藏成功');
}

/**
 * 取消收藏记录
 */
function cancelFavor() {
	favorList.shift();
	localStorage.setItem('favorRecord', JSON.stringify(favorList));
	mui.toast('取消收藏');
}

/**
 * 删除收藏记录
 */
function deleteFavor(indexStr, contextStr) {
	favorList.splice(indexStr, 1);
	localStorage.setItem('favorRecord', JSON.stringify(favorList));
	mui.toast('已删除收藏记录');
	if (textInput.value == contextStr) {
		favoritesButton.innerHTML = '<span class="icon iconfont icon-unfavorites larger-icon"></span>';
		isFlg = false;
	}
	getFavor();
}

/**
 * 获取收藏记录
 */
function getFavor() {
	var allFavorites = localStorage.getItem('favorRecord');
	if (allFavorites == null || allFavorites == '[]') {
		favorLayer.innerHTML = '<p class="font-w300-s16">暂无收藏记录...</p>';
	} else {
		favorLayer.innerHTML = '<p class="font-w300-s16">收藏记录</p>';
		favorList = JSON.parse(allFavorites);
		var favorContext = '';
		for (var i = 0; i < favorList.length; i++) {
			favorContext += '<div class="mui-row padding-10-l"><div class="mui-col-xs-3">';
			favorContext += '<p class="font-w300-s14">原: (' + favorList[i].fromNameInfo + ')</p></div>';
			favorContext += '<div class="mui-col-xs-8"><p class="font-w300-s14">' + favorList[i].fromSrc;
			favorContext += '</p></div><div class="mui-col-xs-1 align-right">';
			favorContext += '<span class="icon iconfont icon-deleteFavorites delete-icon" id="favor' + i + '"></span></div></div>';
			favorContext += '<div class="mui-row padding-8 padding-10-l"><div class="mui-col-xs-3">';
			favorContext += '<p class="font-w300-s14">译: (' + favorList[i].toNameInfo + ')</p></div>';
			favorContext += '<div class="mui-col-xs-8"><p class="font-w300-s14">' + favorList[i].toDst;
			favorContext += '</p></div><div class="mui-col-xs-1"></div></div>';
		}
		favorLayer.innerHTML += favorContext;
	}
}

/**
 * 文本修改时初始化
 */
function initialSet() {
	isFlg = false;
	favoritesButton.style.display = 'none';
	textShow.value = '';
}

/**
 * 禁用输入框和翻译按钮
 */
function addDisabled() {
	textInput.disabled = 'disabled';
	clickButton.disabled = true;
	document.getElementById('fromSelect').disabled = true;
	document.getElementById('toSelect').disabled = true;
	document.getElementById('fromType').style.color = '#66AFFF';
	document.getElementById('toType').style.color = '#66AFFF';
	clearIcon.style.display = 'none';
	//收藏按钮点击事件取消绑定
	mui('.input-layer').off('tap', '#doFavorites');
}

/**
 * 解除禁用输入框和翻译按钮
 */
function cancelDisabled() {
	textInput.disabled = '';
	clickButton.disabled = false;
	document.getElementById('fromSelect').disabled = false;
	document.getElementById('toSelect').disabled = false;
	document.getElementById('fromType').style.color = '#007aff';
	document.getElementById('toType').style.color = '#007aff';
	//收藏按钮点击事件再绑定
	mui('.input-layer').on('tap', '#doFavorites', function() {
		if (isFlg) {
			favoritesButton.innerHTML = '<span class="icon iconfont icon-unfavorites larger-icon"></span>';
			cancelFavor();
		} else {
			favoritesButton.innerHTML = '<span class="icon iconfont icon-favorites larger-icon"></span>';
			var favorInfo = {
				fromTypeInfo: autoTypeCode,
				fromNameInfo: autoTypeName,
				fromSrc: textInput.value,
				toTypeInfo: toTypeStr,
				toNameInfo: toNameStr,
				toDst: textShow.value
			};
			addFavor(favorInfo);
		}
		isFlg = !isFlg;
		getFavor();
	});
}

/**
 * 获取自动检测出的语言种类
 */
function getTypeName(typeCode) {
	var typeName = '';
	if (typeCode == 'zh') {
		typeName = '中文';
	}
	if (typeCode == 'en') {
		typeName = '英文';
	}
	if (typeCode == 'jp') {
		typeName = '日语';
	}
	if (typeCode == 'kor') {
		typeName = '韩语';
	}
	if (typeCode == 'spa') {
		typeName = '西班牙语';
	}
	if (typeCode == 'fra') {
		typeName = '法语';
	}
	if (typeCode == 'th') {
		typeName = '泰语';
	}
	if (typeCode == 'ara') {
		typeName = '阿拉伯语';
	}
	if (typeCode == 'ru') {
		typeName = '俄罗斯语';
	}
	if (typeCode == 'pt') {
		typeName = '葡萄牙语';
	}
	if (typeCode == 'de') {
		typeName = '德语';
	}
	if (typeCode == 'it') {
		typeName = '意大利语';
	}
	if (typeCode == 'nl') {
		typeName = '荷兰语';
	}
	if (typeCode == 'el') {
		typeName = '希腊语';
	}
	return typeName;
}