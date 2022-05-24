
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
	$("#my_modal_loading").modal('open');
	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			const resp = await rpc.get_table_rows({
				json:  true,
				code:  metarealnote_contract,
				scope: metarealnote_contract,
				table: 'albums',
				index_position: index_position,
				key_type: key_type,
				lower_bound: lower_bound,
				upper_bound: upper_bound,
				limit: album_items_per_page,
				reverse: false,
				show_payer: false
			});
			let album_items = '';
			let i           = 0;
			let len         = resp.rows.length;
			if (len === 0) {
				if (get_cookie('i18n_lang') === "zh") album_items = '<div>查询结果为空。</div>';
				else                                  album_items = '<div>The query result is empty.</div>';
			}
			// 以下生成所有条目的基本信息
			for (i = 0; i < len; i++) {
				album_items = album_items + '<div class="am-u-sm-6 am-u-md-4 am-u-lg-2" style="border:1px solid #2B65EC">';
				album_items = album_items + '<div class="album_item_div_' + resp.rows[i].item_id + '" style="width:150px; height:150px; word-wrap:break-word; word-break:break-all;">';
				if (resp.rows[i].item_type === 1) {                                       // 图片
					album_items = album_items + '<img class="album_item_img_' + resp.rows[i].item_id + '" src="" alt="image loading..." style="width:auto; height:auto; max-width:100%; max-height:100%;" />';
				}
				else if (resp.rows[i].item_type === 2) {                                  // 视频
					album_items = album_items + '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + $("#video_file").html() + '<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<a href="##" onclick="album_items_load_file(' + resp.rows[i].item_id + ', ' + resp.rows[i].item_type + ', ' + resp.rows[i].storage_location + ', \'' + resp.rows[i].origin_head_hash + '\', \'' + resp.rows[i].origin_sha3_hash + '\');">' + $("#load_file").html() + '</a>';
				}
				else if (resp.rows[i].item_type === 3) {                                  // 音频
					album_items = album_items + '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + $("#audio_file").html() + '<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<a href="##" onclick="album_items_load_file(' + resp.rows[i].item_id + ', ' + resp.rows[i].item_type + ', ' + resp.rows[i].storage_location + ', \'' + resp.rows[i].origin_head_hash + '\', \'' + resp.rows[i].origin_sha3_hash + '\');">' + $("#load_file").html() + '</a>';
				}
				else if (resp.rows[i].item_type === 5) {                                  // 其他
					album_items = album_items + '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + $("#other_file").html() + '<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '<a href="##" onclick="album_items_load_file(' + resp.rows[i].item_id + ', ' + resp.rows[i].item_type + ', ' + resp.rows[i].storage_location + ', \'' + resp.rows[i].origin_head_hash + '\', \'' + resp.rows[i].origin_sha3_hash + '\');">' + $("#load_file").html() + '</a>';
				}
				else {
					album_items = album_items + '';
				}
				album_items = album_items + '</div>';
				album_items = album_items + '<div><a href="##" onclick="alert(\'' + $("#head_hash").html() + storage_locations[resp.rows[i].storage_location] + '{' + resp.rows[i].origin_head_hash + '}\');">id' + resp.rows[i].item_id + '</a>&nbsp;</div>';
				album_items = album_items + '<div>' + timestamp_trans_full(resp.rows[i].post_time) + '</div>';
				album_items = album_items + '<div class="album_item_file_name_' + resp.rows[i].item_id + '">&nbsp;</div>';
				album_items = album_items + '<div>' + resp.rows[i].origin_length + ' bytes</div>';
				album_items = album_items + '<textarea class="am-modal-prompt-input album_item_description_' + resp.rows[i].item_id + '" rows="3" readonly="readonly"></textarea>';
				album_items = album_items + '<div><input type="hidden" class="album_item_hidden_input_' + resp.rows[i].item_id + '" value="" /></div>';
				album_items = album_items + '<div>此处放操作下拉框</div>';
				album_items = album_items + '</div>';
			}
			// 下一页
			if (resp.more === true) {
				album_items = album_items + '<table width="100%" border="0"><tr><td align="center">&nbsp;</td></tr><tr><td align="center">&nbsp;</td></tr><tr><td align="center"><a href="##" onclick="get_album_items(' + index_position + ', \'' + key_type + '\', \'' + resp.next_key + '\', \'' + upper_bound + '\');">' + $("#next_page").html() + '</a></td></tr></table>';
			}
			// 显示
			$("#album_items_div").html(album_items);
			// 将所有条目的描述赋值上去
			for (i = 0; i < len; i++) {
				$(".album_item_description_" + resp.rows[i].item_id).val(resp.rows[i].description);
			}
			// 以下查询所有图片的内容
			for (i = 0; i < len; i++) {
				if (resp.rows[i].item_type === 1) {  // 图片
					if (content_of_image_map.has(resp.rows[i].item_id)) {
						let str_all = content_of_image_map.get(resp.rows[i].item_id);
						let str1    = 'FileName:';
						let str2    = '.FileContent:';
						$(".album_item_file_name_" + resp.rows[i].item_id).html( CryptoJS.enc.Base64.parse( str_all.slice( str_all.indexOf(str1) + str1.length, str_all.indexOf(str2) ) ).toString(CryptoJS.enc.Utf8) );
						$(".album_item_img_"       + resp.rows[i].item_id).attr( "src",                     str_all.slice( str_all.indexOf(str2) + str2.length ) );
						//console.log("get");
					} else {
						let memo        = '';
						let next_hash   = '';
						let content     = '';
						let transaction = null;
						if (resp.rows[i].storage_location === 1) {                                        // 数据存储在 EOS 链上
						}
						else if (resp.rows[i].storage_location === 2) {                                   // 数据存储在 ETH 链上
						}
						else if (resp.rows[i].storage_location === 6) {                                   // 数据存储在 Arweave 链上
							try {
								next_hash   = resp.rows[i].origin_head_hash;
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
						if (resp.rows[i].origin_sha3_hash !== Web3.utils.sha3(content).slice(2)) {      // 内容的Sha3 Hash不一致
							if (get_cookie('i18n_lang') === "zh") alert("错误：图片的Sha3 Hash不一致。图片id=" + resp.rows[i].item_id + "。");
							else                                  alert("Error: The sha3 hash of content of the picture is not matched. Picture id=" + resp.rows[i].item_id + ".");
						}
						content_of_image_map.set(resp.rows[i].item_id, content);
						let str_all = content;
						let str1    = 'FileName:';
						let str2    = '.FileContent:';
						$(".album_item_file_name_" + resp.rows[i].item_id).html( CryptoJS.enc.Base64.parse( str_all.slice( str_all.indexOf(str1) + str1.length, str_all.indexOf(str2) ) ).toString(CryptoJS.enc.Utf8) );
						$(".album_item_img_"       + resp.rows[i].item_id).attr( "src",                     str_all.slice( str_all.indexOf(str2) + str2.length ) );
						//console.log("no get");
					}
				}
			}
			$("#my_modal_loading").modal('close');
		} catch (e) {
			$("#my_modal_loading").modal('close');
			alert(e);
		}
	})();
}

