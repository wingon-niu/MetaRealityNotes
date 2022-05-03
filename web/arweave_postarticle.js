
// utf8编码

function arweave_do_post_article(my_category, my_type, my_storage_location, my_forward_article_id, my_quantity, strArray)
{
	(async () => {
		try {
			for (let j = post_article_current_index; j >= 0; j--) {
				post_article_current_index = j;
				let transaction = await arweave.createTransaction({ data: Buffer.from('{' + trn_hash + '}' + strArray[j], 'utf8') });
				await arweave.transactions.sign(transaction);
				let response = await arweave.transactions.post(transaction);
				if (response.status === 200) {        // HTTP response codes (200 - server received the transaction, 4XX - invalid transaction, 5XX - error)
					trn_success = true;
					trn_hash    = transaction.id;
				} else {
					trn_success = false;
					alert('An error has occurred, please resume from break point.');
					return;
				}
			}
			post_article_current_index = -1;
			if (post_article_write_to_table === false) {
				let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
				const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
				const api = scatter.eos(current_network, eosjs_api.Api, {rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), beta3:true});
				let eos_result = await api.transact(
					{
						actions: [{
							account: metarealnote_contract,
							name: 'postarticle',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								user:               account.name,
								article_hash:       trn_hash,
								num_of_trns:        strArray.length,
								category:           my_category,
								type:               my_type,
								storage_location:   my_storage_location,
								forward_article_id: my_forward_article_id
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
				if (typeof(eos_result) === 'object' && eos_result.transaction_id != "") {
					trn_success                 = true;
					post_article_write_to_table = true;
				} else { trn_failed(); return; }
			}
			alert("OK");
		} catch (e) {
			trn_success = false;
			if (typeof e === 'object') alert(e.message);
			else                       alert(e);
		}
	})();
}
