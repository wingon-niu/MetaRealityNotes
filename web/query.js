
function get_home_page_articles()
{
	if (articles_sort_by === "article_post_time") {
		get_home_page_articles_sort_by_article_post_time();
	}
	else if (articles_sort_by === "last_replied_time") {
		get_home_page_articles_sort_by_last_replied_time();
	}
	else {
	}
}

function get_user_articles(user)
{
	if (articles_sort_by === "article_post_time") {
		get_user_articles_sort_by_article_post_time(user);
	}
	else if (articles_sort_by === "last_replied_time") {
		get_user_articles_sort_by_last_replied_time(user);
	}
	else {
	}
}

function get_home_page_articles_sort_by_article_post_time()
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

function get_home_page_articles_sort_by_last_replied_time()
{
	let index_position = 6;
	let key_type       = 'i128';

	if (current_page === "home" && current_note_category === "real") {
		let lower_bd  = new BigNumber(1);
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		let upper_bd  = new BigNumber(2);
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		get_articles(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
		//
	} else if (current_page === "home" && current_note_category === "dream") {
		let lower_bd  = new BigNumber(2);
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		let upper_bd  = new BigNumber(3);
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

		get_articles(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
		//
	} else {
	}
}

function get_user_articles_sort_by_article_post_time(user)
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

function get_user_articles_sort_by_last_replied_time(user)
{
	let index_position = 7;
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
				limit: article_num_per_page,
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
				articles = articles + '<tr>' + '<td rowspan="3" width="71" align="center" valign="top"><a href="##" onclick="query_user_profile(\'' + resp.rows[i].user + '\');">' + '<div class="div_user_avatar_' + convert_dot_to_underline(resp.rows[i].user) + '" style="width:64px; height:64px;"></div></a></td>' + '<td><a href="##" onclick="query_user_profile(\'' + resp.rows[i].user + '\');">' + resp.rows[i].user + '</a>&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
				articles = articles + '<tr>' + '<td>' + f + '<pre class="preview_of_article_' + resp.rows[i].article_id + '" onclick="show_article_content_div(' + resp.rows[i].article_id + ');">&nbsp;</pre></td>' + '</tr>';
				articles = articles + '<tr>' + '<td align="right"><a href="##" onclick="copy_article_link_to_clipboard(' + resp.rows[i].article_id + ');">' + $("#copy_link_only").html() + '</a>&nbsp;&nbsp;<span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;</td>' + '</tr>';
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
					//console.log("article preview get");
					$(".preview_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(preview_of_article_map.get(resp.rows[i].article_id)));
				} else {
					//console.log("article preview no get");
					let memo        = '';
					let next_hash   = '';
					let content     = '';
					let transaction = null;
					if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						let tmp_hash = resp.rows[i].article_hash;
						try {
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
								tmp_hash = next_hash;
								transaction = await rpc.history_get_transaction(next_hash);
								memo = transaction.trx.trx.actions[0].data.memo;
								content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
							}
						}
						catch (e) {                                  // 找不到某个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了。
							content = content + $("#content_chain_interruption_info_1").html() + tmp_hash + $("#content_chain_interruption_info_2").html();
						}
					}
					else if (resp.rows[i].storage_location === 2) {                                   // 数据存储在 ETH 链上
						let my_web3 = new Web3( new Web3.providers.HttpProvider(eth_http_provider) );
						transaction = await my_web3.eth.getTransaction(resp.rows[i].article_hash);
						if (transaction === null) {                                                   // 找不到这个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了
							content = content + $("#content_chain_interruption_info_1").html() + resp.rows[i].article_hash + $("#content_chain_interruption_info_2").html();
						}
						else if (transaction.blockHash === null) {                                    // 交易处在 pending 状态，未被打包进区块
							content = content + $("#transaction_pending_info_1").html() + resp.rows[i].article_hash + $("#transaction_pending_info_2").html();
						}
						else {                                                                        // 正常的交易
							memo = Web3.utils.hexToUtf8(transaction.input);
							content = memo.slice(memo.indexOf('}') + 1, memo.length);
							if (content.length > eth_article_preview_length) {
								content = content.slice(0, eth_article_preview_length);
							}
						}
					}
					else if (resp.rows[i].storage_location === 6) {                                   // 数据存储在 Arweave 链上
						try {
							let ar_response = await fetch(arweave_endpoint + resp.rows[i].article_hash);
							memo = await ar_response.text();
							content = memo.slice(memo.indexOf('}') + 1, memo.length);
							if (content.length > arweave_article_preview_length) {
								content = content.slice(0, arweave_article_preview_length);
							}
						}
						catch (e) {                                  // 找不到某个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了。
							content = content + $("#content_chain_interruption_info_1").html() + resp.rows[i].article_hash + $("#content_chain_interruption_info_2").html();
						}
					}
					else {      // 数据存储在其他链上
					}
					$(".preview_of_article_" + resp.rows[i].article_id).html(my_escapeHTML(content));
					preview_of_article_map.set(resp.rows[i].article_id, content);
				}
			}
			// 以下逐个查询文章的用户头像
			for (i = 0; i < len; i++) {
				let avatar = await get_user_avatar(resp.rows[i].user);
				$(".div_user_avatar_" + convert_dot_to_underline(resp.rows[i].user)).html(avatar);
			}
			// 以下处理直接进入某一篇文章的情况
			let go_directly_to_article = getUrlQueryVariable('article');
			if (go_directly_to_article !== '') {                          // 直接进入某一篇文章
				let str_tmp = window.location.href.toString();
				history.pushState('', '', str_tmp.slice(0, str_tmp.indexOf('?')));
				setTimeout(
					function(){
						show_article_content_div( Number(go_directly_to_article) )
					}, 200
				);
			}
			else {                                                        // 不直接进入某一篇文章，而是显示文章列表
				$("#my_modal_loading").modal('close');
				window.scrollTo(0, 0);
			}
		} catch (e) {
			$("#my_modal_loading").modal('close');
			alert(e);
		}
	})();
}

