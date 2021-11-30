
const runmode       = "dev";   // prod or dev
const ipfs_root_url = "https://ipfs.eternum.io/ipfs/";
const contract_name = "albumoftimes";

const my_app_name         = "albumoftimes";
const my_app_name_eos     = my_app_name;
const my_app_name_bos     = my_app_name;
const my_app_name_meetone = my_app_name;

var eos_chain_id     = null;
var bos_chain_id     = null;
var meetone_chain_id = null;

var eos_network      = null;
var bos_network      = null;
var meetone_network  = null;

if (runmode === "prod") { // 生产环境
	eos_chain_id     = "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191";
	bos_chain_id     = "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473";
	meetone_chain_id = "123456ae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25123456";

	eos_network = {
		blockchain: 'eos',
		protocol: 'https',
		host: 'api-kylin.eosasia.one',
		port: 443,
		chainId: eos_chain_id
	}

	bos_network = {
		blockchain: 'eos',
		protocol: 'http',
		host: 'jungle2.cryptolions.io',
		port: 8888,
		chainId: bos_chain_id
	}

	meetone_network = {
		blockchain: 'eos',
		protocol: 'http',
		host: 'localhost',
		port: 8090,
		chainId: meetone_chain_id
	}
} else { // 开发测试环境
	eos_chain_id     = "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191";
	bos_chain_id     = "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473";
	meetone_chain_id = "123456ae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25123456";

	eos_network = {
		blockchain: 'eos',
		protocol: 'https',
		host: 'api-kylin.eosasia.one',
		port: 443,
		chainId: eos_chain_id
	}

	bos_network = {
		blockchain: 'eos',
		protocol: 'http',
		host: 'jungle2.cryptolions.io',
		port: 8888,
		chainId: bos_chain_id
	}

	meetone_network = {
		blockchain: 'eos',
		protocol: 'http',
		host: 'localhost',
		port: 8090,
		chainId: meetone_chain_id
	}
}

const eos_endpoint     = eos_network.protocol     + '://' + eos_network.host     + ':' + eos_network.port;
const bos_endpoint     = bos_network.protocol     + '://' + bos_network.host     + ':' + bos_network.port;
const meetone_endpoint = meetone_network.protocol + '://' + meetone_network.host + ':' + meetone_network.port;

var current_block_chain  = "eos";
var current_my_app_name  = my_app_name_eos;
var current_network      = eos_network;
var current_endpoint     = eos_endpoint;
var current_user_account = "";
var current_album_type   = "public";
var current_album_name   = "";
var doc_scroll_top       = 0;
var scatter = null;

const name_max_len   = 36;
const detail_max_len = 512;

function set_lang_cookie(lang_type)
{
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + 30000);
	document.cookie = "i18n_lang=" + escape(lang_type) + "^;expires=" + exdate.toGMTString() + ";path=/";
}

