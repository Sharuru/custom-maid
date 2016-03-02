//本地 cache 读写 object
var localStorage = window.localStorage;
var textInput = document.getElementById('inputTextarea');
var textShow = document.getElementById('showTextarea');
var clickButton = document.getElementById('submitButton');
var favoritesButton = document.getElementById('doFavorites');
var fromTypeStr = '';
var fromNameStr = '';
var toTypeStr = '';
var toNameStr = '';
var isFlg = false;

/**
 * GJ005 画面初始化
 */
function initializeGJ005() {
	//默认两种语言
	fromTypeStr = 'auto';
	fromNameStr = '自动检测';
	toTypeStr = 'zh';
	toNameStr = '中文';
	//语言种类变更
	mui("body").on('change', '.hidden-select', function() {
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
		//清除译文
		textShow.value = '';
		favoritesButton.style.display = "none";
	});
	//翻译按钮点击
	mui("body").on('tap', '#submitButton', function() {
		if (textInput.value == '') {
			mui.alert('请输入需要翻译的文字');
			return;
		}
		getTranslation(fromTypeStr, toTypeStr, textInput.value);
	});
	//收藏按钮点击
	mui("body").on('tap', '#doFavorites', function() {
		if (isFlg) {
			favoritesButton.innerHTML = '<span class="icon iconfont icon-unfavorites larger-icon"></span>';
			mui.toast('取消收藏');
		} else {
			favoritesButton.innerHTML = '<span class="icon iconfont icon-favorites larger-icon"></span>';
			mui.toast('收藏成功');
		}
		isFlg = !isFlg;
	});
}

function getTranslation(lanFromType, lanToType, lanContext) {
	addDisabled();
	favoritesButton.style.display = "block";
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
				mui.alert(requestData.errMsg);
				cancleDisabled();
			} else {
				textShow.value = requestData.retData.trans_result[0].dst;
				cancleDisabled();
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
 * 禁用输入框和翻译按钮
 */
function addDisabled() {
	textInput.disabled = 'disabled';
	clickButton.disabled = true;
}

/**
 * 解除禁用输入框和翻译按钮
 */
function cancleDisabled() {
	textInput.disabled = '';
	clickButton.disabled = false;
}