function show_article_content_div(article_id)
{
	if (current_note_category === "real" || current_note_category === "dream" || current_note_category === "album") {
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
				if ( len === 0 || ( len === 1 && resp.rows[0].article_id != article_id ) ) {
					if (get_cookie('i18n_lang') === "zh") articles = '<p>文章不存在或者已经被删除。</p>';
					else                                  articles = '<p>The article does not exist or has been deleted.</p>';
					$("#article_content_info_div").html(articles);
					$("#my_modal_loading").modal('close');
					hide_all_pages();
					$("#article_content_div").show();
					window.scrollTo(0, 0);
					return;
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
					articles = articles + '<tr>' + '<td rowspan="3" width="71" align="center" valign="top"><a href="##" onclick="query_user_profile(\'' + resp.rows[i].user + '\');">' + '<div class="div_user_avatar_' + convert_dot_to_underline(resp.rows[i].user) + '" style="width:64px; height:64px;"></div></a></td>' + '<td><a href="##" onclick="query_user_profile(\'' + resp.rows[i].user + '\');">' + resp.rows[i].user + '</a>&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
					articles = articles + '<tr>' + '<td>' + f + '<div class="content_of_article_' + resp.rows[i].article_id + '" style="border:1px solid #B6B6B6;">&nbsp;</div></td>' + '</tr>';
					articles = articles + '<tr>' + '<td align="right"><a href="##" onclick="forward_an_article(' + resp.rows[i].article_id + ');">' + $("#forward").html() + '</a>&nbsp;&nbsp;<a href="##" onclick="reply_an_article(' + resp.rows[i].article_id + ', 0);">' + $("#reply").html() + '</a>&nbsp;&nbsp;<a href="##" onclick="copy_article_link_to_clipboard(' + resp.rows[i].article_id + ');">' + $("#copy_link_only").html() + '</a>&nbsp;&nbsp;<span class="am-icon-share"></span>&nbsp;' + resp.rows[i].forwarded_times + '&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;</td>' + '</tr>';
					articles = articles + '</table></div><hr />';
				}
				// 将文章的基本信息赋值过去
				$("#article_content_info_div").html(articles);
				// 以下逐个查询文章的用户头像，实际只有一条记录，循环只会执行一次
				for (i = 0; i < len; i++) {
					let avatar = await get_user_avatar(resp.rows[i].user);
					$(".div_user_avatar_" + convert_dot_to_underline(resp.rows[i].user)).html(avatar);
				}
				// 以下查询文章的全文，实际只有一条记录，循环只会执行一次
				for (i = 0; i < len; i++) {
					if (content_of_article_map.has(resp.rows[i].article_id)) {
						//console.log("article get");
						let ec_content = my_escapeHTML(content_of_article_map.get(resp.rows[i].article_id));
						let content_1  = content_process_1(ec_content);
						$(".content_of_article_" + resp.rows[i].article_id).html(content_1);
						let str2 = await content_process_2(ec_content);
					} else {
						//console.log("article no get");
						let memo        = '';
						let next_hash   = '';
						let content     = '';
						let transaction = null;
						if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
							next_hash      = resp.rows[i].article_hash;
							try {
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
							catch (e) {                                  // 找不到某个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了。
								content = content + $("#content_chain_interruption_info_1").html() + next_hash + $("#content_chain_interruption_info_2").html();
							}
						}
						else if (resp.rows[i].storage_location === 2) {                                   // 数据存储在 ETH 链上
							let my_web3 = new Web3( new Web3.providers.HttpProvider(eth_http_provider) );
							next_hash   = resp.rows[i].article_hash;
							do {
								transaction = await my_web3.eth.getTransaction(next_hash);
								if (transaction === null) {                                                   // 找不到这个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了
									content = content + $("#content_chain_interruption_info_1").html() + next_hash + $("#content_chain_interruption_info_2").html();
									break;
								}
								else if (transaction.blockHash === null) {                                    // 交易处在 pending 状态，未被打包进区块
									content = content + $("#transaction_pending_info_1").html() + next_hash + $("#transaction_pending_info_2").html();
									break;
								}
								else {                                                                        // 正常的交易
									memo = Web3.utils.hexToUtf8(transaction.input);
									next_hash = memo.slice(0, memo.indexOf('}') + 1);
									if (next_hash.length > 2) {
										next_hash = memo.slice(1, memo.indexOf('}'));
									} else {
										next_hash = '';
									}
									content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
								}
							} while (next_hash != '');
						}
						else if (resp.rows[i].storage_location === 6) {                                   // 数据存储在 Arweave 链上
							try {
								next_hash   = resp.rows[i].article_hash;
								do {
									let ar_response = await fetch(arweave_endpoint + next_hash);
									memo = await ar_response.text();
									next_hash = memo.slice(0, memo.indexOf('}') + 1);
									if (next_hash.length > 2) {
										next_hash = memo.slice(1, memo.indexOf('}'));
									} else {
										next_hash = '';
									}
									content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
								} while (next_hash != '');
							}
							catch (e) {                                  // 找不到某个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了。
								content = content + $("#content_chain_interruption_info_1").html() + next_hash + $("#content_chain_interruption_info_2").html();
							}
						}
						else {      // 数据存储在其他链上
						}
						if (resp.rows[i].content_sha3_hash !== Web3.utils.sha3(content).slice(2)) {      // 内容的Sha3 Hash不一致
							if (get_cookie('i18n_lang') === "zh") alert("错误：文章的内容的Sha3 Hash不一致。文章id=" + resp.rows[i].article_id + "。");
							else                                  alert("Error: The sha3 hash of content of the article is not matched. Article id=" + resp.rows[i].article_id + ".");
						}
						content_of_article_map.set(resp.rows[i].article_id, content);
						let ec_content = my_escapeHTML(content);
						let content_1  = content_process_1(ec_content);
						$(".content_of_article_" + resp.rows[i].article_id).html(content_1);
						let str2 = await content_process_2(ec_content);
					}
				}
				// 以下查询文章的回复
				get_article_replies(article_id);

				//$("#my_modal_loading").modal('close');                  // 此处不需要关闭进度框。在查询回复列表完成的时候，会在那里关闭。
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

function get_article_replies(article_id)
{
	if (replies_sort_by === "ascending_order") {
		get_article_replies_sort_by_ascending_order(article_id);
	}
	else if (replies_sort_by === "descending_order") {
		get_article_replies_sort_by_descending_order(article_id);
	}
	else {
	}
}

function get_user_replies(user)
{
	if (replies_sort_by === "ascending_order") {
		get_user_replies_sort_by_ascending_order(user);
	}
	else if (replies_sort_by === "descending_order") {
		get_user_replies_sort_by_descending_order(user);
	}
	else {
	}
}

function get_article_replies_sort_by_descending_order(article_id)
{
	lower_bd  = new BigNumber( article_id );
	upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd  = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd  = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_replies(2, 'i128', lower_bd.toFixed(), upper_bd.toFixed());
}

function get_article_replies_sort_by_ascending_order(article_id)
{
	lower_bd  = new BigNumber( article_id );
	upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd  = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd  = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd  = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_replies(5, 'i128', lower_bd.toFixed(), upper_bd.toFixed());
}

function get_user_replies_sort_by_descending_order(user)
{
	let index_position = 4;
	let key_type       = 'i128';

	let lower_bd  = new BigNumber( my_eos_name_to_uint64t(user) );
	let upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_replies(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
}

function get_user_replies_sort_by_ascending_order(user)
{
	let index_position = 6;
	let key_type       = 'i128';

	let lower_bd  = new BigNumber( my_eos_name_to_uint64t(user) );
	let upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_replies(index_position, key_type, lower_bd.toFixed(), upper_bd.toFixed());
}

function get_replies(index_position, key_type, lower_bound, upper_bound)
{
	$("#my_modal_loading").modal('open');
	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			const resp = await rpc.get_table_rows({
				json:  true,
				code:  metarealnote_contract,
				scope: metarealnote_contract,
				table: 'replies',
				index_position: index_position,
				key_type: key_type,
				lower_bound: lower_bound,
				upper_bound: upper_bound,
				limit: reply_num_per_page,
				reverse: false,
				show_payer: false
			});
			let replies = '';
			let i       = 0;
			let len     = resp.rows.length;
			if (len === 0) {
				replies = '<div>&nbsp;</div>';
			}
			// 以下生成所有回复的基本信息
			for (i = 0; i < len; i++) {
				let f = '<a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].reply_hash + '}\');">id' + resp.rows[i].reply_id + '</a>&nbsp;&nbsp;';
				if (current_page === "my_replies" && articles_array.length === 1) {
					f = f + $("#reply_to_article").html() + '<a href="##" onclick="show_article_content_div(' + resp.rows[i].target_article_id + ');">id' + resp.rows[i].target_article_id + '</a>';
					if (resp.rows[i].target_reply_id > 0) {
						f = f + '<br />';
					}
				}
				if (resp.rows[i].target_reply_id > 0) {
					f = f + $("#reply_to").html() + '&nbsp;<span class="user_of_reply_' + resp.rows[i].target_reply_id + '">&nbsp;</span>&nbsp;id' + resp.rows[i].target_reply_id;
				}
				replies = replies + '<div><table width="100%" border="0">';
				replies = replies + '<tr>' + '<td rowspan="3" width="30" align="center" valign="top">&nbsp;</td>' + '<td rowspan="3" width="71" align="center" valign="top"><a href="##" onclick="query_user_profile(\'' + resp.rows[i].user + '\');">' + '<div class="div_user_avatar_' + convert_dot_to_underline(resp.rows[i].user) + '" style="width:64px; height:64px;"></div></a></td>' + '<td><a href="##" onclick="query_user_profile(\'' + resp.rows[i].user + '\');">' + resp.rows[i].user + '</a>&nbsp;&nbsp;' + timestamp_trans_full(resp.rows[i].post_time) + '</td>' + '</tr>';
				replies = replies + '<tr>' + '<td>' + f + '<div class="content_of_reply_' + resp.rows[i].reply_id + '" style="border:1px solid #B6B6B6;">&nbsp;</div></td>' + '</tr>';
				replies = replies + '<tr>' + '<td align="right"><a href="##" onclick="reply_an_article(' + current_article_id + ', ' + resp.rows[i].reply_id + ');">' + $("#reply").html() + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="am-icon-comment"></span>&nbsp;' + resp.rows[i].replied_times + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' + '</tr>';
				replies = replies + '</table></div><hr />';
				reply_user_map.set(resp.rows[i].reply_id, resp.rows[i].user);
			}
			// 下一页
			if (resp.more === true) {
				replies = replies + '<table width="100%" border="0"><tr><td align="center"><a href="##" onclick="get_replies(' + index_position + ', \'' + key_type + '\', \'' + resp.next_key + '\', \'' + upper_bound + '\');">' + $("#next_page").html() + '</a></td></tr></table>';
			}
			// 以下按照当前页面将所有回复的基本信息赋值过去
			if (current_page === "my_replies" && articles_array.length === 1) {
				$("#my_replies_info_div").html(replies);
			} else {
				$("#article_replies_div").html(replies);
			}
			// 以下逐个查询回复的用户头像
			for (i = 0; i < len; i++) {
				let avatar = await get_user_avatar(resp.rows[i].user);
				$(".div_user_avatar_" + convert_dot_to_underline(resp.rows[i].user)).html(avatar);
			}
			// 以下查询所有回复的全文
			for (i = 0; i < len; i++) {
				if (content_of_reply_map.has(resp.rows[i].reply_id)) {
					//console.log("reply get");
					let ec_content = my_escapeHTML(content_of_reply_map.get(resp.rows[i].reply_id));
					let content_1  = content_process_1(ec_content);
					$(".content_of_reply_" + resp.rows[i].reply_id).html(content_1);
					let str2 = await content_process_2(ec_content);
				} else {
					//console.log("reply no get");
					let memo        = '';
					let next_hash   = '';
					let content     = '';
					let transaction = null;
					if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						next_hash      = resp.rows[i].reply_hash;
						try {
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
						catch (e) {                                  // 找不到某个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了。
							content = content + $("#content_chain_interruption_info_1").html() + next_hash + $("#content_chain_interruption_info_2").html();
						}
					}
					else if (resp.rows[i].storage_location === 2) {                                   // 数据存储在 ETH 链上
						let my_web3 = new Web3( new Web3.providers.HttpProvider(eth_http_provider) );
						next_hash   = resp.rows[i].reply_hash;
						do {
							transaction = await my_web3.eth.getTransaction(next_hash);
							if (transaction === null) {                                                   // 找不到这个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了
								content = content + $("#content_chain_interruption_info_1").html() + next_hash + $("#content_chain_interruption_info_2").html();
								break;
							}
							else if (transaction.blockHash === null) {                                    // 交易处在 pending 状态，未被打包进区块
								content = content + $("#transaction_pending_info_1").html() + next_hash + $("#transaction_pending_info_2").html();
								break;
							}
							else {                                                                        // 正常的交易
								memo = Web3.utils.hexToUtf8(transaction.input);
								next_hash = memo.slice(0, memo.indexOf('}') + 1);
								if (next_hash.length > 2) {
									next_hash = memo.slice(1, memo.indexOf('}'));
								} else {
									next_hash = '';
								}
								content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
							}
						} while (next_hash != '');
					}
					else if (resp.rows[i].storage_location === 6) {                                   // 数据存储在 Arweave 链上
						try {
							next_hash   = resp.rows[i].reply_hash;
							do {
								let ar_response = await fetch(arweave_endpoint + next_hash);
								memo = await ar_response.text();
								next_hash = memo.slice(0, memo.indexOf('}') + 1);
								if (next_hash.length > 2) {
									next_hash = memo.slice(1, memo.indexOf('}'));
								} else {
									next_hash = '';
								}
								content = content + memo.slice(memo.indexOf('}') + 1, memo.length);
							} while (next_hash != '');
						}
						catch (e) {                                  // 找不到某个交易hash对应的交易，可能是这个交易没有被打包进区块，被丢弃了。
							content = content + $("#content_chain_interruption_info_1").html() + next_hash + $("#content_chain_interruption_info_2").html();
						}
					}
					else {      // 数据存储在其他链上
					}
					if (resp.rows[i].content_sha3_hash !== Web3.utils.sha3(content).slice(2)) {      // 内容的Sha3 Hash不一致
						if (get_cookie('i18n_lang') === "zh") alert("错误：回复的内容的Sha3 Hash不一致。回复id=" + resp.rows[i].reply_id + "。");
						else                                  alert("Error: The sha3 hash of content of the reply is not matched. Reply id=" + resp.rows[i].reply_id + ".");
					}
					content_of_reply_map.set(resp.rows[i].reply_id, content);
					let ec_content = my_escapeHTML(content);
					let content_1  = content_process_1(ec_content);
					$(".content_of_reply_" + resp.rows[i].reply_id).html(content_1);
					let str2 = await content_process_2(ec_content);
				}
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
						if (r.rows.length === 1 && r.rows[0].reply_id === resp.rows[i].target_reply_id ) {
							user = r.rows[0].user;
							reply_user_map.set(resp.rows[i].target_reply_id, user);
							//console.log("no get");
						}
					}
					$(".user_of_reply_" + resp.rows[i].target_reply_id).html(my_escapeHTML(user));
				}
			}
			$("#my_modal_loading").modal('close');
		} catch (e) {
			$("#my_modal_loading").modal('close');
			alert(e);
		}
	})();
}

