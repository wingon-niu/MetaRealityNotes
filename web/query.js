
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
					lower_bound: lower_bd.toFixed(),
					upper_bound: upper_bd.toFixed(),
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
					let f = '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].article_hash + '}\');">id' + resp.rows[i].article_id + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
					if (resp.rows[i].forward_article_id > 0) {
						f = f + '<span>' + $("#forward_article").html() + '</span>&nbsp;<a href="##" onclick="show_article_content_div(' + resp.rows[i].forward_article_id + ');">id' + resp.rows[i].forward_article_id + '</a>';
					}
					articles = articles + '<div><table width="100%" border="0">';
					articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td>' + f + '<pre id="content_of_article_' + resp.rows[i].article_id + '" onclick="show_article_content_div(' + resp.rows[i].article_id + ');">&nbsp;</pre></td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				$("#real_notes_div").html(articles);
				$("#my_modal_loading").modal('close');
				for (i = 0; i < len; i++) {
					let memo        = '';
					let next_hash   = '';
					let content     = '';
					let transaction = null;
					if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						transaction = await rpc.history_get_transaction(resp.rows[i].article_hash);
						memo = transaction.trx.trx.actions[0].data.memo;
						next_hash = memo.slice(0, memo.indexOf('}') + 1);
						if (next_hash.length > 2) {
							next_hash = memo.slice(1, memo.indexOf('}'));
						} else {
							next_hash = '';
						}
						content = memo.slice(memo.indexOf('}') + 1, memo.length);
						if (resp.rows[i].type === 2) {                                                // 长文
							transaction = await rpc.history_get_transaction(next_hash);
							memo = transaction.trx.trx.actions[0].data.memo;
							content = '        ' + content + '\n';
							content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
						}
					}
					else {      // 数据存储在其他链上
					}
					$("#content_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content));
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
					lower_bound: lower_bd.toFixed(),
					upper_bound: upper_bd.toFixed(),
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
					let f = '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].article_hash + '}\');">id' + resp.rows[i].article_id + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
					if (resp.rows[i].forward_article_id > 0) {
						f = f + '<span>' + $("#forward_article").html() + '</span>&nbsp;<a href="##" onclick="show_article_content_div(' + resp.rows[i].forward_article_id + ');">id' + resp.rows[i].forward_article_id + '</a>';
					}
					articles = articles + '<div><table width="100%" border="0">';
					articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td>' + f + '<pre id="content_of_article_' + resp.rows[i].article_id + '" onclick="show_article_content_div(' + resp.rows[i].article_id + ');">&nbsp;</pre></td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				$("#dream_notes_div").html(articles);
				$("#my_modal_loading").modal('close');
				for (i = 0; i < len; i++) {
					let memo        = '';
					let next_hash   = '';
					let content     = '';
					let transaction = null;
					if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						transaction = await rpc.history_get_transaction(resp.rows[i].article_hash);
						memo = transaction.trx.trx.actions[0].data.memo;
						next_hash = memo.slice(0, memo.indexOf('}') + 1);
						if (next_hash.length > 2) {
							next_hash = memo.slice(1, memo.indexOf('}'));
						} else {
							next_hash = '';
						}
						content = memo.slice(memo.indexOf('}') + 1, memo.length);
						if (resp.rows[i].type === 2) {                                                // 长文
							transaction = await rpc.history_get_transaction(next_hash);
							memo = transaction.trx.trx.actions[0].data.memo;
							content = '        ' + content + '\n';
							content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
						}
					}
					else {      // 数据存储在其他链上
					}
					$("#content_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content));
				}
				//
			} catch (e) {
				$("#dream_notes_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
				$("#my_modal_loading").modal('close');
				alert(e);
			}
		})();
	}
}

