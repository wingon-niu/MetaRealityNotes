
function get_real_notes()
{
	if (current_note_category === "real") {
		$("#my_modal_loading").modal('open');
		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				let lower_bd  = new BigNumber(1);
				lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

				let upper_bd  = new BigNumber(2);
				upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

				const resp = await rpc.get_table_rows({ // 默认查询100条记录，以后再做翻页的功能
					json:  true,
					code:  metarealnote_contract,
					scope: metarealnote_contract,
					table: 'articles',
					index_position: 3,
					key_type: 'i128',
					lower_bound: lower_bd,
					upper_bound: upper_bd,
					limit: 100,
					reverse: false,
					show_payer: false					
				});
				let articles = '';
				let i = 0;
				let len = resp.rows.length;
				if (len === 0) {
					articles = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
				}
				for (i = 0; i < len; i++) {
					articles = articles + '<div><table width="100%" border="0">';
					articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td><textarea rows="3" style="width:100%;" id="content_of_article_' + resp.rows[i].article_id + '" placeholder="" readonly="readonly"></textarea></td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				$("#real_notes_div").html(articles);
				$("#my_modal_loading").modal('close');
				for (i = 0; i < len; i++) {
					$("#content_of_article_" + resp.rows[i].article_id).html(resp.rows[i].article_hash);
				}
				//
			} catch (e) {
				$("#real_notes_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
				$("#my_modal_loading").modal('close');
				alert(e);
			}
		})();
	}
}

function get_dream_notes()
{
	if (current_note_category === "dream") {
		$("#my_modal_loading").modal('open');
		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				let lower_bd  = new BigNumber(2);
				lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

				let upper_bd  = new BigNumber(3);
				upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

				const resp = await rpc.get_table_rows({ // 默认查询100条记录，以后再做翻页的功能
					json:  true,
					code:  metarealnote_contract,
					scope: metarealnote_contract,
					table: 'articles',
					index_position: 3,
					key_type: 'i128',
					lower_bound: lower_bd,
					upper_bound: upper_bd,
					limit: 100,
					reverse: false,
					show_payer: false					
				});
				let articles = '';
				let i = 0;
				let len = resp.rows.length;
				if (len === 0) {
					articles = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
				}
				for (i = 0; i < len; i++) {
					articles = articles + '<div><table width="100%" border="0">';
					articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td>aaa</td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				$("#dream_notes_div").html(articles);
				$("#my_modal_loading").modal('close');
				//
			} catch (e) {
				$("#dream_notes_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
				$("#my_modal_loading").modal('close');
				alert(e);
			}
		})();
	}
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
