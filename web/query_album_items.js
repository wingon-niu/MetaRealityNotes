
// utf8 编码

function get_home_page_album_items()
{
	if(current_user_account === "") {
		if (get_cookie('i18n_lang') === "zh") $("#album_items_div").html("请登录EOS账户之后查看。");
		else                                  $("#album_items_div").html("Please log in to the EOS account.");
		return;
	}
}