function get_cookie(c_name)
{
	if (document.cookie && document.cookie != '') {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) { 
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf("^", c_start);
			if (c_end == -1) c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

function change_lang(lang_type)
{
	set_lang_cookie(lang_type);

	jQuery.i18n.properties({
		name : "strings",
		path : "/app/albumoftimes/i18n/",
		mode : 'map',
		language : lang_type,
		cache : false,
		encoding : 'UTF-8',
		async : false,
		callback : function() {
			$("#header_title").html($.i18n.prop('header_title'));
			$("#select_net").html($.i18n.prop('select_net'));
			$("#query_balance").html($.i18n.prop('query_balance'));
			$("#deposit").html($.i18n.prop('deposit'));
			$("#withdraw").html($.i18n.prop('withdraw'));
			$("#album_introduction").html($.i18n.prop('album_introduction'));
			$("#user_must_read").html($.i18n.prop('user_must_read'));
			$("#tab_private_album").html($.i18n.prop('tab_private_album'));
			$("#tab_public_album").html($.i18n.prop('tab_public_album'));
			$("#create_private_album").html($.i18n.prop('create_private_album'));
			$("#upload_picture").html($.i18n.prop('upload_picture'));
			$("#current_block_chain").html($.i18n.prop('current_block_chain'));
			$("#current_album_label").html($.i18n.prop('current_album_label'));
			$("#login").html($.i18n.prop('login'));
			$("#logoff").html($.i18n.prop('logoff'));
			$("#pic_name").html($.i18n.prop('pic_name'));
			$("#pic_detail").html($.i18n.prop('pic_detail'));
			$("#album_name").html($.i18n.prop('album_name'));
			$("#pic_detail_label").html($.i18n.prop('pic_detail_label'));
			$("#query_balance_label").html($.i18n.prop('query_balance_label'));
			$("#deposit_quantity_label").html($.i18n.prop('deposit_quantity_label'));
			$("#withdraw_quantity_label").html($.i18n.prop('withdraw_quantity_label'));
			$("#paysortfee_quantity_label").html($.i18n.prop('paysortfee_quantity_label'));
			$(".quantity_example").html($.i18n.prop('quantity_example'));
			$(".my_cancel").html($.i18n.prop('my_cancel'));
			$(".my_confirm").html($.i18n.prop('my_confirm'));
			$(".my_close").html($.i18n.prop('my_close'));
			$("#target_private_album_id").html($.i18n.prop('target_private_album_id'));
			$("#target_public_album_id").html($.i18n.prop('target_public_album_id'));
			if (current_album_type == "public") {
				$("#current_album_type").html($("#tab_public_album").html());
			} else {
				$("#current_album_type").html($("#tab_private_album").html());
			}
		}
	});
}

$(document).ready(function () {
	if ( get_cookie('i18n_lang') == undefined || get_cookie('i18n_lang') == null || get_cookie('i18n_lang') == "" ) {  
		change_lang("en");
	} else {
		change_lang( get_cookie('i18n_lang') );
	}

	$("#icon_cn").on("click", function() {
		change_lang("zh");
	});

	$("#icon_en").on("click", function() {
		change_lang("en");
	});

	$("#tab_private_album").on("click", function() {
		current_album_type = "private";
		$("#current_album_type").html($("#tab_private_album").html());
		get_private_albums();
	});

	$("#tab_public_album").on("click", function() {
		current_album_type = "public";
		$("#current_album_type").html($("#tab_public_album").html());
		get_public_albums();
	});

	$("#pics_div").hide();

	$("#header_go_back").on("click", function() {
		go_back();
	});

	$("#menu_eos").on("click", function() {
		$("#current_block_chain_value").html("EOS");
		$("#menu_body").offCanvas('close');
		current_block_chain = "eos";
		current_my_app_name = my_app_name_eos;
		current_network     = eos_network;
		current_endpoint    = eos_endpoint;
		change_network();
	});

	$("#menu_bos").on("click", function() {
		$("#current_block_chain_value").html("BOS");
		$("#menu_body").offCanvas('close');
		current_block_chain = "bos";
		current_my_app_name = my_app_name_bos;
		current_network     = bos_network;
		current_endpoint    = bos_endpoint;
		change_network();
	});

	$("#menu_meetone").on("click", function() {
		//------------------------------
		return;  // 如果支持了，则进行如下：删除本行、修改html页面中的对应地方、修改本文件中的clear_login_flag()函数中的对应地方。
		//------------------------------
		$("#current_block_chain_value").html("MeetOne");
		$("#menu_body").offCanvas('close');
		current_block_chain = "meetone";
		current_my_app_name = my_app_name_meetone;
		current_network     = meetone_network;
		current_endpoint    = meetone_endpoint;
		change_network();
	});

	$("#login").on("click", function() {
		$("#menu_body").offCanvas('close');
		// 登录前必须先退出，因为scatter只能保存一个与网络无关的id
		if ( !(scatter === null) && scatter.identity ) {
			if (get_cookie('i18n_lang') === "zh") alert("请先退出，再进行登录。");
			else                                  alert("Please log off, then login.");
			return;
		}
		if (scatter === null) {
			ScatterJS.scatter.connect(current_my_app_name, current_network).then(
				my_login
			).catch(error => {
				show_error(error);
			});
		} else {
			scatter.connect(current_my_app_name, current_network).then(
				my_login
			).catch(error => {
				show_error(error);
			});
		}
	});

	$("#logoff").on("click", function() {
		$("#menu_body").offCanvas('close');
		my_logoff();
	});

	$("#query_balance").on("click", function() {
		$("#menu_body").offCanvas('close');
		query_balance();
	});

	$("#deposit").on("click", function() {
		$("#menu_body").offCanvas('close');
		deposit();
	});

	$("#withdraw").on("click", function() {
		$("#menu_body").offCanvas('close');
		withdraw();
	});

	$("#create_private_album").on("click", function() {
		create_private_album();
	});

	//

	ScatterJS.plugins( new ScatterEOS() );
	change_network();
	setTimeout( function(){ get_public_albums() }, 1000 );
});

function go_back()
{
	if (current_album_type != "" && current_album_name != "") {
		current_album_name = "";
		$("#current_album_name").html("&nbsp;");
		$("#pics_div").hide();
		$("#all_tabs").show();
		window.scrollTo(0, doc_scroll_top);
	}
}

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

function get_public_albums()
{
	if (current_album_type == "public") {
		$("#my_modal_loading").modal('open');
		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				const resp = await rpc.get_table_rows({ // 公共相册数量不多，假设不超过100个。
					json:  true,
					code:  contract_name,
					scope: contract_name,
					table: 'pubalbums',
					limit: 100,
					reverse: false,
					show_payer: false
				});
				var albums = '';
				var album_name = "";
				var i = 0;
				var len = resp.rows.length;
				if (len == 0) {
					albums = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
				}
				for (i = 0; i < len; i++) {
					if (get_cookie('i18n_lang') == "zh") {
						album_name = resp.rows[i].name_cn;
					} else {
						album_name = resp.rows[i].name_en;
					}
					albums = albums + '<div class="am-u-sm-6 am-u-md-4 am-u-lg-2"><div class="am-thumbnail">';
					albums = albums + '<img src="' + ipfs_root_url + resp.rows[i].cover_thumb_pic_ipfs_hash + '" alt="cover pic" onclick=\'show_pics_div(' + resp.rows[i].pub_album_id + ', "' + album_name + '");\'/>';
					albums = albums + '<div class="am-thumbnail-caption">';
					albums = albums + '<p class="am-text-xs">id: ' + resp.rows[i].pub_album_id + '<br />' + album_name + ' (' + resp.rows[i].pic_num + ')<br />' + timestamp_trans(resp.rows[i].create_time) + ' UTC</p>';
					albums = albums + '</div></div></div>';
				}
				$("#public_albums_div").html(albums);
				$("#my_modal_loading").modal('close');
			} catch (e) {
				$("#public_albums_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
				$("#my_modal_loading").modal('close');
				alert(e);
			}
		})();
	}
}

