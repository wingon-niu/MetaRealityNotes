
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

function go_back()
{
	if (articles_array.length > 1) {     // 正在打开的文章中
		articles_array.pop();
		if (articles_array.length > 1) { // 还有打开的文章
			show_article_content_div(articles_array[articles_array.length - 1]);
		} else {                         // 没有打开的文章了
			current_article_id = 0;
			$("#article_content_div").hide();
			if      (current_page === "home")                       { $("#all_tabs").show();                   }
			else if (current_page === "my_articles")                { $("#my_articles_div").show();            }
			else if (current_page === "my_replies")                 { $("#my_replies_div").show();             }
			else if (current_page === "articles_of_user_i_follow")  {                                          }
			else if (current_page === "articles_of_user_follow_me") {                                          }
			else                                                    { alert("go_back unknown error.");         }
			window.scrollTo(0, doc_scroll_top);
		}
	} else {                             // 不在打开的文章中
	}
}
