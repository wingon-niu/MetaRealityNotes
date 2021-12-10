
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
