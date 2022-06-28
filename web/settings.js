
// utf8编码

function init_settings()
{
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

	$('#div_settings').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() { do_edit_settings(); }
	});
}

function do_edit_settings()
{
	console.log("in do_edit_settings()");
}
