
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
			$("#tab_album").html($.i18n.prop('tab_album'));
			$("#write_an_article").html($.i18n.prop('write_an_article'));
			$("#user_info").html($.i18n.prop('user_info'));
			$("#category_1").html($.i18n.prop('category_1'));
			$("#category_2").html($.i18n.prop('category_2'));
			$("#type_1").html($.i18n.prop('type_1'));
			$("#type_2").html($.i18n.prop('type_2'));
			$('#amount_per_trn_article').attr('placeholder', $.i18n.prop('quantity_example'));
			$(".storage_location").html($.i18n.prop('storage_location'));
			$(".trn_tip").html($.i18n.prop('trn_tip'));
			$(".number_of_trns").html($.i18n.prop('number_of_trns'));
			$(".my_cancel").html($.i18n.prop('my_cancel'));
			$(".my_confirm").html($.i18n.prop('my_confirm'));
			$(".my_close").html($.i18n.prop('my_close'));
			$("#article_title").html($.i18n.prop('article_title'));
			$("#article_content").html($.i18n.prop('article_content'));
			$("#post_article").html($.i18n.prop('post_article'));
			$("#resume_from_break_point_post_article").html($.i18n.prop('resume_from_break_point_post_article'));
			$("#my_articles_menu").html($.i18n.prop('my_articles'));
			$("#my_replies_menu").html($.i18n.prop('my_replies'));
			$("#users_i_follow_menu").html($.i18n.prop('users_i_follow'));
			$("#users_follow_me_menu").html($.i18n.prop('users_follow_me'));
			$("#please_login").html($.i18n.prop('please_login'));
			$("#home_page").html($.i18n.prop('home_page'));
			$("#forward").html($.i18n.prop('forward'));
			$("#reply").html($.i18n.prop('reply'));
			$("#forward_article").html($.i18n.prop('forward_article'));
			$("#reply_content").html($.i18n.prop('reply_content'));
			$("#post_reply").html($.i18n.prop('post_reply'));
			$("#resume_from_break_point_post_reply").html($.i18n.prop('resume_from_break_point_post_reply'));
			$("#head_hash").html($.i18n.prop('head_hash'));
			$("#reply_to").html($.i18n.prop('reply_to'));
			$("#real").html($.i18n.prop('real'));
			$("#dream").html($.i18n.prop('dream'));
			$("#create_edit_profile").html($.i18n.prop('create_edit_profile'));
			$("#delete_profile").html($.i18n.prop('delete_profile'));
			$(".user_name_span").html($.i18n.prop('user_name_span'));
			$(".user_family_name_span").html($.i18n.prop('user_family_name_span'));
			$(".user_gender_span").html($.i18n.prop('user_gender_span'));
			$(".user_birthday_span").html($.i18n.prop('user_birthday_span'));
			$(".user_description_span").html($.i18n.prop('user_description_span'));
			$("#save_profile").html($.i18n.prop('save_profile'));
			$("#delete_profile_confirm").html($.i18n.prop('delete_profile_confirm'));
			$(".eos_account_name_span").html($.i18n.prop('eos_account_name_span'));
			$(".user_avatar_id_span").html($.i18n.prop('user_avatar_id_span'));
			$(".num_of_articles_span").html($.i18n.prop('num_of_articles_span'));
			$(".num_of_replies_span").html($.i18n.prop('num_of_replies_span'));
			$(".num_of_follow_span").html($.i18n.prop('num_of_follow_span'));
			$(".num_of_followed_span").html($.i18n.prop('num_of_followed_span'));
			$(".num_of_album_items_span").html($.i18n.prop('num_of_album_items_span'));
			$(".user_reg_time_span").html($.i18n.prop('user_reg_time_span'));
			$("#follow_user").html($.i18n.prop('follow_user'));
			$("#unfollow_user").html($.i18n.prop('unfollow_user'));
			$("#next_page").html($.i18n.prop('next_page'));
			$("#reply_to_article").html($.i18n.prop('reply_to_article'));
			$("#eth_connect_metamask").html($.i18n.prop('eth_connect_metamask'));
			$("#metamask_not_installed").html($.i18n.prop('metamask_not_installed'));
			$("#metamask_not_connected").html($.i18n.prop('metamask_not_connected'));
			$("#content_chain_interruption_info_1").html($.i18n.prop('content_chain_interruption_info_1'));
			$("#content_chain_interruption_info_2").html($.i18n.prop('content_chain_interruption_info_2'));
			$("#transaction_pending_info_1").html($.i18n.prop('transaction_pending_info_1'));
			$("#transaction_pending_info_2").html($.i18n.prop('transaction_pending_info_2'));
			$("#user_must_read_and_agreement_info").html($.i18n.prop('user_must_read_and_agreement_info'));
			$("#link_post_picture").html($.i18n.prop('link_post_picture'));
			$("#link_post_video").html($.i18n.prop('link_post_video'));
			$("#link_post_audio").html($.i18n.prop('link_post_audio'));
			$("#link_post_other_file").html($.i18n.prop('link_post_other_file'));
			$("#span_post_item_description").html($.i18n.prop('span_post_item_description'));
			$("#post_item").html($.i18n.prop('post_item'));
			$("#resume_from_break_point_post_item").html($.i18n.prop('resume_from_break_point_post_item'));

			//

			if (current_user_account != '') {
				let s = $("#login").html();
				$("#login").html( s + ' ' + current_user_account );
			}
		}
	});
}
