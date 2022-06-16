
// utf8编码

function arweave_do_post_item(my_storage_location, my_quantity, my_description, strArray)
{
	(async () => {
		try {
			$("#my_modal_loading").modal('open');
			for (let j = post_item_origin_data_current_index; j >= 0; j--) {
				post_item_origin_data_current_index = j;
				let transaction = await arweave.createTransaction({ data: '{' + trn_hash + '}' + strArray[j] });
				transaction.addTag('Content-Type', 'text/html');
				transaction.addTag('App-Name', 'DreamRealNotes');
				await arweave.transactions.sign(transaction);
				let uploader = await arweave.transactions.getUploader(transaction);
				while (!uploader.isComplete) {
					await uploader.uploadChunk();
				}
				trn_success = true;
				trn_hash    = transaction.id;
			}
			post_item_origin_data_current_index = -1;
			if (post_item_write_to_table === false) {
				let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
				const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
				const api = scatter.eos(current_network, eosjs_api.Api, {rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), beta3:true});
				let eos_result = await api.transact(
					{
						actions: [{
							account: metarealnote_contract,
							name: 'postalbumitm',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								user:               account.name,
								item_type:          album_item_type,
								storage_location:   my_storage_location,
								description:        my_description,
								preview_head_hash:  '',
								preview_trn_num:    0,
								preview_length:     0,
								preview_sha3_hash:  '',
								origin_head_hash:   trn_hash,
								origin_trn_num:     strArray.length,
								origin_length:      origin_size_of_item,
								origin_sha3_hash:   generate_sha3_hash_string(strArray)
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
				if (typeof(eos_result) === 'object' && eos_result.transaction_id != "") {
					trn_success              = true;
					post_item_write_to_table = true;
				} else { trn_failed(); $("#my_modal_loading").modal('close'); return; }
			}
			$("#my_modal_loading").modal('close');
			alert("OK");
		} catch (e) {
			$("#my_modal_loading").modal('close');
			trn_success = false;
			if (typeof e === 'object') alert(e.message);
			else                       alert(e);
		}
	})();
}
