
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
}

function post_article()
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
	} else {
		return;
	}

	let my_len = my_content.length;
	for (let i = 0; i < my_len; i += per_trn_len) {           // 按照长度将内容分割存入字符串数组
		strArray.push(my_content.slice(i, i + per_trn_len));
	}

	send_transactions( function(api, account) {
		(async () => {
			try {
				trn_hash   = '';
				var result = null;

				for (let j = strArray.length - 1; j >= 0; j--) {
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
									memo: '{' + trn_hash + '}' + strArray[j];
								}
							}]
						},{
							blocksBehind: 3,
							expireSeconds: 60
						}
					);
					process_result(result);
					if (! trn_success) {
						alert("error will be catched by try-catch outside.");
						return;
					}
				}
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
				process_result(result);
				if (! trn_success) {
					alert("error will be catched by try-catch outside.");
					return;
				}
				alert("OK");
			} catch (e) {
				show_error(e);
			}
		})();
	});
}



//function get_public_albums()
//{
//	if (current_album_type == "public") {
//		$("#my_modal_loading").modal('open');
//		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
//		(async () => {
//			try {
//				const resp = await rpc.get_table_rows({ // 公共相册数量不多，假设不超过100个。
//					json:  true,
//					code:  contract_name,
//					scope: contract_name,
//					table: 'pubalbums',
//					limit: 100,
//					reverse: false,
//					show_payer: false
//				});
//				var albums = '';
//				var album_name = "";
//				var i = 0;
//				var len = resp.rows.length;
//				if (len == 0) {
//					albums = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
//				}
//				for (i = 0; i < len; i++) {
//					if (get_cookie('i18n_lang') == "zh") {
//						album_name = resp.rows[i].name_cn;
//					} else {
//						album_name = resp.rows[i].name_en;
//					}
//					albums = albums + '<div class="am-u-sm-6 am-u-md-4 am-u-lg-2"><div class="am-thumbnail">';
//					albums = albums + '<img src="' + ipfs_root_url + resp.rows[i].cover_thumb_pic_ipfs_hash + '" alt="cover pic" onclick=\'show_pics_div(' + resp.rows[i].pub_album_id + ', "' + album_name + '");\'/>';
//					albums = albums + '<div class="am-thumbnail-caption">';
//					albums = albums + '<p class="am-text-xs">id: ' + resp.rows[i].pub_album_id + '<br />' + album_name + ' (' + resp.rows[i].pic_num + ')<br />' + timestamp_trans(resp.rows[i].create_time) + ' UTC</p>';
//					albums = albums + '</div></div></div>';
//				}
//				$("#public_albums_div").html(albums);
//				$("#my_modal_loading").modal('close');
//			} catch (e) {
//				$("#public_albums_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
//				$("#my_modal_loading").modal('close');
//				alert(e);
//			}
//		})();
//	}
//}
//
//function get_private_albums()
//{
//	if (current_album_type == "private" && current_user_account != "") {
//		$("#my_modal_loading").modal('open');
//		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
//		(async () => {
//			try {
//				const resp = await rpc.get_table_rows({ // 假设每位用户的个人相册数量不超过100个。
//					json:  true,
//					code:  contract_name,
//					scope: contract_name,
//					table: 'albums',
//					index_position: 2,
//					key_type: 'name',
//					lower_bound: current_user_account,
//					limit: 100,
//					reverse: false,
//					show_payer: false
//				});
//				var albums = '';
//				var album_count = 0;
//				var i = 0;
//				var len = resp.rows.length;
//				for (i = 0; i < len; i++) {
//					if (resp.rows[i].owner != current_user_account) { break; }
//					albums = albums + '<div class="am-u-sm-6 am-u-md-4 am-u-lg-2"><div class="am-thumbnail">';
//					albums = albums + '<img src="' + ipfs_root_url + resp.rows[i].cover_thumb_pic_ipfs_hash + '" alt="cover pic" onclick=\'show_pics_div(' + resp.rows[i].album_id + ', "' + resp.rows[i].name + '");\'/>';
//					albums = albums + '<div class="am-thumbnail-caption">';
//					albums = albums + '<p class="am-text-xs">id: ' + resp.rows[i].album_id + '<br />' + resp.rows[i].name + ' (' + resp.rows[i].pic_num + ')<br />' + timestamp_trans(resp.rows[i].create_time) + ' UTC</p>';
//					albums = albums + '<div class="am-dropdown am-dropdown-up" id="my_dropdown_' + i + '" data-am-dropdown>';
//					albums = albums + '<button class="am-btn am-btn-success am-round am-dropdown-toggle" onclick="show_my_dropdown(' + i + ');" data-am-dropdown-toggle>action <span class="am-icon-caret-up"></span></button><ul class="am-dropdown-content">';
//					if (get_cookie('i18n_lang') === "zh") {
//						albums = albums + '<li><a href="##" onclick="renamealbum('    + resp.rows[i].album_id + ',' + i + ');">修改相册名字</a></li>';
//						albums = albums + '<li><a href="##" onclick="alert(\'delete ' + resp.rows[i].album_id + '\');">delete</a></li>';
//					} else {
//						albums = albums + '<li><a href="##" onclick="renamealbum('    + resp.rows[i].album_id + ',' + i + ');">rename</a></li>';
//						albums = albums + '<li><a href="##" onclick="alert(\'delete ' + resp.rows[i].album_id + '\');">delete</a></li>';
//					}
//					albums = albums + '</ul></div></div></div></div>';
//					album_count++;
//				}
//				$("#private_albums_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
//				if (album_count == 0) {
//					if (get_cookie('i18n_lang') === "zh") albums = '<p>&nbsp;</p><p>您还没有创建个人相册。</p><p>&nbsp;</p>';
//					else                                  albums = '<p>&nbsp;</p><p>You have no albums.   </p><p>&nbsp;</p>';
//				}
//				$("#private_albums_div").html(albums);
//				$("#my_modal_loading").modal('close');
//			} catch (e) {
//				$("#private_albums_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
//				$("#my_modal_loading").modal('close');
//				alert(e);
//			}
//		})();
//	} else {
//		if (get_cookie('i18n_lang') === "zh") $("#private_albums_div").html('<p>&nbsp;</p><p>请登录。     </p><p>&nbsp;</p>');
//		else                                  $("#private_albums_div").html('<p>&nbsp;</p><p>Please login.</p><p>&nbsp;</p>');
//	}
//}
//
//function show_pics_div(album_id, album_name)
//{
//	if (current_album_type == "public" || current_album_type == "private" && current_user_account != "") {
//		current_album_name = album_name;
//		$("#current_album_name").html("&nbsp;" + current_album_name);
//		doc_scroll_top = get_doc_scroll_top();
//		$("#my_modal_loading").modal('open');
//
//		var index_pos = 0;
//		var lower_bd  = new BigNumber(0);
//
//		if (current_album_type == "private") {
//			index_pos = 3;
//			lower_bd  = BigNumber(album_id);
//		} else if (current_album_type == "public") {
//			index_pos = 4;
//			lower_bd  = BigNumber(album_id).multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
//		} else {
//			$("#my_modal_loading").modal('close');
//			alert("Unknown error.");
//			return;
//		}
//
//		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
//		(async () => {
//			try {
//				const resp = await rpc.get_table_rows({ // 假设每个公共相册和个人相册里面的图片数量都不超过2000个。
//					json:  true,
//					code:  contract_name,
//					scope: contract_name,
//					table: 'pics',
//					index_position: index_pos,
//					key_type: 'i64',
//					lower_bound: lower_bd,
//					limit: 2000,
//					reverse: false,
//					show_payer: false
//				});
//				var pics = '';
//				var pic_count = 0;
//				var i = 0;
//				var len = resp.rows.length;
//				for (i = 0; i < len; i++) {
//					if (current_album_type == "private") {
//						if (album_id != resp.rows[i].album_id) { break; }
//					} else {
//						if (album_id != resp.rows[i].public_album_id) { break; }
//					}
//					pics = pics + '<li><div class="am-gallery-item">';
//					pics = pics + '<img src="' + ipfs_root_url + resp.rows[i].thumb_ipfs_hash + '" data-rel="' + ipfs_root_url + resp.rows[i].ipfs_hash + '" alt="' + resp.rows[i].name + '" />';
//					pics = pics + '<div class="am-text-xs">' + resp.rows[i].name + ' (' + resp.rows[i].upvote_num + ')<br />pic id: ' + resp.rows[i].pic_id + '<br />own: ' + resp.rows[i].owner + '<br />public album id: ' + resp.rows[i].public_album_id + '<br />display priority: ' + resp.rows[i].sort_fee + '<br />' + timestamp_trans(resp.rows[i].upload_time) + ' UTC</div>';
//					pics = pics + '<div class="am-text-xs" style="width:100%;padding:1px;text-overflow: ellipsis;overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;line-height: 1.3em;max-height: 3.9em;" onclick="show_pic_detail(\'' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(resp.rows[i].detail)) + '\');">' + resp.rows[i].detail + '</div>';
//					pics = pics + '<div class="am-dropdown am-dropdown-up" id="pic_dropdown_' + i + '" data-am-dropdown>';
//					pics = pics + '<button class="am-btn am-btn-success am-round am-dropdown-toggle" onclick="show_pic_dropdown(' + i + ');" data-am-dropdown-toggle>action <span class="am-icon-caret-up"></span></button><ul class="am-dropdown-content">';
//					if (get_cookie('i18n_lang') === "zh") {
//						if (current_album_type === "private") {
//							pics = pics + '<li><a href="##" onclick="modifypicnd('              + resp.rows[i].pic_id + ',' + i + ');">修改名字和描述</a></li>';
//							pics = pics + '<li><a href="##" onclick="setcover('                 + resp.rows[i].album_id + ',\'' + resp.rows[i].thumb_ipfs_hash + '\',' + i + ');">设置为所属个人相册的封面</a></li>';
//							pics = pics + '<li><a href="##" onclick="movetoalbum('              + resp.rows[i].pic_id + ',' + i + ');">移入另一个个人相册</a></li>';
//							pics = pics + '<li><a href="##" onclick="joinpubalbum('             + resp.rows[i].pic_id + ',' + i + ');">加入公共相册</a></li>';
//							pics = pics + '<li><a href="##" onclick="outpubalbum('              + resp.rows[i].pic_id + ',' + i + ');">移出所属公共相册</a></li>';
//							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">支付在公共相册中优先显示的费用</a></li>';
//							pics = pics + '<li><a href="##" onclick="alert(\'delete '           + resp.rows[i].pic_id + '\');">delete</a></li>';
//						} else {
//							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">支付在公共相册中优先显示的费用</a></li>';
//							pics = pics + '<li><a href="##" onclick="upvotepic('                + resp.rows[i].pic_id + ',' + i + ');">点赞</a></li>';
//							pics = pics + '<li><a href="##" onclick="alert(\'rm illegal pic '   + resp.rows[i].pic_id + '\');">rm illegal pic</a></li>';
//						}
//					} else {
//						if (current_album_type === "private") {
//							pics = pics + '<li><a href="##" onclick="modifypicnd('              + resp.rows[i].pic_id + ',' + i + ');">edit name and detail</a></li>';
//							pics = pics + '<li><a href="##" onclick="setcover('                 + resp.rows[i].album_id + ',\'' + resp.rows[i].thumb_ipfs_hash + '\',' + i + ');">set as cover of private album</a></li>';
//							pics = pics + '<li><a href="##" onclick="movetoalbum('              + resp.rows[i].pic_id + ',' + i + ');">move to another private album</a></li>';
//							pics = pics + '<li><a href="##" onclick="joinpubalbum('             + resp.rows[i].pic_id + ',' + i + ');">join public album</a></li>';
//							pics = pics + '<li><a href="##" onclick="outpubalbum('              + resp.rows[i].pic_id + ',' + i + ');">move out from public album</a></li>';
//							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">pay for display priority<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in public album</a></li>';
//							pics = pics + '<li><a href="##" onclick="alert(\'delete '           + resp.rows[i].pic_id + '\');">delete</a></li>';
//						} else {
//							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">pay for display priority<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in public album</a></li>';
//							pics = pics + '<li><a href="##" onclick="upvotepic('                + resp.rows[i].pic_id + ',' + i + ');">upvote</a></li>';
//							pics = pics + '<li><a href="##" onclick="alert(\'rm illegal pic '   + resp.rows[i].pic_id + '\');">rm illegal pic</a></li>';
//						}
//					}
//					pics = pics + '</ul></div></div></li>';
//					pic_count++;
//				}
//				if (pic_count <= 0) {
//					if (get_cookie('i18n_lang') === "zh") $("#pics_footer_msg").html('这个相册是空的。');
//					else                                  $("#pics_footer_msg").html('There are no pics in this album.');
//				} else {
//					$("#pics_footer_msg").html('&nbsp;');
//				}
//				$(".am-pureview-nav").html('');     // amaze ui need
//				$(".am-pureview-slider").html('');  // amaze ui need
//				$("#pics_ul").html(pics);
//				$("#my_modal_loading").modal('close');
//				$("#all_tabs").hide();
//				$("#pics_div").show();
//				window.scrollTo(0, 0);
//			} catch (e) {
//				$(".am-pureview-nav").html('');     // amaze ui need
//				$(".am-pureview-slider").html('');  // amaze ui need
//				$("#pics_ul").html('');
//				$("#pics_footer_msg").html('&nbsp;');
//				$("#my_modal_loading").modal('close');
//				$("#all_tabs").hide();
//				$("#pics_div").show();
//				window.scrollTo(0, 0);
//				alert(e);
//			}
//		})();
//	}
//}
//
//function show_my_dropdown(index)
//{
//	$("#my_dropdown_" + index).dropdown('open');
//}
//
//function show_pic_dropdown(index)
//{
//	$("#pic_dropdown_" + index).dropdown('open');
//}
//
//function show_pic_detail(detail_base64)
//{
//	$("#view_pic_detail").val(CryptoJS.enc.Base64.parse(detail_base64).toString(CryptoJS.enc.Utf8));
//	$("#div_view_pic_detail").modal('open');
//}
//
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
