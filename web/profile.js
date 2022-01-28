
function show_user_info()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}

	query_user_profile(current_user_account);
}

function query_user_profile(user)
{
	$("#eos_account_name_label").html(user);

	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			var lower_bd  = new BigNumber( my_eos_name_to_uint64t(user) );
			var upper_bd  = new BigNumber( lower_bd.plus(1) );
			const resp = await rpc.get_table_rows({
				json:  true,
				code:  metarealnote_contract,
				scope: metarealnote_contract,
				table: 'userprofiles',
				index_position: 1,
				key_type: 'i64',
				lower_bound: lower_bd.toFixed(),
				upper_bound: upper_bd.toFixed(),
				limit: 1,
				reverse: false,
				show_payer: false
			});
			if (resp.rows.length === 1 && resp.rows[0].user === user) {
				$("#user_name_input_view").val           ( resp.rows[0].user_name                      );
				$("#user_family_name_input_view").val    ( resp.rows[0].user_family_name               );
				$("#user_gender_input_view").val         ( resp.rows[0].gender                         );
				$("#user_birthday_input_view").val       ( resp.rows[0].birthday                       );
				$("#user_description_textarea_view").val ( resp.rows[0].description                    );
				$("#user_avatar_id_label").html          ( resp.rows[0].avatar_album_item_id           );
				$("#num_of_articles_label").html         ( resp.rows[0].num_of_articles                );
				$("#num_of_replies_label").html          ( resp.rows[0].num_of_replies                 );
				$("#num_of_follow_label").html           ( resp.rows[0].num_of_follow                  );
				$("#num_of_followed_label").html         ( resp.rows[0].num_of_followed                );
				$("#num_of_album_items_label").html      ( resp.rows[0].num_of_album_items             );
				$("#user_reg_time_label").html           ( timestamp_trans_full(resp.rows[0].reg_time) );
			} else {
				$("#user_name_input_view").val           ( "N/A" );
				$("#user_family_name_input_view").val    ( "N/A" );
				$("#user_gender_input_view").val         ( "N/A" );
				$("#user_birthday_input_view").val       ( "N/A" );
				$("#user_description_textarea_view").val ( "N/A" );
				$("#user_avatar_id_label").html          ( "N/A" );
				$("#num_of_articles_label").html         ( "N/A" );
				$("#num_of_replies_label").html          ( "N/A" );
				$("#num_of_follow_label").html           ( "N/A" );
				$("#num_of_followed_label").html         ( "N/A" );
				$("#num_of_album_items_label").html      ( "N/A" );
				$("#user_reg_time_label").html           ( "N/A" );
			}
		} catch (e) {
			alert(e);
		}
	})();

	$('#div_view_profile').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function create_edit_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		$("#menu_body").offCanvas('close');
		return;
	}
	$("#menu_body").offCanvas('close');

	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			var lower_bd  = new BigNumber( my_eos_name_to_uint64t(current_user_account) );
			var upper_bd  = new BigNumber( lower_bd.plus(1) );
			const resp = await rpc.get_table_rows({
				json:  true,
				code:  metarealnote_contract,
				scope: metarealnote_contract,
				table: 'userprofiles',
				index_position: 1,
				key_type: 'i64',
				lower_bound: lower_bd.toFixed(),
				upper_bound: upper_bd.toFixed(),
				limit: 1,
				reverse: false,
				show_payer: false
			});
			if (resp.rows.length === 1 && resp.rows[0].user === current_user_account) {
				$("#user_name_input").val           ( resp.rows[0].user_name        );
				$("#user_family_name_input").val    ( resp.rows[0].user_family_name );
				$("#user_gender_input").val         ( resp.rows[0].gender           );
				$("#user_birthday_input").val       ( resp.rows[0].birthday         );
				$("#user_description_textarea").val ( resp.rows[0].description      );
			}
		} catch (e) {
			alert(e);
		}
	})();

	$('#div_create_edit_profile').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function save_profile()
{
	let user_name        = $("#user_name_input").val();
	let user_family_name = $("#user_family_name_input").val();
	let user_gender      = $("#user_gender_input").val();
	let user_birthday    = $("#user_birthday_input").val();
	let user_description = $("#user_description_textarea").val();

	if (user_name.length > 30) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：用户的名字长度超出限制。");
		else                                  alert("Error: User name is too long.");
		return;
	}
	if (user_family_name.length > 30) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：用户的姓长度超出限制。");
		else                                  alert("Error: User family name is too long.");
		return;
	}
	if (user_gender.length > 30) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：性别长度超出限制。");
		else                                  alert("Error: Gender is too long.");
		return;
	}
	if (user_birthday.length > 30) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：生日长度超出限制。");
		else                                  alert("Error: Birthday is too long.");
		return;
	}
	if (user_description.length > 300) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：用户简介长度超出限制。");
		else                                  alert("Error: Description is too long.");
		return;
	}

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: metarealnote_contract,
					name: 'userregist',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						user:             account.name,
						user_name:        user_name,
						user_family_name: user_family_name,
						gender:           user_gender,
						birthday:         user_birthday,
						description:      user_description
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}

function delete_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		$("#menu_body").offCanvas('close');
		return;
	}
	$("#menu_body").offCanvas('close');

	if (! confirm($("#delete_profile_confirm").html()) ) return;

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: metarealnote_contract,
					name: 'userunregist',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						user: account.name
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}
