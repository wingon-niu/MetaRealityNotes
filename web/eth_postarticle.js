
// utf8编码

function eth_do_post_article(my_category, my_type, my_storage_location, my_forward_article_id, my_quantity, strArray)
{
	(async () => {
		try {
			var result = null;
	
			for (let j = post_article_current_index; j >= 0; j--) {
				post_article_current_index = j;
				result = await ethereum.request({
					method: 'eth_sendTransaction',
					params: [{
						nonce:    '0x00',           // ignored by MetaMask
						//gasPrice: eth_gasPrice,   // customizable by user during MetaMask confirmation.
						gas:      eth_gasLimit,     // customizable by user during MetaMask confirmation.
						to:       eth_worldwelfare_account,
						from:     eth_user_account,
						value:    Web3.utils.numberToHex( Web3.utils.toWei( my_quantity.substring(0, my_quantity.indexOf(' ')), "ether" ) ),
						data:     Web3.utils.utf8ToHex( '{' + trn_hash + '}' + strArray[j] ),
						chainId:  Web3.utils.numberToHex(eth_chain_id),
					}],
				});
				trn_success = true;
				trn_hash    = result;
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
								content_sha3_hash:  generate_sha3_hash_string(strArray),
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
