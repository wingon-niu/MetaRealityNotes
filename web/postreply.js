
function reply_an_article(article_id)
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	$("#target_article_id").val(article_id.toString());
	$("#target_reply_id").val("0");
	write_a_reply_show_modal();
}

function write_a_reply_show_modal()
{
	$('#div_write_a_reply').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function check_post_reply()
{
	let my_target_article_id = Number($("#target_article_id").val());
	let my_target_reply_id   = Number($("#target_reply_id").val());
	if ( !( my_target_article_id > 0 && my_target_reply_id === 0 || my_target_article_id === 0 && my_target_reply_id > 0 ) ) {
		alert("target_article_id is wrong or target_reply_id is wrong.");
		return false;
	}
	let my_storage_location = $("input[name='radio20']:checked").val();  // 存储位置
	if (my_storage_location != "1") { // 不是EOS
		if (get_cookie('i18n_lang') === "zh") alert("错误：回复内容数据目前只支持存储于EOS链上。");
		else                                  alert("Error: Only EOS block chain is supported at the moment.");
		return false;
	}
	let my_content = $("#content_of_reply").val().trim();  // 回复内容
	if (my_content === "") {
		if (get_cookie('i18n_lang') === "zh") alert("错误：回复内容为空。");
		else                                  alert("Error: The content of reply is blank.");
		return false;
	}
	return true;
}

function view_times_of_txn_reply()
{
	if (check_post_reply() === false) return;
}