function get_private_albums()
{
	if (current_album_type == "private" && current_user_account != "") {
		$("#my_modal_loading").modal('open');
		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				const resp = await rpc.get_table_rows({ // 假设每位用户的个人相册数量不超过100个。
					json:  true,
					code:  contract_name,
					scope: contract_name,
					table: 'albums',
					index_position: 2,
					key_type: 'name',
					lower_bound: current_user_account,
					limit: 100,
					reverse: false,
					show_payer: false
				});
				var albums = '';
				var album_count = 0;
				var i = 0;
				var len = resp.rows.length;
				for (i = 0; i < len; i++) {
					if (resp.rows[i].owner != current_user_account) { break; }
					albums = albums + '<div class="am-u-sm-6 am-u-md-4 am-u-lg-2"><div class="am-thumbnail">';
					albums = albums + '<img src="' + ipfs_root_url + resp.rows[i].cover_thumb_pic_ipfs_hash + '" alt="cover pic" onclick=\'show_pics_div(' + resp.rows[i].album_id + ', "' + resp.rows[i].name + '");\'/>';
					albums = albums + '<div class="am-thumbnail-caption">';
					albums = albums + '<p class="am-text-xs">id: ' + resp.rows[i].album_id + '<br />' + resp.rows[i].name + ' (' + resp.rows[i].pic_num + ')<br />' + timestamp_trans(resp.rows[i].create_time) + ' UTC</p>';
					albums = albums + '<div class="am-dropdown am-dropdown-up" id="my_dropdown_' + i + '" data-am-dropdown>';
					albums = albums + '<button class="am-btn am-btn-success am-round am-dropdown-toggle" onclick="show_my_dropdown(' + i + ');" data-am-dropdown-toggle>action <span class="am-icon-caret-up"></span></button><ul class="am-dropdown-content">';
					if (get_cookie('i18n_lang') === "zh") {
						albums = albums + '<li><a href="##" onclick="renamealbum('    + resp.rows[i].album_id + ',' + i + ');">修改相册名字</a></li>';
						albums = albums + '<li><a href="##" onclick="alert(\'delete ' + resp.rows[i].album_id + '\');">delete</a></li>';
					} else {
						albums = albums + '<li><a href="##" onclick="renamealbum('    + resp.rows[i].album_id + ',' + i + ');">rename</a></li>';
						albums = albums + '<li><a href="##" onclick="alert(\'delete ' + resp.rows[i].album_id + '\');">delete</a></li>';
					}
					albums = albums + '</ul></div></div></div></div>';
					album_count++;
				}
				$("#private_albums_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
				if (album_count == 0) {
					if (get_cookie('i18n_lang') === "zh") albums = '<p>&nbsp;</p><p>您还没有创建个人相册。</p><p>&nbsp;</p>';
					else                                  albums = '<p>&nbsp;</p><p>You have no albums.   </p><p>&nbsp;</p>';
				}
				$("#private_albums_div").html(albums);
				$("#my_modal_loading").modal('close');
			} catch (e) {
				$("#private_albums_div").html('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
				$("#my_modal_loading").modal('close');
				alert(e);
			}
		})();
	} else {
		if (get_cookie('i18n_lang') === "zh") $("#private_albums_div").html('<p>&nbsp;</p><p>请登录。     </p><p>&nbsp;</p>');
		else                                  $("#private_albums_div").html('<p>&nbsp;</p><p>Please login.</p><p>&nbsp;</p>');
	}
}

