
//utf8编码

function follow_user()
{
	do_follow_user($("#eos_account_name_label").html());
}

function unfollow_user()
{
	do_unfollow_user($("#eos_account_name_label").html());
}

function do_follow_user(followed_user)
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}

	let follow_user = current_user_account;

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: metarealnote_contract,
					name: 'followuser',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						follow_user:   follow_user,
						followed_user: followed_user
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}

function do_unfollow_user(followed_user)
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}

	let follow_user = current_user_account;

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: metarealnote_contract,
					name: 'canclefollow',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						follow_user:   follow_user,
						followed_user: followed_user
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}