function show_article_content_div(article_id)
{
	if (current_note_category === "real" || current_note_category === "dream") {
		if (articles_array.length === 1) {
			doc_scroll_top = get_doc_scroll_top();
		}
		if (articles_array.indexOf(article_id) === -1) {
			articles_array.push(article_id);
		}
		current_article_id = article_id;
		$("#my_modal_loading").modal('open');

		var index_pos = 1;
		var lower_bd  = new BigNumber(article_id);
		var upper_bd  = new BigNumber(article_id + 1);

		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				var resp = await rpc.get_table_rows({
					json:  true,
					code:  metarealnote_contract,
					scope: metarealnote_contract,
					table: 'articles',
					index_position: index_pos,
					key_type: 'i64',
					lower_bound: lower_bd.toFixed(),
					upper_bound: upper_bd.toFixed(),
					limit: 1,
					reverse: false,
					show_payer: false
				});
				let articles = '';
				let i = 0;
				let len = resp.rows.length;
				if (len === 0) {
					if (get_cookie('i18n_lang') === "zh") articles = '<p>文章不存在或者已经被删除。</p>';
					else                                  articles = '<p>The article does not exist or has been deleted.</p>';
				}
				for (i = 0; i < len; i++) {
					let f = '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].article_hash + '}\');">id' + resp.rows[i].article_id + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
					if (resp.rows[i].forward_article_id > 0) {
						f = f + '<span>' + $("#forward_article").html() + '</span>&nbsp;<a href="##" onclick="show_article_content_div(' + resp.rows[i].forward_article_id + ');">id' + resp.rows[i].forward_article_id + '</a>';
					}
					articles = articles + '<div><table width="100%" border="0">';
					articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td>' + f + '<pre id="content_page_of_article_' + resp.rows[i].article_id + '">&nbsp;</pre></td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><a href="##" onclick="forward_an_article(' + resp.rows[i].article_id + ');">' + $("#forward").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="##" onclick="reply_an_article(' + resp.rows[i].article_id + ', 0);">' + $("#reply").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				$("#article_content_info_div").html(articles);
				$("#my_modal_loading").modal('close');
				for (i = 0; i < len; i++) {
					let memo        = '';
					let next_hash   = '';
					let content     = '';
					let transaction = null;
					if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						next_hash      = resp.rows[i].article_hash;
						let first_loop = true;
						do {
							transaction = await rpc.history_get_transaction(next_hash);
							memo = transaction.trx.trx.actions[0].data.memo;
							next_hash = memo.slice(0, memo.indexOf('}') + 1);
							if (next_hash.length > 2) {
								next_hash = memo.slice(1, memo.indexOf('}'));
							} else {
								next_hash = '';
							}
							content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
							if (resp.rows[i].type === 2 && first_loop) {                              // 长文
								content = '        ' + content + '\n';
							}
							first_loop = false;
						} while (next_hash != '');
					}
					else {      // 数据存储在其他链上
					}
					$("#content_page_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content));
				}
				//
				lower_bd  = new BigNumber(article_id);
				lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

				upper_bd  = new BigNumber(article_id + 1);
				upper_bd  = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				upper_bd  = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

				resp = await rpc.get_table_rows({
					json:  true,
					code:  metarealnote_contract,
					scope: metarealnote_contract,
					table: 'replies',
					index_position: 2,
					key_type: 'i128',
					lower_bound: lower_bd.toFixed(),
					upper_bound: upper_bd.toFixed(),
					limit: 100,
					reverse: false,
					show_payer: false
				});
				let replies = '';
				i   = 0;
				len = resp.rows.length;
				if (len === 0) {
					replies = '&nbsp;';
				}
				for (i = 0; i < len; i++) {
					let f = '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].reply_hash + '}\');">id' + resp.rows[i].reply_id + '</a>&nbsp;&nbsp;';
					if (resp.rows[i].target_reply_id > 0) {
						f = f + $("#reply_to").html() + '&nbsp;<span class="user_of_reply_' + resp.rows[i].target_reply_id + '">&nbsp;</span>&nbsp;id' + resp.rows[i].target_reply_id;
					}
					replies = replies + '<div><table width="100%" border="0">';
					replies = replies + '<tr>' + '<td rowspan="3" width="30" align="center" valign="top">&nbsp;</td>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					replies = replies + '<tr>' + '<td>' + f + '<pre id="content_of_reply_' + resp.rows[i].reply_id + '">&nbsp;</pre></td>' + '</tr>';
					replies = replies + '<tr>' + '<td align="right"><a href="##" onclick="reply_an_article(' + current_article_id + ', ' + resp.rows[i].reply_id + ');">' + $("#reply").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					replies = replies + '</table></div><hr />';
				}
				$("#article_replies_div").html(replies);
				for (i = 0; i < len; i++) {
					let memo        = '';
					let next_hash   = '';
					let content     = '';
					let transaction = null;
					if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						next_hash      = resp.rows[i].reply_hash;
						do {
							transaction = await rpc.history_get_transaction(next_hash);
							memo = transaction.trx.trx.actions[0].data.memo;
							next_hash = memo.slice(0, memo.indexOf('}') + 1);
							if (next_hash.length > 2) {
								next_hash = memo.slice(1, memo.indexOf('}'));
							} else {
								next_hash = '';
							}
							content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
						} while (next_hash != '');
					}
					else {      // 数据存储在其他链上
					}
					$("#content_of_reply_" + resp.rows[i].reply_id).html(my_escapeHTML(content));
				}
				//
				for (i = 0; i < len; i++) {
					if (resp.rows[i].target_reply_id > 0) {
						let user = '';
						if (false) {
						} else {
							lower_bd  = new BigNumber(resp.rows[i].target_reply_id);
							upper_bd  = new BigNumber(resp.rows[i].target_reply_id + 1);
							var    r  = await rpc.get_table_rows({
								json:  true,
								code:  metarealnote_contract,
								scope: metarealnote_contract,
								table: 'replies',
								index_position: 1,
								key_type: 'i64',
								lower_bound: lower_bd.toFixed(),
								upper_bound: upper_bd.toFixed(),
								limit: 1,
								reverse: false,
								show_payer: false
							});
							if (r.rows.length === 1) {
								user = r.rows[0].user;
							}
						}
						$(".user_of_reply_" + resp.rows[i].target_reply_id).html(my_escapeHTML(user));
					}
				}
				//
				hide_all_pages();
				$("#article_content_div").show();
				window.scrollTo(0, 0);
			} catch (e) {
				$("#my_modal_loading").modal('close');
				hide_all_pages();
				$("#article_content_div").show();
				window.scrollTo(0, 0);
				alert(e);
			}
		})();
	}
}



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
