
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

	$("#tab_real").on("click", function() {
		current_note_category = "real";
		current_article_id = 0;
		get_home_page_articles();
	});

	$("#tab_dream").on("click", function() {
		current_note_category = "dream";
		current_article_id = 0;
		get_home_page_articles();
	});

	$("#tab_album").on("click", function() {
		current_note_category = "album";
		current_article_id = 0;
		get_home_page_album_items();
	});

	$("#article_content_div").hide();
	$("#my_articles_div").hide();
	$("#my_replies_div").hide();
	$("#users_i_follow_div").hide();
	$("#users_follow_me_div").hide();
	$("#articles_of_user_i_follow_div").hide();
	$("#articles_of_user_follow_me_div").hide();
	$("#my_messages_div").hide();

	page_control_init();

	$("#header_go_back").on("click", function() {
		go_back();
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

	$("#write_an_article_href").on("click", function() {
		if(current_user_account === "") {
			alert($("#please_login").html());
			return;
		}
		$("#forward_article_id").val("0");
		write_an_article_show_modal();
	});

	$("#link_post_picture").on("click", function() {
		if(current_user_account === "") {
			alert($("#please_login").html());
			return;
		}
		post_picture_show_modal();
	});

	$("#link_post_video").on("click", function() {
		if(current_user_account === "") {
			alert($("#please_login").html());
			return;
		}
		post_video_show_modal();
	});

	$("#link_post_audio").on("click", function() {
		if(current_user_account === "") {
			alert($("#please_login").html());
			return;
		}
		post_audio_show_modal();
	});

	$("#link_post_other_file").on("click", function() {
		if(current_user_account === "") {
			alert($("#please_login").html());
			return;
		}
		post_other_file_show_modal();
	});

	$("#view_times_of_txn_article").on("click", function() {
		view_times_of_txn_article();
	});

	$("#post_article").on("click", function() {
		post_article();
	});

	$("#resume_from_break_point_post_article").on("click", function() {
		resume_from_break_point_post_article();
	});

	$("#micro_text").on("click", function() {
		$("#title_of_article").attr("disabled", true);
	});

	$("#long_text").on("click", function() {
		$("#title_of_article").attr("disabled", false);
	});

	$("#view_times_of_txn_reply").on("click", function() {
		view_times_of_txn_reply();
	});

	$("#post_reply").on("click", function() {
		post_reply();
	});

	$("#resume_from_break_point_post_reply").on("click", function() {
		resume_from_break_point_post_reply();
	});

	$("#view_times_of_txn_post_item").on("click", function() {
		view_times_of_txn_post_item();
	});

	$("#post_item").on("click", function() {
		post_item();
	});

	$("#resume_from_break_point_post_item").on("click", function() {
		resume_from_break_point_post_item();
	});

	$("#create_edit_profile").on("click", function() {
		create_edit_profile();
	});

	$("#delete_profile").on("click", function() {
		delete_profile();
	});

	$("#save_profile").on("click", function() {
		save_profile();
	});

	$("#user_info_href").on("click", function() {
		show_user_info();
	});

	$("#follow_user").on("click", function() {
		follow_user();
	});

	$("#unfollow_user").on("click", function() {
		unfollow_user();
	});

	$("#eth_connect_metamask").on("click", function() {
		$("#menu_body").offCanvas('close');
		eth_connect_metamask();
	});

	$("#article_in_eos").on("click", function() {
		$("#amount_per_trn_article").val(amount_per_trn_article_conf_eos);
		$("#amount_per_trn_article").attr("readonly", false);
	});

	$("#article_in_eth").on("click", function() {
		$("#amount_per_trn_article").val(amount_per_trn_article_conf_eth);
		$("#amount_per_trn_article").attr("readonly", true);
		if ( ! check_eth_metamask_installed() ) return;
		if ( ! check_eth_metamask_connected() ) return;
	});

	$("#article_in_arweave").on("click", function() {
		$("#amount_per_trn_article").val('N/A');
		$("#amount_per_trn_article").attr("readonly", true);
	});

	$("#reply_in_eos").on("click", function() {
		$("#amount_per_trn_reply").val(amount_per_trn_reply_conf_eos);
		$("#amount_per_trn_reply").attr("readonly", false);
	});

	$("#reply_in_eth").on("click", function() {
		$("#amount_per_trn_reply").val(amount_per_trn_reply_conf_eth);
		$("#amount_per_trn_reply").attr("readonly", true);
		if ( ! check_eth_metamask_installed() ) return;
		if ( ! check_eth_metamask_connected() ) return;
	});

	$("#reply_in_arweave").on("click", function() {
		$("#amount_per_trn_reply").val('N/A');
		$("#amount_per_trn_reply").attr("readonly", true);
	});

	$("#post_item_in_arweave").on("click", function() {
		$("#amount_per_trn_post_item").val('N/A');
		$("#amount_per_trn_post_item").attr("readonly", true);
	});

	$("#project_white_paper").on("click", function() {
		$("#menu_body").offCanvas('close');
		if (get_cookie('i18n_lang') === "zh") show_article_content_div(7);
		else                                  show_article_content_div(8);
	});

	$("#project_introduction_and_user_manual").on("click", function() {
		$("#menu_body").offCanvas('close');
		if (get_cookie('i18n_lang') === "zh") show_article_content_div(5);
		else                                  show_article_content_div(6);
	});

	$("#user_must_read").on("click", function() {
		$("#menu_body").offCanvas('close');
		if (get_cookie('i18n_lang') === "zh") show_article_content_div(3);
		else                                  show_article_content_div(4);
	});

	$("#technical_implementation_principle").on("click", function() {
		$("#menu_body").offCanvas('close');
		if (get_cookie('i18n_lang') === "zh") show_article_content_div(1);
		else                                  show_article_content_div(2);
	});

	$("#settings").on("click", function() {
		$("#menu_body").offCanvas('close');
		edit_settings();
	});

	articles_array        = [0];
	current_article_id    = 0;
	doc_scroll_top        = 0;
	current_page          = "home";
	current_note_category = "real";

	preview_of_article_map = new Map();
	content_of_article_map = new Map();
	content_of_reply_map   = new Map();
	content_of_image_map   = new Map();
	article_user_map       = new Map();
	reply_user_map         = new Map();
	user_avatar_map        = new Map();

	//

	arweave = Arweave.init(arweave_initialisation_options);

	ScatterJS.plugins( new ScatterEOS() );

	init_post_item();
	init_settings();

	$("#div_article_posting").hide();
	$("#div_reply_posting").hide();
	$("#div_item_posting").hide();

	setTimeout(
		function(){
			get_home_page_articles()
		}, 1000
	);
});
