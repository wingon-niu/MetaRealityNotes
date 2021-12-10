
$(document).ready(function () {
	if ( get_cookie('i18n_lang') == undefined || get_cookie('i18n_lang') == null || get_cookie('i18n_lang') == "" ) {  
		change_lang("en");
	} else {
		change_lang( get_cookie('i18n_lang') );
	}

	$("#icon_cn").on("click", function() {
		change_lang("zh");
	});

	$("#icon_en").on("click", function() {
		change_lang("en");
	});

	$("#tab_real").on("click", function() {
		current_note_category = "real";
		current_article_id = 0;
		get_real_notes();
	});

	$("#tab_dream").on("click", function() {
		current_note_category = "dream";
		current_article_id = 0;
		get_dream_notes();
	});

	$("#article_content_div").hide();
	$("#my_articles_div").hide();
	$("#my_replies_div").hide();
	$("#users_i_follow_div").hide();
	$("#users_follow_me_div").hide();
	$("#articles_of_user_i_follow_div").hide();
	$("#articles_of_user_follow_me_div").hide();
	$("#my_messages_div").hide();

	page_control_init();

	$("#header_go_back").on("click", function() {
		go_back();
	});

	$("#login").on("click", function() {
		$("#menu_body").offCanvas('close');
		// 登录前必须先退出，因为scatter只能保存一个与网络无关的id
		if ( !(scatter === null) && scatter.identity ) {
			if (get_cookie('i18n_lang') === "zh") alert("请先退出，再进行登录。");
			else                                  alert("Please log off, then login.");
			return;
		}
		if (scatter === null) {
			ScatterJS.scatter.connect(current_my_app_name, current_network).then(
				my_login
			).catch(error => {
				show_error(error);
			});
		} else {
			scatter.connect(current_my_app_name, current_network).then(
				my_login
			).catch(error => {
				show_error(error);
			});
		}
	});

	$("#logoff").on("click", function() {
		$("#menu_body").offCanvas('close');
		my_logoff();
	});

	$("#write_an_article_href").on("click", function() {
		if(current_user_account === "") {
			alert($("#please_login").html());
			return;
		}
		$("#forward_article_id").val("0");
		write_an_article_show_modal();
	});

	$("#view_times_of_txn_article").on("click", function() {
		view_times_of_txn_article();
	});

	$("#post_article").on("click", function() {
		post_article();
	});

	$("#resume_from_break_point_post_article").on("click", function() {
		resume_from_break_point_post_article();
	});

	$("#micro_text").on("click", function() {
		$("#title_of_article").attr("disabled", true);
	});

	$("#long_text").on("click", function() {
		$("#title_of_article").attr("disabled", false);
	});

	//

	ScatterJS.plugins( new ScatterEOS() );
	setTimeout(
		function(){
			get_real_notes()
	    }, 1000
	);
});



