
function reply_an_article(article_id, reply_id)
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	$("#target_article_id").val(article_id.toString());
	$("#target_reply_id").val(reply_id.toString());
	write_a_reply_show_modal();
}

function write_a_reply_show_modal()
{
	$('#div_write_a_reply').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function check_post_reply()
{
	let my_target_article_id  = Number($("#target_article_id").val());
	let my_target_reply_id    = Number($("#target_reply_id").val());
	if (my_target_article_id <= 0) {
		alert("target_article_id is wrong.");
		return false;
	}
	let my_storage_location = $("input[name='radio20']:checked").val();  // 存储位置
	if ( storage_locations_supported_conf.indexOf(storage_locations[Number(my_storage_location)]) === -1 ) { // 不支持当前选择
		if (get_cookie('i18n_lang') === "zh") alert("错误：回复内容数据目前只支持存储于：" + storage_locations_supported_conf + "。");
		else                                  alert("Error: Supported block chain at the moment: " + storage_locations_supported_conf + ".");
		return false;
	}
	let my_content = $("#content_of_reply").val().trim();  // 回复内容
	if (my_content === "") {
		if (get_cookie('i18n_lang') === "zh") alert("错误：回复内容为空。");
		else                                  alert("Error: The content of reply is blank.");
		return false;
	}
	return true;
}

function view_times_of_txn_reply()
{
	if (check_post_reply() === false) return;

	let my_storage_location   = Number($("input[name='radio20']:checked").val());
	let my_content            = $("#content_of_reply").val();

	let times_of_txn = 1;     // 需要的交易次数
	let per_trn_len  = 10;    // 每个交易memo存放的数据长度，不同的链设置不同的值

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
		per_trn_len = eos_per_trn_len;
	}
	else if (my_storage_location === 2) {        // 内容数据存储在 ETH 链
		per_trn_len = eth_per_trn_len;
	}
	else if (my_storage_location === 6) {        // 内容数据存储在 Arweave 链
		per_trn_len = arweave_per_trn_len;
	}
	else {                                       // 内容数据存储在其他链
		return;
	}

	let my_len = my_content.length;
	let my_num = Math.ceil(my_len / per_trn_len);  // 按照长度将内容分割为多个部分，计算数量，向上取整
	times_of_txn += my_num;

	if (get_cookie('i18n_lang') === "zh") alert("需要发送的交易次数总共为：" + times_of_txn + "。请确保您的帐户有足够余额以及足够的CPU/NET资源。");
	else                                  alert("The total number of transactions to be sent is: " + times_of_txn + ". Please ensure that your account has sufficient balance and sufficient CPU/NET resources");
}

function post_reply()
{
	if (! confirm($("#post_confirm").html()) ) return;

	post_reply_first_time = true;
	do_post_reply();
}

function resume_from_break_point_post_reply()
{
	if (post_reply_first_time || trn_success) {
		if (get_cookie('i18n_lang') === "zh") alert("只有在交易发送过程中产生错误而中止，才可以使用断点续传功能。");
		else                                  alert("This function can only be used if the transaction is aborted due to an error in the sending process.");
	} else {
		do_post_reply();
	}
}

function do_post_reply()
{
	if (check_post_reply() === false) return;

	let my_storage_location   = Number($("input[name='radio20']:checked").val());
	let my_target_article_id  = Number($("#target_article_id").val());
	let my_target_reply_id    = Number($("#target_reply_id").val());
	let my_quantity           = $("#amount_per_trn_reply").val().trim();
	let my_content            = $("#content_of_reply").val();

	let per_trn_len = 10;     // 每个交易memo存放的数据长度，不同的链设置不同的值
	let strArray    = [];

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
		per_trn_len = eos_per_trn_len;
	}
	else if (my_storage_location === 2) {        // 内容数据存储在 ETH 链
		per_trn_len = eth_per_trn_len;
	}
	else if (my_storage_location === 6) {        // 内容数据存储在 Arweave 链
		per_trn_len = arweave_per_trn_len;
	}
	else {                                       // 内容数据存储在其他链
		return;
	}

	let my_len = my_content.length;
	for (let i = 0; i < my_len; i += per_trn_len) {           // 按照长度将内容分割存入字符串数组
		strArray.push(my_content.slice(i, i + per_trn_len));
	}

	if (post_reply_first_time) {                 // 如果是第一次发送
		post_reply_first_time       = false;
		trn_hash                    = "";
		post_reply_write_to_table   = false;
		post_reply_current_index    = strArray.length - 1;
	}

	if (my_storage_location === 1) {             // 内容数据存储在 EOS 链
		send_transactions( function(api, account) {
			(async () => {
				try {
					var result = null;

					for (let j = post_reply_current_index; j >= 0; j--) {
						post_reply_current_index = j;
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
					post_reply_current_index = -1;
					if (post_reply_write_to_table === false) {
						result = await api.transact(
							{
								actions: [{
									account: metarealnote_contract,
									name: 'postreply',
									authorization: [{
										actor: account.name,
										permission: account.authority
									}],
									data: {
										user:              account.name,
										reply_hash:        trn_hash,
										num_of_trns:       strArray.length,
										content_sha3_hash: generate_sha3_hash_string(strArray),
										storage_location:  my_storage_location,
										target_article_id: my_target_article_id,
										target_reply_id:   my_target_reply_id
									}
								}]
							},{
								blocksBehind: 3,
								expireSeconds: 60
							}
						);
						if (typeof(result) === 'object' && result.transaction_id != "") {
							trn_success                 = true;
							post_reply_write_to_table   = true;
						} else { trn_failed(); return; }
					}
					alert("OK");
				} catch (e) {
					show_error(e);
				}
			})();
		});
	}
	else if (my_storage_location === 2) {        // 内容数据存储在 ETH 链
		eth_do_post_reply(my_storage_location, my_target_article_id, my_target_reply_id, my_quantity, strArray);
	}
	else if (my_storage_location === 6) {        // 内容数据存储在 Arweave 链
		arweave_do_post_reply(my_storage_location, my_target_article_id, my_target_reply_id, my_quantity, strArray);
	}
	else {                                       // 内容数据存储在其他链
		return;
	}
}
