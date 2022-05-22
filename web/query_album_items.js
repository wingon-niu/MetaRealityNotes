
// utf8 编码

function get_home_page_album_items()
{
	if(current_user_account === "") {
		if (get_cookie('i18n_lang') === "zh") $("#album_items_div").html("请登录EOS账户之后查看。");
		else                                  $("#album_items_div").html("Please log in to the EOS account.");
		return;
	}

	let index_position = 1;

	if (album_items_sort_by === "asc") {               // 升序
		index_position = 2;
	}
	else {                                             // 降序
		index_position = 3;
	}

	let key_type       = 'i128';

	let lower_bd  = new BigNumber( my_eos_name_to_uint64t(current_user_account) );
	let upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_album_items(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
}

function get_album_items(index_position, key_type, lower_bound, upper_bound)
{
}