//// 为图片点赞
//function upvotepic(pic_id, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//
//	send_transaction( function(api, account) {
//		return api.transact(
//			{
//				actions: [{
//					account: contract_name,
//					name: 'upvotepic',
//					authorization: [{
//						actor: account.name,
//						permission: account.authority
//					}],
//					data: {
//						user: account.name,
//						pic_id: pic_id
//					}
//				}]
//			},{
//				blocksBehind: 3,
//				expireSeconds: 60
//			}
//		);
//	});
//}
//
//// 修改图片的名字和描述
//function modifypicnd(pic_id, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//	$("#real_pic_id").val(pic_id);
//
//	if (get_cookie('i18n_lang') === "zh") {
//		$("#pic_new_name").attr("placeholder","最长12个汉字或36个英文字符");
//		$("#pic_new_detail").attr("placeholder","最长170个汉字或512个英文字符");
//	} else {
//		$("#pic_new_name").attr("placeholder","Up to 36 english characters.");
//		$("#pic_new_detail").attr("placeholder","Up to 512 english characters.");
//	}
//
//	$('#div_modifypicnd').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let real_pic_id = Number($("#real_pic_id").val());
//			let name_str   = $("#pic_new_name").val().trim();
//			let detail_str = $("#pic_new_detail").val().trim();
//			if (name_str.length === 0 || detail_str.length === 0) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：名字和描述不能为空。");
//				} else {
//					alert("Error: name and detail can not be blank.");
//				}
//				return;
//			}
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: contract_name,
//							name: 'modifypicnd',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								owner:      account.name,
//								pic_id:     real_pic_id,
//								new_name:   name_str,
//								new_detail: detail_str
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 将图片移动到另一个相册（图片可以在个人相册之间移动）
//function movetoalbum(pic_id, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//	$("#movetoalbum_pic_id").val(pic_id);
//
//	$('#div_movetoalbum').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let movetoalbum_pic_id = Number($("#movetoalbum_pic_id").val());
//			if ( !$.isNumeric( $("#movetoalbum_target_private_album_id").val() ) ) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：输入的内容不是有效的数字。");
//				} else {
//					alert("Error: Input is not a valid number.");
//				}
//				return;
//			}
//			let movetoalbum_target_private_album_id = Number($("#movetoalbum_target_private_album_id").val());
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: contract_name,
//							name: 'movetoalbum',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								owner:        account.name,
//								pic_id:       movetoalbum_pic_id,
//								dst_album_id: movetoalbum_target_private_album_id
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 将图片加入某个公共相册
//function joinpubalbum(pic_id, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//	$("#joinpubalbum_pic_id").val(pic_id);
//
//	$('#div_joinpubalbum').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let joinpubalbum_pic_id = Number($("#joinpubalbum_pic_id").val());
//			if ( !$.isNumeric( $("#joinpubalbum_target_public_album_id").val() ) ) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：输入的内容不是有效的数字。");
//				} else {
//					alert("Error: Input is not a valid number.");
//				}
//				return;
//			}
//			let joinpubalbum_target_public_album_id = Number($("#joinpubalbum_target_public_album_id").val());
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: contract_name,
//							name: 'joinpubalbum',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								owner:        account.name,
//								pic_id:       joinpubalbum_pic_id,
//								pub_album_id: joinpubalbum_target_public_album_id
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 将图片移出所属公共相册
//function outpubalbum(pic_id, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//
//	send_transaction( function(api, account) {
//		return api.transact(
//			{
//				actions: [{
//					account: contract_name,
//					name: 'outpubalbum',
//					authorization: [{
//						actor: account.name,
//						permission: account.authority
//					}],
//					data: {
//						owner:        account.name,
//						pic_id:       pic_id
//					}
//				}]
//			},{
//				blocksBehind: 3,
//				expireSeconds: 60
//			}
//		);
//	});
//}
//
//// 设置个人相册的封面图片
//function setcover(album_id, cover_thumb_pic_ipfs_hash, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//
//	send_transaction( function(api, account) {
//		return api.transact(
//			{
//				actions: [{
//					account: contract_name,
//					name: 'setcover',
//					authorization: [{
//						actor: account.name,
//						permission: account.authority
//					}],
//					data: {
//						owner:                     account.name,
//						album_id:                  album_id,
//						cover_thumb_pic_ipfs_hash: cover_thumb_pic_ipfs_hash
//					}
//				}]
//			},{
//				blocksBehind: 3,
//				expireSeconds: 60
//			}
//		);
//	});
//}
//
//// 修改个人相册的名字
//function renamealbum(album_id, dropdown_id)
//{
//	$("#my_dropdown_" + dropdown_id).dropdown('close');
//	$("#real_album_id").val(album_id);
//
//	if (get_cookie('i18n_lang') === "zh") {
//		$("#album_new_name").attr("placeholder","最长12个汉字或36个英文字符");
//	} else {
//		$("#album_new_name").attr("placeholder","Up to 36 english characters.");
//	}
//
//	$('#div_renamealbum').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let real_album_id = Number($("#real_album_id").val());
//			let name_str   = $("#album_new_name").val().trim();
//			if (name_str.length === 0) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：名字不能为空。");
//				} else {
//					alert("Error: name can not be blank.");
//				}
//				return;
//			}
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: contract_name,
//							name: 'renamealbum',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								owner:      account.name,
//								album_id:   real_album_id,
//								new_name:   name_str
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 查询余额
//function query_balance()
//{
//	if (current_user_account != "") {
//		$("#my_modal_loading").modal('open');
//		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
//		(async () => {
//			try {
//				const resp = await rpc.get_table_rows({
//					json:  true,
//					code:  contract_name,
//					scope: contract_name,
//					table: 'accounts',
//					index_position: 1,
//					key_type: 'name',
//					lower_bound: current_user_account,
//					limit: 1,
//					reverse: false,
//					show_payer: false
//				});
//				let len = resp.rows.length;
//				if (len === 0) {
//					$("#your_balance").val("0");
//				} else {
//					if (resp.rows[0].owner === current_user_account) {
//						$("#your_balance").val(resp.rows[0].quantity);
//					} else {
//						$("#your_balance").val("0");
//					}
//				}
//				$("#my_modal_loading").modal('close');
//				$('#div_query_balance').modal({
//					relatedTarget: this,
//					onCancel: function() {
//					},
//					onConfirm: function() {
//					}
//				});
//			} catch (e) {
//				$("#my_modal_loading").modal('close');
//				alert(e);
//			}
//		})();
//	} else {
//		if (get_cookie('i18n_lang') === "zh") alert("请登录。");
//		else                                  alert("Please login.");
//	}
//}
//
//// 充值
//function deposit()
//{
//	if (current_user_account === "") {
//		if (get_cookie('i18n_lang') === "zh") { alert("请登录。"); }
//		else                                  { alert("Please login."); }
//		return;
//	}
//
//	$('#div_deposit').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let quantity_str = $("#deposit_quantity").val().trim();
//			if (quantity_str.length === 0) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：充值数量不能为空。");
//				} else {
//					alert("Error: deposit quantity can not be blank.");
//				}
//				return;
//			}
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: 'eosio.token',
//							name: 'transfer',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								from: account.name,
//								to: contract_name,
//								quantity: quantity_str,
//								memo: 'albumoftimes deposit'
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 提现
//function withdraw()
//{
//	if (current_user_account === "") {
//		if (get_cookie('i18n_lang') === "zh") { alert("请登录。"); }
//		else                                  { alert("Please login."); }
//		return;
//	}
//
//	$('#div_withdraw').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let quantity_str = $("#withdraw_quantity").val().trim();
//			if (quantity_str.length === 0) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：提现数量不能为空。");
//				} else {
//					alert("Error: withdraw quantity can not be blank.");
//				}
//				return;
//			}
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: contract_name,
//							name: 'withdraw',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								to: account.name,
//								quantity: quantity_str
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 为公共相册中的图片支付排序靠前的费用
//function paysortfee(pic_id, dropdown_id)
//{
//	$("#pic_dropdown_" + dropdown_id).dropdown('close');
//	$("#paysortfee_pic_id").val(pic_id);
//
//	if (current_user_account === "") {
//		if (get_cookie('i18n_lang') === "zh") { alert("请登录。"); }
//		else                                  { alert("Please login."); }
//		return;
//	}
//
//	$('#div_paysortfee').modal({
//		relatedTarget: this,
//		onCancel: function() {
//		},
//		onConfirm: function() {
//			let paysortfee_pic_id = Number($("#paysortfee_pic_id").val());
//			let quantity_str = $("#paysortfee_quantity").val().trim();
//			if (quantity_str.length === 0) {
//				if (get_cookie('i18n_lang') === "zh") {
//					alert("错误：支付数量不能为空。");
//				} else {
//					alert("Error: quantity can not be blank.");
//				}
//				return;
//			}
//
//			send_transaction( function(api, account) {
//				return api.transact(
//					{
//						actions: [{
//							account: contract_name,
//							name: 'paysortfee',
//							authorization: [{
//								actor: account.name,
//								permission: account.authority
//							}],
//							data: {
//								owner:   account.name,
//								pic_id:  paysortfee_pic_id,
//								sortfee: quantity_str
//							}
//						}]
//					},{
//						blocksBehind: 3,
//						expireSeconds: 60
//					}
//				);
//			});
//		}
//	});
//}
//
//// 创建个人相册
//function create_private_album()
//{
//	//
//}