function album_items_load_file(item_id, item_type, storage_location, origin_head_hash, origin_sha3_hash)
{
	$("#my_modal_loading").modal('open');
	const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
	(async () => {
		try {
			let memo        = '';
			let next_hash   = '';
			let content     = '';
			let transaction = null;

			// 获取文件的数据
			if (false) {              // 有缓存
			}
			else {                    // 无缓存
				if (storage_location === 1) {                                        // 数据存储在 EOS 链上
				}
				else if (storage_location === 2) {                                   // 数据存储在 ETH 链上
				}
				else if (storage_location === 6) {                                   // 数据存储在 Arweave 链上
					try {
						next_hash   = origin_head_hash;
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
				if (origin_sha3_hash !== Web3.utils.sha3(content).slice(2)) {      // 内容的Sha3 Hash不一致
					if (get_cookie('i18n_lang') === "zh") alert("错误：文件的Sha3 Hash不一致。id=" + item_id + "。");
					else                                  alert("Error: The sha3 hash of content of the file is not matched. id=" + item_id + ".");
				}
				//console.log("no get");
			}
			// 将文件的名称赋值到对应的位置
			let str_all = content;
			let str1    = 'FileName:';
			let str2    = '.FileContent:';
			$(".album_item_file_name_" + item_id).html( CryptoJS.enc.Base64.parse( str_all.slice( str_all.indexOf(str1) + str1.length, str_all.indexOf(str2) ) ).toString(CryptoJS.enc.Utf8) );
			let file_content =                                                     str_all.slice( str_all.indexOf(str2) + str2.length );
			// 将文件的内容赋值到对应的位置
			if (item_type === 1) {                                       // 图片
			}
			else if (item_type === 2) {                                  // 视频
				$(".album_item_div_" + item_id).html('<video src="' + file_content + '" controls style="width:auto; height:auto; max-width:100%; max-height:100%;">HTML5 Video is required.</video>');
			}
			else if (item_type === 3) {                                  // 音频
				$(".album_item_div_" + item_id).html('<audio src="' + file_content + '" controls>HTML5 Audio is required.</audio>');
			}
			else if (item_type === 5) {                                  // 其他
				$(".album_item_div_"          + item_id).html(file_content.slice(0, album_item_data_preview_length) + '......');
				$(".album_item_hidden_input_" + item_id).val(file_content);
			}
			else {
			}
			$("#my_modal_loading").modal('close');
		} catch (e) {
			$("#my_modal_loading").modal('close');
			alert(e);
		}
	})();
}
