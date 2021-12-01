
function change_network()
{
	$("#current_account_name").html("&nbsp;");
	current_user_account = "";

	if (scatter === null) {
		ScatterJS.scatter.connect(current_my_app_name, current_network).then(
			do_change_network
		).catch(error => {
			show_error(error);
		});
	} else {
		scatter.connect(current_my_app_name, current_network).then(
			do_change_network
		).catch(error => {
			show_error(error);
		});
	}
}

function do_change_network(connected)
{
	if (!connected) {
		return false;
	}
	if (scatter === null) {
		scatter = ScatterJS.scatter;
		window.ScatterJS = null;
	}
	if ( !(scatter === null) && scatter.identity ) {
		let account = scatter.identity.accounts.find(x => x.chainId === current_network.chainId);
		if (account != null && account != undefined) {
			$("#current_account_name").html("&nbsp;" + account.name);
			current_user_account = account.name;
			set_login_flag();
		}
	}
	if (current_album_name != "") go_back();
	if (current_album_type === "public") {
		if (get_cookie('i18n_lang') === "zh") $("#public_albums_div").html("<p>&nbsp;&nbsp;请点击\"公共相册\"页签进行刷新。&nbsp;</p>");
		else                                  $("#public_albums_div").html("<p>&nbsp;&nbsp;Please click \"Public album\" tab to refresh data.&nbsp;</p>");
	} else {
		if (get_cookie('i18n_lang') === "zh") $("#private_albums_div").html("<p>&nbsp;&nbsp;请点击\"个人相册\"页签进行刷新。&nbsp;</p>");
		else                                  $("#private_albums_div").html("<p>&nbsp;&nbsp;Please click \"Private album\" tab to refresh data.&nbsp;</p>");
	}
}

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
	let i = s.indexOf(" ");
	$("#login").html( s.substring(0, i) );
}

function show_error(error)
{
	if (typeof(error) === 'object') {
		if (error.type != "signature_rejected" && error.type != "identity_rejected") {
			alert(error.message);
		}
	}
	else alert(error);
}

function process_result(result)
{
	if (typeof(result) === 'object' && result.transaction_id != "") {
		if (get_cookie('i18n_lang') === "zh") alert("成功：操作已经发送到区块链，请重新进入当前页面查看结果。");
		else                                  alert("Succeeded: The action has been sent to the block chain, please re-enter the current page to view the results.");
	} else {
		if (get_cookie('i18n_lang') === "zh") alert("未知的错误，请稍后再试。");
		else                                  alert("Unknown error, please try again later.");
	}
}

function send_transaction(my_transaction)
{
	if (current_user_account === "") {
		if (get_cookie('i18n_lang') === "zh") alert("请先登录当前区块链，再进行操作。");
		else                                  alert("Please login current blockchain first.");
	} else {
		scatter.connect(current_my_app_name, current_network).then(connected => {
			if (!connected) {
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
							process_result(result);
						} catch (e) {
							show_error(e);
						}
					})();
				} else {
					if (get_cookie('i18n_lang') === "zh") alert("请重新登录当前区块链，再进行操作。");
					else                                  alert("Please re-login current blockchain first.");
				}
			} else {
				if (get_cookie('i18n_lang') === "zh") alert("请重新登录当前区块链，再进行操作。");
				else                                  alert("Please re-login current blockchain first.");
			}
		}).catch(error => {
			show_error(error);
		});
	}
}
