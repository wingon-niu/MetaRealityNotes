
// utf8编码

function init_settings()
{
	let article_num      = get_cookie("article_num_per_page");
	let reply_num        = get_cookie("reply_num_per_page");
	let user_num         = get_cookie("user_num_per_page");
	let item_num         = get_cookie("item_num_per_page");
	let articles_sort    = get_cookie("articles_sort_by");
	let replies_sort     = get_cookie("replies_sort_by");
	let album_items_sort = get_cookie("album_items_sort_by");

	if (article_num === "") article_num_per_page = 20;
	else                    article_num_per_page = Number(article_num);

	if (reply_num === "")   reply_num_per_page   = 20;
	else                    reply_num_per_page   = Number(reply_num);

	if (user_num === "")    user_num_per_page    = 20;
	else                    user_num_per_page    = Number(user_num);

	if (item_num === "")    item_num_per_page    = 20;
	else                    item_num_per_page    = Number(item_num);

	if (articles_sort === "")    articles_sort_by    = 'last_replied_time';
	else                         articles_sort_by    =  articles_sort;

	if (replies_sort === "")     replies_sort_by     = 'ascending_order';
	else                         replies_sort_by     =  replies_sort;

	if (album_items_sort === "") album_items_sort_by = 'asc';
	else                         album_items_sort_by =  album_items_sort;
}

function edit_settings()
{
	if (get_cookie('i18n_lang') === "zh") {
		$("#span_article_num_per_page").html("每页显示文章数量：");
		$("#span_reply_num_per_page").html("每页显示回复数量：");
		$("#span_user_num_per_page").html("每页显示用户数量：");
		$("#span_item_num_per_page").html("每页显示相册内容数量：");
		$("#span_articles_sort_by").html("文章排序方式：");
		$("#span_replies_sort_by").html("回复排序方式：");
		$("#span_album_items_sort_by").html("相册内容排序方式：");
		$("#span_article_post_time").html("按照文章发布时间降序");
		$("#span_last_replied_time").html("按照文章最新回复时间降序");
		$("#span_ascending_order").html("按照发布时间升序");
		$("#span_descending_order").html("按照发布时间降序");
		$("#span_asc").html("按照发布时间升序");
		$("#span_desc").html("按照发布时间降序");
	}
	else {
		$("#span_article_num_per_page").html("Number of articles per page:");
		$("#span_reply_num_per_page").html("Number of replies per page:");
		$("#span_user_num_per_page").html("Number of users per page:");
		$("#span_item_num_per_page").html("Number of album items per page:");
		$("#span_articles_sort_by").html("Sort articles by:");
		$("#span_replies_sort_by").html("Sort replies by:");
		$("#span_album_items_sort_by").html("Sort album items by:");
		$("#span_article_post_time").html("In descending order of article posted time");
		$("#span_last_replied_time").html("In descending order according to the latest reply time of the article");
		$("#span_ascending_order").html("Ascending by posted time");
		$("#span_descending_order").html("Descending by posted time");
		$("#span_asc").html("Ascending by posted time");
		$("#span_desc").html("Descending by posted time");
	}

	$("#input_article_num_per_page").val(article_num_per_page);
	$("#input_reply_num_per_page").val(reply_num_per_page);
	$("#input_user_num_per_page").val(user_num_per_page);
	$("#input_item_num_per_page").val(item_num_per_page);

	if (articles_sort_by === "article_post_time") {
		$("#radio_article_post_time").attr("checked", "checked");
		$("#radio_last_replied_time").removeAttr("checked");
	}
	else if (articles_sort_by === "last_replied_time") {
		$("#radio_last_replied_time").attr("checked", "checked");
		$("#radio_article_post_time").removeAttr("checked");
	}

	if (replies_sort_by === "ascending_order") {
		$("#radio_ascending_order").attr("checked", "checked");
		$("#radio_descending_order").removeAttr("checked");
	}
	else if (replies_sort_by === "descending_order") {
		$("#radio_descending_order").attr("checked", "checked");
		$("#radio_ascending_order").removeAttr("checked");
	}

	if (album_items_sort_by === "asc") {
		$("#radio_asc").attr("checked", "checked");
		$("#radio_desc").removeAttr("checked");
	}
	else if (album_items_sort_by === "desc") {
		$("#radio_desc").attr("checked", "checked");
		$("#radio_asc").removeAttr("checked");
	}

	$('#div_settings').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() { do_edit_settings(); }
	});
}

function do_edit_settings()
{
	let article_num = Math.floor(Number($("#input_article_num_per_page").val()));
	let reply_num   = Math.floor(Number($("#input_reply_num_per_page").val()));
	let user_num    = Math.floor(Number($("#input_user_num_per_page").val()));
	let item_num    = Math.floor(Number($("#input_item_num_per_page").val()));

	if (article_num < 1 || article_num > 20) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：每页可以显示 1 - 20 个文章。");
		else                                  alert("Error: 1 - 20 articles per page.");
		return;
	}

	if (reply_num < 1 || reply_num > 20) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：每页可以显示 1 - 20 个回复。");
		else                                  alert("Error: 1 - 20 replies per page.");
		return;
	}

	if (user_num < 1 || user_num > 20) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：每页可以显示 1 - 20 个用户。");
		else                                  alert("Error: 1 - 20 users per page.");
		return;
	}

	if (item_num < 1 || item_num > 20) {
		if (get_cookie('i18n_lang') === "zh") alert("错误：每页可以显示 1 - 20 个相册内容。");
		else                                  alert("Error: 1 - 20 album items per page.");
		return;
	}

	article_num_per_page = article_num;
	reply_num_per_page   = reply_num;
	user_num_per_page    = user_num;
	item_num_per_page    = item_num;

	articles_sort_by    = $("input[name='radio_articles_sort_by']:checked").val();
	replies_sort_by     = $("input[name='radio_replies_sort_by']:checked").val();
	album_items_sort_by = $("input[name='radio_album_items_sort_by']:checked").val();

	set_cookie("article_num_per_page", article_num_per_page.toString());
	set_cookie("reply_num_per_page",   reply_num_per_page.toString());
	set_cookie("user_num_per_page",    user_num_per_page.toString());
	set_cookie("item_num_per_page",    item_num_per_page.toString());

	set_cookie("articles_sort_by",    articles_sort_by);
	set_cookie("replies_sort_by",     replies_sort_by);
	set_cookie("album_items_sort_by", album_items_sort_by);
}
