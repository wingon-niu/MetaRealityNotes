
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

function get_home_page_album_items()
{
}
