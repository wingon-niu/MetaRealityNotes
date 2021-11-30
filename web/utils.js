
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
