
// utf8 编码

function init_post_picture()
{
	origin_data_of_pic = '';
	origin_size_of_pic = 0;
}

function post_picture_show_modal()
{
	$('#div_post_a_picture').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function check_post_picture()
{
	let my_storage_location = $("input[name='radio_post_pic']:checked").val();  // 存储位置
	if ( storage_locations_supported_conf_post_pic.indexOf(storage_locations[Number(my_storage_location)]) === -1 ) { // 不支持当前选择
		if (get_cookie('i18n_lang') === "zh") alert("错误：图片目前只支持存储于：" + storage_locations_supported_conf_post_pic + "。");
		else                                  alert("Error: Supported block chain at the moment: " + storage_locations_supported_conf_post_pic + ".");
		return false;
	}
	let my_description = $("#description_of_post_pic").val();  // 图片描述
	if (my_description.length > 30) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：图片描述的长度超出限制。");
		else                                  alert("Error: Description is too long.");
		return false;
	}
	if (origin_data_of_pic === '') {  // 没有读取到图片的数据
		if (get_cookie('i18n_lang') === "zh") alert("错误：没有选择或者打开图片文件。");
		else                                  alert("Error: No picture file selected or opened.");
		return false;
	}
	return true;
}

function view_times_of_txn_post_picture()
{
	if (check_post_picture() === false) return;

	let my_storage_location   = Number($("input[name='radio_post_pic']:checked").val());
	let my_description        = $("#description_of_post_pic").val();

	let times_of_txn = 1;     // 需要的交易次数
	let per_trn_len  = 10;    // 每个交易memo存放的数据长度，不同的链设置不同的值

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
	}
	else if (my_storage_location === 2) {        // 内容数据存储在 ETH 链
	}
	else if (my_storage_location === 6) {        // 内容数据存储在 Arweave 链
		per_trn_len = arweave_per_trn_len_post_pic;
	}
	else {                                       // 内容数据存储在其他链
		return;
	}

	let my_len = origin_data_of_pic.length;
	let my_num = Math.ceil(my_len / per_trn_len);  // 按照长度将内容分割为多个部分，计算数量，向上取整
	times_of_txn += my_num;

	if (get_cookie('i18n_lang') === "zh") alert("需要发送的交易次数总共为：" + times_of_txn + "。请确保您的帐户有足够余额以及足够的CPU/NET资源。");
	else                                  alert("The total number of transactions to be sent is: " + times_of_txn + ". Please ensure that your account has sufficient balance and sufficient CPU/NET resources");
}

function post_picture()
{
}

function resume_from_break_point_post_picture()
{
}
