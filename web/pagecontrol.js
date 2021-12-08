
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
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function show_my_replies()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function show_users_i_follow()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function show_users_follow_me()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}
