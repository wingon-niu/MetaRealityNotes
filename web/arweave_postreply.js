
// utf8编码

function arweave_do_post_reply(my_storage_location, my_target_article_id, my_target_reply_id, my_quantity, strArray)
{
	(async () => {
		try {
			$("#my_modal_loading").modal('open');
			for (let j = post_reply_current_index; j >= 0; j--) {
				post_reply_current_index = j;
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
			post_reply_current_index = -1;
			if (post_reply_write_to_table === false) {
				let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
				const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
				const api = scatter.eos(current_network, eosjs_api.Api, {rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), beta3:true});
				let eos_result = await api.transact(
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
				if (typeof(eos_result) === 'object' && eos_result.transaction_id != "") {
					trn_success               = true;
					post_reply_write_to_table = true;
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
