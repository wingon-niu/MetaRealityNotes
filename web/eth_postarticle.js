
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
						gasPrice: eth_gasPrice,     // customizable by user during MetaMask confirmation.
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
			alert("OK");
		} catch (e) {
			trn_success = false;
			if (typeof e === 'object') alert(e.message);
			else                       alert(e);
		}
	})();
}
