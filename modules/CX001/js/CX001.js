var findByTrainNumberButton = document.getElementById('buttonFindByTrain');


function initializeCX001() {
	document.getElementById('slider').addEventListener('slide', function(e) {
		console.log(e.detail.slideNumber);
	});
	findByTrainNumberButton.addEventListener('tap', function() {
		findByTrainNo();
	});
	//
}

function findByTrainNo() {
	//合法 check
	mui.ajax(serverAddr + '/travel/train/id', {
		data: {
			id: document.getElementById('trainNumberInput').value
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			console.log(JSON.stringify(data));
			//无条目的场合
			if (data.error_code != 0) {
				mui.toast(data.reason);
			} else {
				document.getElementById('findByTrainResulTitle').innerText = data.result.list.train_no + data.result.list.train_type;
				document.getElementById('AStartStation').innerText = data.result.list.start_station;
				document.getElementById('AStartTime').innerText = data.result.list.start_time;
				document.getElementById('AEndStation').innerText = data.result.list.end_station;
				document.getElementById("AEndTime").innerText = data.result.list.end_time;
				document.getElementById('ADuration').innerText = data.result.list.run_time;
				//document.getElementById('findByTrainResultDiv').innerHTML = JSON.stringify(data);
				for (currIndex in data.result.list.price_list.item) {
					document.getElementById('findByTrainResultSeat').innerText += data.result.list.price_list.item[currIndex].price_type + ' || ' + data.result.list.price_list.item[currIndex].price + ' ||||| ';
				}

			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			//			mui.alert('远程服务器连接失败', '无法获得汇率信息', '重试', function() {
			//				getExchangeRate(m1, m2);
			//			});
		}
	});
}