function get_users_i_follow()
{
	let lower_bd  = new BigNumber( my_eos_name_to_uint64t(current_user_account) );
	let upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_users(2, 'i128', lower_bd.toFixed(), upper_bd.toFixed());
}

function get_users_follow_me()
{
	let lower_bd  = new BigNumber( my_eos_name_to_uint64t(current_user_account) );
	let upper_bd  = new BigNumber( lower_bd.plus(1) );

	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	lower_bd      = lower_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
	upper_bd      = upper_bd.multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。

	get_users(3, 'i128', lower_bd.toFixed(), upper_bd.toFixed());
}

function get_users(index_position, key_type, lower_bound, upper_bound)
{
	$("#my_modal_loading").modal('open');
	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			const resp = await rpc.get_table_rows({
				json:  true,
				code:  metarealnote_contract,
				scope: metarealnote_contract,
				table: 'userelations',
				index_position: index_position,
				key_type: key_type,
				lower_bound: lower_bound,
				upper_bound: upper_bound,
				limit: user_num_per_page,
				reverse: false,
				show_payer: false					
			});
			let users = '';
			let i = 0;
			let len = resp.rows.length;
			if (len === 0) {
				users = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
			}
			// 以下逐个生成用户的基本信息
			let username = '';
			for (i = 0; i < len; i++) {
				if (current_page === "users_i_follow") {
					username = resp.rows[i].followed_user;
				} else if (current_page === "users_follow_me") {
					username = resp.rows[i].follow_user;
				} else {
					username = '';
				}
				users = users + '<div><table width="100%" border="0">';
				users = users + '<tr>' + '<td width="71" align="center" valign="middle"><a href="##" onclick="query_user_profile(\'' + username + '\');">' + '<div class="div_user_avatar_' + convert_dot_to_underline(username) + '" style="width:64px; height:64px; vertical-align:middle; display:table-cell; text-align:center;"></div></a></td>' + '<td align="left" valign="middle"><a href="##" onclick="switch_and_get_user_articles(\'' + username + '\');">' + username + '</a>' + '</td>' + '</tr>';
				users = users + '</table></div><hr />';
			}
			// 下一页
			if (resp.more === true) {
				users = users + '<table width="100%" border="0"><tr><td align="center"><a href="##" onclick="get_users(' + index_position + ', \'' + key_type + '\', \'' + resp.next_key + '\', \'' + upper_bound + '\');">' + $("#next_page").html() + '</a></td></tr></table>';
			}
			// 以下按照当前页面将所有用户的基本信息赋值过去
			if (current_page === "users_i_follow") {
				$("#users_i_follow_info_div").html(users);
			} else if (current_page === "users_follow_me") {
				$("#users_follow_me_info_div").html(users);
			} else {
			}
			// 以下逐个查询用户头像
			for (i = 0; i < len; i++) {
				if (current_page === "users_i_follow") {
					username = resp.rows[i].followed_user;
				} else if (current_page === "users_follow_me") {
					username = resp.rows[i].follow_user;
				} else {
					username = '';
				}
				let avatar = await get_user_avatar(username);
				$(".div_user_avatar_" + convert_dot_to_underline(username)).html(avatar);
			}
			$("#my_modal_loading").modal('close');
			window.scrollTo(0, 0);
		} catch (e) {
			$("#my_modal_loading").modal('close');
			alert(e);
		}
	})();
}

