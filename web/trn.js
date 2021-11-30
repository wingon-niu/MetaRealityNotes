
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
			$("#current_account_name").html("&nbsp;" + account.name);
			current_user_account = account.name;
			set_login_flag();
			if (current_album_type === "private") {
				if (get_cookie('i18n_lang') === "zh") $("#private_albums_div").html("<p>&nbsp;&nbsp;请点击\"个人相册\"页签进行刷新。&nbsp;</p>");
				else                                  $("#private_albums_div").html("<p>&nbsp;&nbsp;Please click \"Private album\" tab to refresh data.&nbsp;</p>");
			}
		}
	}).catch(error => {
		show_error(error);
	});
}

function my_logoff()
{
	$("#current_account_name").html("&nbsp;");
	current_user_account = "";
	clear_login_flag();
	if ( !(scatter === null) && scatter.identity ) {
		scatter.forgetIdentity();
	}
	if (current_album_type === "private") {
		if (current_album_name != "") go_back();
		$("#private_albums_div").html("<p>&nbsp;</p>");
	}
}

function clear_login_flag()
{
	$("#menu_eos").html("EOS");
	$("#menu_bos").html("BOS");
	$("#menu_meetone").html("MeetOne (not supported yet)");
}

function set_login_flag()
{
	clear_login_flag();

	if      (current_block_chain === "eos")     $("#menu_eos").html(    "EOS"     + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===>&nbsp;&nbsp;Logined");
	else if (current_block_chain === "bos")     $("#menu_bos").html(    "BOS"     + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===>&nbsp;&nbsp;Logined");
	else if (current_block_chain === "meetone") $("#menu_meetone").html("MeetOne" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;===>&nbsp;&nbsp;Logined");
}

function show_error(error)
{
	if (typeof(error) === 'object') {
		if (error.type != "signature_rejected" && error.type != "identity_rejected") {
			if (error.message === "assertion failure with message: can not upvote pic by self") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：不能给自己上传的图片点赞。");
				else                                  alert("Error: You can't upvote the pictures you upload.");
			} else if (error.message === "assertion failure with message: unknown dst album id") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：目标个人相册不存在。");
				else                                  alert("Error: Target private album does not exist.");
			} else if (error.message === "assertion failure with message: dst album is not belong to this owner") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：目标个人相册不属于您，不能移动到别人的个人相册。");
				else                                  alert("Error: Target private album do not belong to you, picture cannot be moved into other people's private album.");
			} else if (error.message === "assertion failure with message: unknown pub album id") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：目标公共相册不存在。");
				else                                  alert("Error: Target public album does not exist.");
			} else if (error.message === "assertion failure with message: new_name is too long") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：新名字太长了，最大长度是12个汉字或者36个英文字符。");
				else                                  alert("Error: New name is too long. New name is up to 36 english characters.");
			} else if (error.message === "assertion failure with message: new_detail is too long") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：新描述太长了，最大长度是170个汉字或者512个英文字符。");
				else                                  alert("Error: New detail is too long. New detail is up to 512 english characters.");
			} else if (error.message === "assertion failure with message: invalid quantity inputed") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：无效的代币数量、代币格式或者代币名称。");
				else                                  alert("Error: Invalid quantity inputed.");
			} else if (error.message === "assertion failure with message: unknown account") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：您在本系统的余额为0。");
				else                                  alert("Error: Your balance in this system is 0.");
			} else if (error.message === "assertion failure with message: insufficient balance") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：您在本系统的余额不足。");
				else                                  alert("Error: Your balance in this system is insufficient.");
			} else if (error.message === "assertion failure with message: unable to find key") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：无效的代币名称。");
				else                                  alert("Error: Invalid token name.");
			} else if (error.message.indexOf("is not supported by token contract eosio.token") > -1) {
				if (get_cookie('i18n_lang') === "zh") alert("错误：无效的代币名称。");
				else                                  alert("Error: Invalid token name.");
			} else if (error.message === "assertion failure with message: overdrawn balance") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：超出可用余额。");
				else                                  alert("Error: Overdrawn balance.");
			} else if (error.message === "assertion failure with message: must transfer positive quantity") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：数量不能为负数。");
				else                                  alert("Error: Must transfer positive quantity.");
			} else if (error.message.indexOf("Too many decimal digits in") > -1) {
				if (get_cookie('i18n_lang') === "zh") alert("错误：小数点后面必须是4位小数。");
				else                                  alert("Error: Too many decimal digits.");
			} else if (error.message === "assertion failure with message: symbol precision mismatch") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：小数点后面必须是4位小数。");
				else                                  alert("Error: Symbol precision mismatch.");
			} else if (error.message === "Asset must begin with a number") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：数量必须以数字开头。");
				else                                  alert("Error: Asset must begin with a number.");
			} else if (error.message === "This user does not have this network in their Scatter.") {
				if (get_cookie('i18n_lang') === "zh") alert("错误：您的Scatter或者钱包中没有这个区块链的配置信息。");
				else                                  alert("Error: There is no this block chain in your scatter or wallet.");
			} else {
				alert(error.message);
			}
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
