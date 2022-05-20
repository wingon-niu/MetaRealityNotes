
// utf8 编码

function clear_post_item_status()
{
	album_item_loaded_ok = false;
	origin_data_of_item  = '';
	origin_size_of_item  = 0;
	$("#div_post_item_file_content").html('');

	var file1 = $("#post_item_open_file");
	file1.after(file1.clone().val(""));
	file1.remove();

	bind_file_onchange();
}

function bind_file_onchange()
{
	$("#post_item_open_file").on("change", function() {
		album_item_loaded_ok = false;
		origin_data_of_item  = '';
		origin_size_of_item  = 0;
		$("#div_post_item_file_content").html('');

		if (typeof(this) === 'undefined' || typeof(this.files) === 'undefined' || typeof(this.files[0]) === 'undefined') {  // 用户点了取消按钮
			return;
		}
		let fileReader      = new FileReader();
		let fileType        = this.files[0].type;
		origin_size_of_item = this.files[0].size;
		$("#file_name_of_post_item").val(this.files[0].name);
		fileReader.onload = function(e) {
			if (album_item_type === 1) {
				$("#div_post_item_file_content").html('<img src="' + this.result + '" alt="" style="width:auto; height:auto; max-width:100%; max-height:100%;" />');
			}
			else if (album_item_type === 2) {
				$("#div_post_item_file_content").html('<video src="' + this.result + '" controls style="width:auto; height:auto; max-width:100%; max-height:100%;">HTML5 Video is required.</video>');
			}
			else if (album_item_type === 3) {
				$("#div_post_item_file_content").html('<audio src="' + this.result + '" controls>HTML5 Audio is required.</audio>');
			}
			else if (album_item_type === 5) {
				$("#div_post_item_file_content").html(this.result.slice(0, album_item_data_preview_length) + '......');
			}
			else {
				$("#div_post_item_file_content").html('N/A');
			}
			album_item_loaded_ok = true;
			origin_data_of_item  = 'FileName:' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse($("#file_name_of_post_item").val())) + '.FileContent:' + this.result;
		}
		fileReader.readAsDataURL(this.files[0]);
	});
}

function init_post_item()
{
	album_item_type = 1;
	clear_post_item_status();
}

function post_picture_show_modal()
{
	if (album_item_type !== 1) {
		clear_post_item_status();
	}
	album_item_type = 1;

	$('#div_post_an_item').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function post_video_show_modal()
{
	if (album_item_type !== 2) {
		clear_post_item_status();
	}
	album_item_type = 2;

	$('#div_post_an_item').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function post_audio_show_modal()
{
	if (album_item_type !== 3) {
		clear_post_item_status();
	}
	album_item_type = 3;

	$('#div_post_an_item').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function post_other_file_show_modal()
{
	if (album_item_type !== 5) {
		clear_post_item_status();
	}
	album_item_type = 5;

	$('#div_post_an_item').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function check_post_item()
{
	let my_storage_location = $("input[name='radio_post_item']:checked").val();  // 存储位置
	if ( storage_locations_supported_conf_post_item.indexOf(storage_locations[Number(my_storage_location)]) === -1 ) { // 不支持当前选择
		if (get_cookie('i18n_lang') === "zh") alert("错误：目前只支持存储于：" + storage_locations_supported_conf_post_item + "。");
		else                                  alert("Error: Supported block chain at the moment: " + storage_locations_supported_conf_post_item + ".");
		return false;
	}
	let my_description = $("#description_of_post_item").val();  // 条目的描述
	if (my_description.length > 30) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：描述长度超出限制。");
		else                                  alert("Error: Description is too long.");
		return false;
	}
	if (album_item_loaded_ok === false) {      // 文件没有读取完毕
		if (get_cookie('i18n_lang') === "zh") alert("错误：文件正在读取中，请稍等一会。");
		else                                  alert("Error: The file is loading, please wait a moment.");
		return false;
	}
	if (origin_data_of_item === '') {  // 没有读取到文件的数据
		if (get_cookie('i18n_lang') === "zh") alert("错误：没有选择或者打开文件。");
		else                                  alert("Error: No file selected or opened.");
		return false;
	}
	return true;
}

function view_times_of_txn_post_item()
{
	if (check_post_item() === false) return;

	let my_storage_location   = Number($("input[name='radio_post_item']:checked").val());
	let my_description        = $("#description_of_post_item").val();

	let times_of_txn = 1;     // 需要的交易次数
	let per_trn_len  = 10;    // 每个交易memo存放的数据长度，不同的链设置不同的值

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
	}
	else if (my_storage_location === 2) {        // 内容数据存储在 ETH 链
	}
	else if (my_storage_location === 6) {        // 内容数据存储在 Arweave 链
		per_trn_len = arweave_per_trn_len_post_item;
	}
	else {                                       // 内容数据存储在其他链
		return;
	}

	let my_len = origin_data_of_item.length;
	let my_num = Math.ceil(my_len / per_trn_len);  // 按照长度将内容分割为多个部分，计算数量，向上取整
	times_of_txn += my_num;

	if (get_cookie('i18n_lang') === "zh") alert("需要发送的交易次数总共为：" + times_of_txn + "。请确保您的帐户有足够余额以及足够的CPU/NET资源。");
	else                                  alert("The total number of transactions to be sent is: " + times_of_txn + ". Please ensure that your account has sufficient balance and sufficient CPU/NET resources");
}

function post_item()
{
}

function resume_from_break_point_post_item()
{
}