function switch_and_get_user_articles(user)
{
	if (current_page === "users_i_follow") {
		show_articles_of_user_i_follow();
	} else if (current_page === "users_follow_me") {
		show_articles_of_user_follow_me();
	} else {
	}

	get_user_articles(user);
}

function copy_article_link_to_clipboard(article_id)
{
	$('#div_copy_article_link').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});

	if (get_cookie('i18n_lang') === "zh") {
		$("#span_the_link_of_article_is").html("文章的链接为：");
		$("#span_the_link_of_article_has_been_copied_to_the_clipboard").html("已经复制到剪贴板。");
	}
	else {
		$("#span_the_link_of_article_is").html("The link of article is:");
		$("#span_the_link_of_article_has_been_copied_to_the_clipboard").html("has been copied to the clipboard.");
	}

	let str_tmp = window.location.href.toString();
	if (str_tmp.indexOf('#') >= 0) {
		str_tmp = str_tmp.slice(0, str_tmp.indexOf('#'));
	}
	if (str_tmp.indexOf('?') >= 0) {
		str_tmp = str_tmp.slice(0, str_tmp.indexOf('?'));
	}

	str_tmp = str_tmp + '?article=' + article_id;
	$("#input_the_link_of_article").val(str_tmp);
	$("#input_the_link_of_article").select();
	document.execCommand("Copy");
}
