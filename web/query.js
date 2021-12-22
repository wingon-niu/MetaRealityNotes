
function get_home_page_articles()
{
	let index_position = 3;
	let key_type       = 'i128';

	if (current_page === "home" && current_note_category === "real") {
		let lower_bd  = new BigNumber(1);
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		let upper_bd  = new BigNumber(2);
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		get_articles(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
		//
	} else if (current_page === "home" && current_note_category === "dream") {
		let lower_bd  = new BigNumber(2);
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		let upper_bd  = new BigNumber(3);
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		get_articles(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
		//
	} else {
	}
}

function get_user_articles(user)
{
	let index_position = 5;
	let key_type       = 'i128';

	let lower_bd  = new BigNumber( my_eos_name_to_uint64t(user) );
	let upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_articles(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
}

function get_articles(index_position, key_type, lower_bound, upper_bound)
{
	$("#my_modal_loading").modal('open');
	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			const resp = await rpc.get_table_rows({
				json:  true,
				code:  metarealnote_contract,
				scope: metarealnote_contract,
				table: 'articles',
				index_position: index_position,
				key_type: key_type,
				lower_bound: lower_bound,
				upper_bound: upper_bound,
				limit: items_per_page,
				reverse: false,
				show_payer: false					
			});
			let articles = '';
			let i = 0;
			let len = resp.rows.length;
			if (len === 0) {
				articles = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
			}
			// 以下逐个生成文章的基本信息
			for (i = 0; i < len; i++) {
				let cate = '';
				if (resp.rows[i].category === 1) {
					cate = $("#real").html() + '&nbsp;';
				} else if (resp.rows[i].category === 2) {
					cate = $("#dream").html() + '&nbsp;';
				} else {
					cate = '';
				}
				let f = cate + '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].article_hash + '}\');">id' + resp.rows[i].article_id + '</a>&nbsp;&nbsp;&nbsp;';
				if (resp.rows[i].forward_article_id > 0) {
					f = f + '<span>' + $("#forward_article").html() + '</span>&nbsp;<a href="##" onclick="show_article_content_div(' + resp.rows[i].forward_article_id + ');">id' + resp.rows[i].forward_article_id + '</a>';
				}
				articles = articles + '<div><table width="100%" border="0">';
				articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
				articles = articles + '<tr>' + '<td>' + f + '<pre class="preview_of_article_' + resp.rows[i].article_id + '" onclick="show_article_content_div(' + resp.rows[i].article_id + ');">&nbsp;</pre></td>' + '</tr>';
				articles = articles + '<tr>' + '<td align="right"><span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
				articles = articles + '</table></div><hr />';
			}
			// 下一页
			if (resp.more === true) {
				articles = articles + '<table width="100%" border="0"><tr><td align="center"><a href="##" onclick="get_articles(' + index_position + ', \'' + key_type + '\', \'' + resp.next_key + '\', \'' + upper_bound + '\');">' + $("#next_page").html() + '</a></td></tr></table>';
			}
			// 以下按照当前页面将所有文章的基本信息赋值过去
			if (current_page === "home") {
				if (current_note_category === "real") {
					$("#real_notes_div").html(articles);
				} else if (current_note_category === "dream") {
					$("#dream_notes_div").html(articles);
				} else {
				}
			} else if (current_page === "my_articles") {
				$("#my_articles_info_div").html(articles);
			} else if (current_page === "articles_of_user_i_follow") {
				$("#articles_of_user_i_follow_info_div").html(articles);
			} else if (current_page === "articles_of_user_follow_me") {
				$("#articles_of_user_follow_me_info_div").html(articles);
			} else {
			}
			// 以下逐个查询文章预览
			for (i = 0; i < len; i++) {
				if (preview_of_article_map.has(resp.rows[i].article_id)) {
					$(".preview_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(preview_of_article_map.get(resp.rows[i].article_id)));
					//console.log("get");
				} else {
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
					$(".preview_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content));
					preview_of_article_map.set(resp.rows[i].article_id, content);
					//console.log("no get");
				}
			}
			$("#my_modal_loading").modal('close');
			window.scrollTo(0, 0);
		} catch (e) {
			$("#my_modal_loading").modal('close');
			alert(e);
		}
	})();
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
		var lower_bd  = new BigNumber( article_id );
		var upper_bd  = new BigNumber( lower_bd.plus(1) );

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
				// 以下生成文章的基本信息，实际只有一条记录，循环只会执行一次
				for (i = 0; i < len; i++) {
					let cate = '';
					if (resp.rows[i].category === 1) {
						cate = $("#real").html() + '&nbsp;';
					} else if (resp.rows[i].category === 2) {
						cate = $("#dream").html() + '&nbsp;';
					} else {
						cate = '';
					}
					let f = cate + '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].article_hash + '}\');">id' + resp.rows[i].article_id + '</a>&nbsp;&nbsp;&nbsp;';
					if (resp.rows[i].forward_article_id > 0) {
						f = f + '<span>' + $("#forward_article").html() + '</span>&nbsp;<a href="##" onclick="show_article_content_div(' + resp.rows[i].forward_article_id + ');">id' + resp.rows[i].forward_article_id + '</a>';
					}
					articles = articles + '<div><table width="100%" border="0">';
					articles = articles + '<tr>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td>' + f + '<pre class="content_of_article_' + resp.rows[i].article_id + '">&nbsp;</pre></td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><a href="##" onclick="forward_an_article(' + resp.rows[i].article_id + ');">' + $("#forward").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="##" onclick="reply_an_article(' + resp.rows[i].article_id + ', 0);">' + $("#reply").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				$("#article_content_info_div").html(articles);
				// 以下查询文章的全文，实际只有一条记录，循环只会执行一次
				for (i = 0; i < len; i++) {
					if (content_of_article_map.has(resp.rows[i].article_id)) {
						$(".content_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content_of_article_map.get(resp.rows[i].article_id)));
						console.log("get");
					} else {
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
						$(".content_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content));
						content_of_article_map.set(resp.rows[i].article_id, content);
						console.log("no get");
					}
				}
				// 以下查询文章的回复
				lower_bd  = new BigNumber( article_id );
				upper_bd  = new BigNumber( lower_bd.plus(1) );

				lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
				lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

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
				// 以下生成所有回复的基本信息
				for (i = 0; i < len; i++) {
					let f = '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].reply_hash + '}\');">id' + resp.rows[i].reply_id + '</a>&nbsp;&nbsp;';
					if (resp.rows[i].target_reply_id > 0) {
						f = f + $("#reply_to").html() + '&nbsp;<span class="user_of_reply_' + resp.rows[i].target_reply_id + '">&nbsp;</span>&nbsp;id' + resp.rows[i].target_reply_id;
					}
					replies = replies + '<div><table width="100%" border="0">';
					replies = replies + '<tr>' + '<td rowspan="3" width="30" align="center" valign="top">&nbsp;</td>' + '<td rowspan="3" width="64" align="center" valign="top"><span class="am-icon-user"></span></td>' + '<td>' + resp.rows[i].user + '&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					replies = replies + '<tr>' + '<td>' + f + '<pre class="content_of_reply_' + resp.rows[i].reply_id + '">&nbsp;</pre></td>' + '</tr>';
					replies = replies + '<tr>' + '<td align="right"><a href="##" onclick="reply_an_article(' + current_article_id + ', ' + resp.rows[i].reply_id + ');">' + $("#reply").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
					replies = replies + '</table></div><hr />';
					reply_user_map.set(resp.rows[i].reply_id, resp.rows[i].user);
				}
				$("#article_replies_div").html(replies);
				// 以下查询所有回复的全文
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
					$(".content_of_reply_" + resp.rows[i].reply_id).html(my_escapeHTML(content));
				}
				// 以下查询所有目标回复的用户名
				for (i = 0; i < len; i++) {
					if (resp.rows[i].target_reply_id > 0) {
						let user = '';
						if (reply_user_map.has(resp.rows[i].target_reply_id)) {
							user = reply_user_map.get(resp.rows[i].target_reply_id);
							//console.log("get");
						} else {
							lower_bd  = new BigNumber( resp.rows[i].target_reply_id );
							upper_bd  = new BigNumber( lower_bd.plus(1) );
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
								reply_user_map.set(resp.rows[i].target_reply_id, user);
								//console.log("no get");
							}
						}
						$(".user_of_reply_" + resp.rows[i].target_reply_id).html(my_escapeHTML(user));
					}
				}
				$("#my_modal_loading").modal('close');
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