function show_pics_div(album_id, album_name)
{
	if (current_album_type == "public" || current_album_type == "private" && current_user_account != "") {
		current_album_name = album_name;
		$("#current_album_name").html("&nbsp;" + current_album_name);
		doc_scroll_top = get_doc_scroll_top();
		$("#my_modal_loading").modal('open');

		var index_pos = 0;
		var lower_bd  = new BigNumber(0);

		if (current_album_type == "private") {
			index_pos = 3;
			lower_bd  = BigNumber(album_id);
		} else if (current_album_type == "public") {
			index_pos = 4;
			lower_bd  = BigNumber(album_id).multipliedBy(4294967296); // 4294967296 = 2的32次方，相当于左移32位。
		} else {
			$("#my_modal_loading").modal('close');
			alert("Unknown error.");
			return;
		}

		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				const resp = await rpc.get_table_rows({ // 假设每个公共相册和个人相册里面的图片数量都不超过2000个。
					json:  true,
					code:  contract_name,
					scope: contract_name,
					table: 'pics',
					index_position: index_pos,
					key_type: 'i64',
					lower_bound: lower_bd,
					limit: 2000,
					reverse: false,
					show_payer: false
				});
				var pics = '';
				var pic_count = 0;
				var i = 0;
				var len = resp.rows.length;
				for (i = 0; i < len; i++) {
					if (current_album_type == "private") {
						if (album_id != resp.rows[i].album_id) { break; }
					} else {
						if (album_id != resp.rows[i].public_album_id) { break; }
					}
					pics = pics + '<li><div class="am-gallery-item">';
					pics = pics + '<img src="' + ipfs_root_url + resp.rows[i].thumb_ipfs_hash + '" data-rel="' + ipfs_root_url + resp.rows[i].ipfs_hash + '" alt="' + resp.rows[i].name + '" />';
					pics = pics + '<div class="am-text-xs">' + resp.rows[i].name + ' (' + resp.rows[i].upvote_num + ')<br />pic id: ' + resp.rows[i].pic_id + '<br />own: ' + resp.rows[i].owner + '<br />public album id: ' + resp.rows[i].public_album_id + '<br />display priority: ' + resp.rows[i].sort_fee + '<br />' + timestamp_trans(resp.rows[i].upload_time) + ' UTC</div>';
					pics = pics + '<div class="am-text-xs" style="width:100%;padding:1px;text-overflow: ellipsis;overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;line-height: 1.3em;max-height: 3.9em;" onclick="show_pic_detail(\'' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(resp.rows[i].detail)) + '\');">' + resp.rows[i].detail + '</div>';
					pics = pics + '<div class="am-dropdown am-dropdown-up" id="pic_dropdown_' + i + '" data-am-dropdown>';
					pics = pics + '<button class="am-btn am-btn-success am-round am-dropdown-toggle" onclick="show_pic_dropdown(' + i + ');" data-am-dropdown-toggle>action <span class="am-icon-caret-up"></span></button><ul class="am-dropdown-content">';
					if (get_cookie('i18n_lang') === "zh") {
						if (current_album_type === "private") {
							pics = pics + '<li><a href="##" onclick="modifypicnd('              + resp.rows[i].pic_id + ',' + i + ');">修改名字和描述</a></li>';
							pics = pics + '<li><a href="##" onclick="setcover('                 + resp.rows[i].album_id + ',\'' + resp.rows[i].thumb_ipfs_hash + '\',' + i + ');">设置为所属个人相册的封面</a></li>';
							pics = pics + '<li><a href="##" onclick="movetoalbum('              + resp.rows[i].pic_id + ',' + i + ');">移入另一个个人相册</a></li>';
							pics = pics + '<li><a href="##" onclick="joinpubalbum('             + resp.rows[i].pic_id + ',' + i + ');">加入公共相册</a></li>';
							pics = pics + '<li><a href="##" onclick="outpubalbum('              + resp.rows[i].pic_id + ',' + i + ');">移出所属公共相册</a></li>';
							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">支付在公共相册中优先显示的费用</a></li>';
							pics = pics + '<li><a href="##" onclick="alert(\'delete '           + resp.rows[i].pic_id + '\');">delete</a></li>';
						} else {
							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">支付在公共相册中优先显示的费用</a></li>';
							pics = pics + '<li><a href="##" onclick="upvotepic('                + resp.rows[i].pic_id + ',' + i + ');">点赞</a></li>';
							pics = pics + '<li><a href="##" onclick="alert(\'rm illegal pic '   + resp.rows[i].pic_id + '\');">rm illegal pic</a></li>';
						}
					} else {
						if (current_album_type === "private") {
							pics = pics + '<li><a href="##" onclick="modifypicnd('              + resp.rows[i].pic_id + ',' + i + ');">edit name and detail</a></li>';
							pics = pics + '<li><a href="##" onclick="setcover('                 + resp.rows[i].album_id + ',\'' + resp.rows[i].thumb_ipfs_hash + '\',' + i + ');">set as cover of private album</a></li>';
							pics = pics + '<li><a href="##" onclick="movetoalbum('              + resp.rows[i].pic_id + ',' + i + ');">move to another private album</a></li>';
							pics = pics + '<li><a href="##" onclick="joinpubalbum('             + resp.rows[i].pic_id + ',' + i + ');">join public album</a></li>';
							pics = pics + '<li><a href="##" onclick="outpubalbum('              + resp.rows[i].pic_id + ',' + i + ');">move out from public album</a></li>';
							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">pay for display priority<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in public album</a></li>';
							pics = pics + '<li><a href="##" onclick="alert(\'delete '           + resp.rows[i].pic_id + '\');">delete</a></li>';
						} else {
							pics = pics + '<li><a href="##" onclick="paysortfee('               + resp.rows[i].pic_id + ',' + i + ');">pay for display priority<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in public album</a></li>';
							pics = pics + '<li><a href="##" onclick="upvotepic('                + resp.rows[i].pic_id + ',' + i + ');">upvote</a></li>';
							pics = pics + '<li><a href="##" onclick="alert(\'rm illegal pic '   + resp.rows[i].pic_id + '\');">rm illegal pic</a></li>';
						}
					}
					pics = pics + '</ul></div></div></li>';
					pic_count++;
				}
				if (pic_count <= 0) {
					if (get_cookie('i18n_lang') === "zh") $("#pics_footer_msg").html('这个相册是空的。');
					else                                  $("#pics_footer_msg").html('There are no pics in this album.');
				} else {
					$("#pics_footer_msg").html('&nbsp;');
				}
				$(".am-pureview-nav").html('');     // amaze ui need
				$(".am-pureview-slider").html('');  // amaze ui need
				$("#pics_ul").html(pics);
				$("#my_modal_loading").modal('close');
				$("#all_tabs").hide();
				$("#pics_div").show();
				window.scrollTo(0, 0);
			} catch (e) {
				$(".am-pureview-nav").html('');     // amaze ui need
				$(".am-pureview-slider").html('');  // amaze ui need
				$("#pics_ul").html('');
				$("#pics_footer_msg").html('&nbsp;');
				$("#my_modal_loading").modal('close');
				$("#all_tabs").hide();
				$("#pics_div").show();
				window.scrollTo(0, 0);
				alert(e);
			}
		})();
	}
}

