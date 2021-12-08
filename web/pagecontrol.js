
function page_control_init()
{
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

function show_my_articles()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function show_my_replies()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function show_users_i_follow()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function show_users_follow_me()
{
	$("#menu_body").offCanvas('close');
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}
