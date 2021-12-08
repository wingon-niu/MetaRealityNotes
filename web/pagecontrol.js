
function page_control_init()
{
	$("#home_page").on("click", function() {
		show_home();
	});

	$("#my_articles_menu").on("click", function() {
		show_my_articles();
	});

	$("#my_replies_menu").on("click", function() {
		show_my_replies();
	});

	$("#users_i_follow_menu").on("click", function() {
		show_users_i_follow();
	});

	$("#users_follow_me_menu").on("click", function() {
		show_users_follow_me();
	});
}

function show_home()
{
	$("#menu_body").offCanvas('close');
	hide_all_pages();
	current_page = "home";
	$("#all_tabs").show();
}

function show_my_articles()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	hide_all_pages();
	current_page = "my_articles";
	$("#my_articles_div").show();
}

function show_my_replies()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	hide_all_pages();
	current_page = "my_replies";
	$("#my_replies_div").show();
}

function show_users_i_follow()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	hide_all_pages();
	current_page = "users_i_follow";
	$("#users_i_follow_div").show();
}

function show_users_follow_me()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	hide_all_pages();
	current_page = "users_follow_me";
	$("#users_follow_me_div").show();
}

function hide_all_pages()
{
	$("#all_tabs").hide();
	$("#article_content_div").hide();
	$("#my_articles_div").hide();
	$("#my_replies_div").hide();
	$("#users_i_follow_div").hide();
	$("#users_follow_me_div").hide();
	$("#articles_of_user_i_follow_div").hide();
	$("#articles_of_user_follow_me_div").hide();
}
