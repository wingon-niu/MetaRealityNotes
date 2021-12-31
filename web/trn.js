
function my_login(connected)
{
	if (!connected) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：您的 scatter 没有打开或者已经锁定。");
		else                                  alert("Error: your scatter is not opened or locked.");
		return false;
	}
	if (scatter === null) {
		scatter = ScatterJS.scatter;
		window.ScatterJS = null;
	}
	const requiredFields = { accounts:[current_network] };
	scatter.getIdentity(requiredFields).then(() => {
		let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
		if (account != null && account != undefined) {
			current_user_account = account.name;
			set_login_flag();
		}
	}).catch(error => {
		show_error(error);
	});
}

function my_logoff()
{
	current_user_account = "";
	clear_login_flag();
	if ( !(scatter === null) && scatter.identity ) {
		scatter.forgetIdentity();
	}
}

function set_login_flag()
{
	let s = $("#login").html() + " " + current_user_account;
	$("#login").html(s);
}

function clear_login_flag()
{
	let s = $("#login").html();
	let words = s.split(' ');
	if (words.length === 3) {
		$("#login").html( words[0] + ' ' + words[1] );
	}
}

function trn_failed()
{
	trn_success = false;
}

function show_error(error)
{
	trn_failed();

	if (typeof(error) === 'object') {
		if (error.type != "signature_rejected" && error.type != "identity_rejected") {
			alert(error.message);
		}
	}
	else alert(error);
}

function process_result_show_msg(result)
{
	if (typeof(result) === 'object' && result.transaction_id != "") {
		trn_success = true;
		if (get_cookie('i18n_lang') === "zh") alert("成功：操作已经发送到区块链。");
		else                                  alert("Succeeded: The action has been sent to the block chain.");
	} else {
		trn_failed();
		if (get_cookie('i18n_lang') === "zh") alert("未知的错误，请稍后再试。");
		else                                  alert("Unknown error, please try again later.");
	}
}

function process_result(result)
{
	if (typeof(result) === 'object' && result.transaction_id != "") {
		trn_success = true;
	} else {
		trn_failed();
		if (get_cookie('i18n_lang') === "zh") alert("未知的错误，请稍后再试。");
		else                                  alert("Unknown error, please try again later.");
	}
}

function send_transaction(my_transaction)
{
	if (current_user_account === "") {
		trn_failed();
		if (get_cookie('i18n_lang') === "zh") alert("请先登录，再进行操作。");
		else                                  alert("Please login.");
	} else {
		scatter.connect(current_my_app_name, current_network).then(connected => {
			if (!connected) {
				trn_failed();
				if (get_cookie('i18n_lang') === "zh") alert("错误：您的 scatter 没有打开或者已经锁定。");
				else                                  alert("Error: your scatter is not opened or locked.");
				return false;
			}
			if ( !(scatter === null) && scatter.identity ) {
				let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
				if (account != null && account != undefined) {
					const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
					const api = scatter.eos(current_network, eosjs_api.Api, {rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), beta3:true});
					(async () => {
						try {
							const result = await my_transaction(api, account);
							process_result_show_msg(result);
						} catch (e) {
							show_error(e);
						}
					})();
				} else {
					trn_failed();
					if (get_cookie('i18n_lang') === "zh") alert("请重新登录当前区块链，再进行操作。");
					else                                  alert("Please re-login current blockchain first.");
				}
			} else {
				trn_failed();
				if (get_cookie('i18n_lang') === "zh") alert("请重新登录当前区块链，再进行操作。");
				else                                  alert("Please re-login current blockchain first.");
			}
		}).catch(error => {
			show_error(error);
		});
	}
}

function send_transactions(my_transactions)
{
	if (current_user_account === "") {
		trn_failed();
		if (get_cookie('i18n_lang') === "zh") alert("请先登录，再进行操作。");
		else                                  alert("Please login.");
	} else {
		scatter.connect(current_my_app_name, current_network).then(connected => {
			if (!connected) {
				trn_failed();
				if (get_cookie('i18n_lang') === "zh") alert("错误：您的 scatter 没有打开或者已经锁定。");
				else                                  alert("Error: your scatter is not opened or locked.");
				return false;
			}
			if ( !(scatter === null) && scatter.identity ) {
				let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
				if (account != null && account != undefined) {
					const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
					const api = scatter.eos(current_network, eosjs_api.Api, {rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), beta3:true});
					my_transactions(api, account);
				} else {
					trn_failed();
					if (get_cookie('i18n_lang') === "zh") alert("请重新登录当前区块链，再进行操作。");
					else                                  alert("Please re-login current blockchain first.");
				}
			} else {
				trn_failed();
				if (get_cookie('i18n_lang') === "zh") alert("请重新登录当前区块链，再进行操作。");
				else                                  alert("Please re-login current blockchain first.");
			}
		}).catch(error => {
			show_error(error);
		});
	}
}