function show_my_dropdown(index)
{
	$("#my_dropdown_" + index).dropdown('open');
}

function show_pic_dropdown(index)
{
	$("#pic_dropdown_" + index).dropdown('open');
}

function show_pic_detail(detail_base64)
{
	$("#view_pic_detail").val(CryptoJS.enc.Base64.parse(detail_base64).toString(CryptoJS.enc.Utf8));
	$("#div_view_pic_detail").modal('open');
}

function timestamp_trans(timestamp)
{
	var date = new Date(timestamp*1000);
	var Y = date.getFullYear();
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
	var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	//var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
	//var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
	//var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
	//return Y + '.' + M + '.' + D + ' ' + h + ':' + m + ':' + s;
	return Y + '.' + M + '.' + D;
}

function get_doc_scroll_top()
{
	var t;
	if (document.documentElement && document.documentElement.scrollTop) {
		t = document.documentElement.scrollTop;
	} else if (document.body) {
		t = document.body.scrollTop;
	} else {
		t = 0;
	}
	return t;
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

// 为图片点赞
function upvotepic(pic_id, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: contract_name,
					name: 'upvotepic',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						user: account.name,
						pic_id: pic_id
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}

// 修改图片的名字和描述
function modifypicnd(pic_id, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');
	$("#real_pic_id").val(pic_id);

	if (get_cookie('i18n_lang') === "zh") {
		$("#pic_new_name").attr("placeholder","最长12个汉字或36个英文字符");
		$("#pic_new_detail").attr("placeholder","最长170个汉字或512个英文字符");
	} else {
		$("#pic_new_name").attr("placeholder","Up to 36 english characters.");
		$("#pic_new_detail").attr("placeholder","Up to 512 english characters.");
	}

	$('#div_modifypicnd').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let real_pic_id = Number($("#real_pic_id").val());
			let name_str   = $("#pic_new_name").val().trim();
			let detail_str = $("#pic_new_detail").val().trim();
			if (name_str.length === 0 || detail_str.length === 0) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：名字和描述不能为空。");
				} else {
					alert("Error: name and detail can not be blank.");
				}
				return;
			}

			send_transaction( function(api, account) {
				return api.transact(
					{
						actions: [{
							account: contract_name,
							name: 'modifypicnd',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								owner:      account.name,
								pic_id:     real_pic_id,
								new_name:   name_str,
								new_detail: detail_str
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 将图片移动到另一个相册（图片可以在个人相册之间移动）
function movetoalbum(pic_id, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');
	$("#movetoalbum_pic_id").val(pic_id);

	$('#div_movetoalbum').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let movetoalbum_pic_id = Number($("#movetoalbum_pic_id").val());
			if ( !$.isNumeric( $("#movetoalbum_target_private_album_id").val() ) ) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：输入的内容不是有效的数字。");
				} else {
					alert("Error: Input is not a valid number.");
				}
				return;
			}
			let movetoalbum_target_private_album_id = Number($("#movetoalbum_target_private_album_id").val());

			send_transaction( function(api, account) {
				return api.transact(
					{
						actions: [{
							account: contract_name,
							name: 'movetoalbum',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								owner:        account.name,
								pic_id:       movetoalbum_pic_id,
								dst_album_id: movetoalbum_target_private_album_id
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 将图片加入某个公共相册
function joinpubalbum(pic_id, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');
	$("#joinpubalbum_pic_id").val(pic_id);

	$('#div_joinpubalbum').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let joinpubalbum_pic_id = Number($("#joinpubalbum_pic_id").val());
			if ( !$.isNumeric( $("#joinpubalbum_target_public_album_id").val() ) ) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：输入的内容不是有效的数字。");
				} else {
					alert("Error: Input is not a valid number.");
				}
				return;
			}
			let joinpubalbum_target_public_album_id = Number($("#joinpubalbum_target_public_album_id").val());

			send_transaction( function(api, account) {
				return api.transact(
					{
						actions: [{
							account: contract_name,
							name: 'joinpubalbum',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								owner:        account.name,
								pic_id:       joinpubalbum_pic_id,
								pub_album_id: joinpubalbum_target_public_album_id
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 将图片移出所属公共相册
function outpubalbum(pic_id, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: contract_name,
					name: 'outpubalbum',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						owner:        account.name,
						pic_id:       pic_id
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}

// 设置个人相册的封面图片
function setcover(album_id, cover_thumb_pic_ipfs_hash, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');

	send_transaction( function(api, account) {
		return api.transact(
			{
				actions: [{
					account: contract_name,
					name: 'setcover',
					authorization: [{
						actor: account.name,
						permission: account.authority
					}],
					data: {
						owner:                     account.name,
						album_id:                  album_id,
						cover_thumb_pic_ipfs_hash: cover_thumb_pic_ipfs_hash
					}
				}]
			},{
				blocksBehind: 3,
				expireSeconds: 60
			}
		);
	});
}

// 修改个人相册的名字
function renamealbum(album_id, dropdown_id)
{
	$("#my_dropdown_" + dropdown_id).dropdown('close');
	$("#real_album_id").val(album_id);

	if (get_cookie('i18n_lang') === "zh") {
		$("#album_new_name").attr("placeholder","最长12个汉字或36个英文字符");
	} else {
		$("#album_new_name").attr("placeholder","Up to 36 english characters.");
	}

	$('#div_renamealbum').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let real_album_id = Number($("#real_album_id").val());
			let name_str   = $("#album_new_name").val().trim();
			if (name_str.length === 0) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：名字不能为空。");
				} else {
					alert("Error: name can not be blank.");
				}
				return;
			}

			send_transaction( function(api, account) {
				return api.transact(
					{
						actions: [{
							account: contract_name,
							name: 'renamealbum',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								owner:      account.name,
								album_id:   real_album_id,
								new_name:   name_str
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 查询余额
function query_balance()
{
	if (current_user_account != "") {
		$("#my_modal_loading").modal('open');
		const rpc = new eosjs_jsonrpc.JsonRpc(current_endpoint);
		(async () => {
			try {
				const resp = await rpc.get_table_rows({
					json:  true,
					code:  contract_name,
					scope: contract_name,
					table: 'accounts',
					index_position: 1,
					key_type: 'name',
					lower_bound: current_user_account,
					limit: 1,
					reverse: false,
					show_payer: false
				});
				let len = resp.rows.length;
				if (len === 0) {
					$("#your_balance").val("0");
				} else {
					if (resp.rows[0].owner === current_user_account) {
						$("#your_balance").val(resp.rows[0].quantity);
					} else {
						$("#your_balance").val("0");
					}
				}
				$("#my_modal_loading").modal('close');
				$('#div_query_balance').modal({
					relatedTarget: this,
					onCancel: function() {
					},
					onConfirm: function() {
					}
				});
			} catch (e) {
				$("#my_modal_loading").modal('close');
				alert(e);
			}
		})();
	} else {
		if (get_cookie('i18n_lang') === "zh") alert("请登录。");
		else                                  alert("Please login.");
	}
}

// 充值
function deposit()
{
	if (current_user_account === "") {
		if (get_cookie('i18n_lang') === "zh") { alert("请登录。"); }
		else                                  { alert("Please login."); }
		return;
	}

	$('#div_deposit').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let quantity_str = $("#deposit_quantity").val().trim();
			if (quantity_str.length === 0) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：充值数量不能为空。");
				} else {
					alert("Error: deposit quantity can not be blank.");
				}
				return;
			}

			send_transaction( function(api, account) {
				return api.transact(
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
								to: contract_name,
								quantity: quantity_str,
								memo: 'albumoftimes deposit'
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 提现
function withdraw()
{
	if (current_user_account === "") {
		if (get_cookie('i18n_lang') === "zh") { alert("请登录。"); }
		else                                  { alert("Please login."); }
		return;
	}

	$('#div_withdraw').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let quantity_str = $("#withdraw_quantity").val().trim();
			if (quantity_str.length === 0) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：提现数量不能为空。");
				} else {
					alert("Error: withdraw quantity can not be blank.");
				}
				return;
			}

			send_transaction( function(api, account) {
				return api.transact(
					{
						actions: [{
							account: contract_name,
							name: 'withdraw',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								to: account.name,
								quantity: quantity_str
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 为公共相册中的图片支付排序靠前的费用
function paysortfee(pic_id, dropdown_id)
{
	$("#pic_dropdown_" + dropdown_id).dropdown('close');
	$("#paysortfee_pic_id").val(pic_id);

	if (current_user_account === "") {
		if (get_cookie('i18n_lang') === "zh") { alert("请登录。"); }
		else                                  { alert("Please login."); }
		return;
	}

	$('#div_paysortfee').modal({
		relatedTarget: this,
		onCancel: function() {
		},
		onConfirm: function() {
			let paysortfee_pic_id = Number($("#paysortfee_pic_id").val());
			let quantity_str = $("#paysortfee_quantity").val().trim();
			if (quantity_str.length === 0) {
				if (get_cookie('i18n_lang') === "zh") {
					alert("错误：支付数量不能为空。");
				} else {
					alert("Error: quantity can not be blank.");
				}
				return;
			}

			send_transaction( function(api, account) {
				return api.transact(
					{
						actions: [{
							account: contract_name,
							name: 'paysortfee',
							authorization: [{
								actor: account.name,
								permission: account.authority
							}],
							data: {
								owner:   account.name,
								pic_id:  paysortfee_pic_id,
								sortfee: quantity_str
							}
						}]
					},{
						blocksBehind: 3,
						expireSeconds: 60
					}
				);
			});
		}
	});
}

// 创建个人相册
function create_private_album()
{
	//
}
