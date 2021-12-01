
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
		path : "/",
		mode : 'map',
		language : lang_type,
		cache : false,
		encoding : 'UTF-8',
		async : false,
		callback : function() {
			$("#header_title").html($.i18n.prop('header_title'));
			$("#login").html($.i18n.prop('login'));
			$("#user_must_read").html($.i18n.prop('user_must_read'));
			$("#logoff").html($.i18n.prop('logoff'));
			$("#tab_real").html($.i18n.prop('tab_real'));
			$("#tab_dream").html($.i18n.prop('tab_dream'));
			$("#write_an_article").html($.i18n.prop('write_an_article'));
			$("#user_info").html($.i18n.prop('user_info'));
			$("#category_1").html($.i18n.prop('category_1'));
			$("#category_2").html($.i18n.prop('category_2'));
			$("#type_1").html($.i18n.prop('type_1'));
			$("#type_2").html($.i18n.prop('type_2'));
			$(".storage_location").html($.i18n.prop('storage_location'));

			//$(".my_cancel").html($.i18n.prop('my_cancel'));
			//$(".my_confirm").html($.i18n.prop('my_confirm'));
			//$(".my_close").html($.i18n.prop('my_close'));
			//$("#target_private_album_id").html($.i18n.prop('target_private_album_id'));
			//$("#target_public_album_id").html($.i18n.prop('target_public_album_id'));
			//if (current_album_type == "public") {
			//	$("#current_album_type").html($("#tab_public_album").html());
			//} else {
			//	$("#current_album_type").html($("#tab_private_album").html());
			//}
		}
	});
}
