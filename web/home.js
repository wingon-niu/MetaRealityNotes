
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
		//get_public_albums();
	});

	$("#tab_dream").on("click", function() {
		current_note_category = "dream";
		current_article_id = 0;
		//get_private_albums();
	});

	$("#article_content_div").hide();

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
			if (get_cookie('i18n_lang') === "zh") alert("请先登录。");
			else                                  alert("Please login.");
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
			//get_public_albums()
	    }, 1000
	);
});

function go_back()
{
	if (current_note_category != "" && current_article_id != 0) {
		current_article_id = 0;
		$("#article_content_div").hide();
		$("#all_tabs").show();
		window.scrollTo(0, doc_scroll_top);
	}
}

function write_an_article_show_modal()
{
	$('#div_write_an_article').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function check_post_article()
{
	let my_type = $("input[name='radio11']:checked").val();  // 微文还是长文
	if (my_type === "2") { // 长文
		let s = $("#title_of_article").val().trim();
		if (s.length === 0 || s.length > 36) {
			if (get_cookie('i18n_lang') === "zh") alert("错误：文章标题为空或者长度超出限制。");
			else                                  alert("Error: Title of article is blank, or too long.");
			return false;
		}
	}
	let my_storage_location = $("input[name='radio12']:checked").val();  // 存储位置
	if (my_storage_location != "1") { // 不是EOS
		if (get_cookie('i18n_lang') === "zh") alert("错误：文章内容数据目前只支持存储于EOS链上。");
		else                                  alert("Error: Only EOS block chain is supported at the moment.");
		return false;
	}
	let my_content = $("#content_of_article").val().trim();  // 文章内容
	if (my_content === "") {
		if (get_cookie('i18n_lang') === "zh") alert("错误：文章内容为空。");
		else                                  alert("Error: The content of article is blank.");
		return false;
	}
}

function view_times_of_txn_article()
{
	if (check_post_article() === false) return;

	let my_type               = Number($("input[name='radio11']:checked").val());
	let my_storage_location   = Number($("input[name='radio12']:checked").val());
	let my_content            = $("#content_of_article").val();

	let times_of_txn = 1;     // 需要的交易次数
	let per_trn_len  = 10;    // 每个交易memo存放的数据长度，不同的链设置不同的值

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
		if (my_type === 2) {                     // 长文
			times_of_txn += 1;                   // 长文的标题单独保存在一个交易的memo里
		}
		per_trn_len = eos_per_trn_len;
	} else {
		return;
	}

	let my_len = my_content.length;
	let my_num = Math.ceil(my_len / per_trn_len);  // 按照长度将内容分割为多个部分，计算数量，向上取整
	times_of_txn += my_num;

	if (get_cookie('i18n_lang') === "zh") alert("需要发送的交易次数总共为：" + times_of_txn + "。请确保您的帐户有足够余额以及足够的CPU/NET资源。");
	else                                  alert("The total number of transactions to be sent is: " + times_of_txn + ". Please ensure that your account has sufficient balance and sufficient CPU/NET resources");
}

function post_article()
{
	post_article_first_time = true;
	do_post_article();
}

function resume_from_break_point_post_article()
{
	if (post_article_first_time || trn_success) {
		if (get_cookie('i18n_lang') === "zh") alert("只有在交易发送过程中产生错误而中止，才可以使用断点续传功能。");
		else                                  alert("This function can only be used if the transaction is aborted due to an error in the sending process.");
	} else {
		do_post_article();
	}
}

function do_post_article()
{
	if (check_post_article() === false) return;

	let my_category           = Number($("input[name='radio10']:checked").val());
	let my_type               = Number($("input[name='radio11']:checked").val());
	let my_storage_location   = Number($("input[name='radio12']:checked").val());
	let my_forward_article_id = Number($("#forward_article_id").val());
	let my_quantity           = $("#amount_per_trn_article").val().trim();
	let my_title_of_article   = $("#title_of_article").val().trim();
	let my_content            = $("#content_of_article").val();

	let per_trn_len = 10;     // 每个交易memo存放的数据长度，不同的链设置不同的值
	let strArray    = [];

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
		if (my_type === 2) {                     // 长文
			strArray.push(my_title_of_article);  // 长文的标题单独保存在一个交易的memo里
		}
		per_trn_len = eos_per_trn_len;
	}
	else {        // 内容数据存储在其他链
		return;
	}

	let my_len = my_content.length;
	for (let i = 0; i < my_len; i += per_trn_len) {           // 按照长度将内容分割存入字符串数组
		strArray.push(my_content.slice(i, i + per_trn_len));
	}

	if (post_article_first_time) {                 // 如果是第一次发送文章
		post_article_first_time     = false;
		trn_hash                    = "";
		post_article_write_to_table = false;
		post_article_current_index  = strArray.length - 1;
	}

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
		send_transactions( function(api, account) {
			(async () => {
				try {
					var result = null;

					for (let j = post_article_current_index; j >= 0; j--) {
						post_article_current_index = j;
						result = await api.transact(
							{
								actions: [{
									account: 'eosio.token',
									name: 'transfer',
									authorization: [{
										actor: account.name,
										permission: account.authority
									}],
									data: {
										from: account.name,
										to: worldwelfare_contract,
										quantity: my_quantity,
										memo: '{' + trn_hash + '}' + strArray[j]
									}
								}]
							},{
								blocksBehind: 3,
								expireSeconds: 60
							}
						);
						if (typeof(result) === 'object' && result.transaction_id != "") {
							trn_success = true;
							trn_hash    = result.transaction_id;
						} else { trn_failed(); return; }
					}
					post_article_current_index = -1;
					if (post_article_write_to_table === false) {
						result = await api.transact(
							{
								actions: [{
									account: metarealnote_contract,
									name: 'postarticle',
									authorization: [{
										actor: account.name,
										permission: account.authority
									}],
									data: {
										user: account.name,
										article_hash: trn_hash,
										category: my_category,
										type: my_type,
										storage_location: my_storage_location,
										forward_article_id: my_forward_article_id
									}
								}]
							},{
								blocksBehind: 3,
								expireSeconds: 60
							}
						);
						if (typeof(result) === 'object' && result.transaction_id != "") {
							trn_success                 = true;
							post_article_write_to_table = true;
						} else { trn_failed(); return; }
					}
					alert("OK");
				} catch (e) {
					show_error(e);
				}
			})();
		});
	}
	else {        // 内容数据存储在其他链
		return;
	}
}



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
