
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

function timestamp_trans_full(timestamp)
{
	var date = new Date(timestamp*1000);
	var Y = date.getFullYear();
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
	var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
	var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
	var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
	return Y + '.' + M + '.' + D + ' ' + h + ':' + m + ':' + s;
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

function my_escapeHTML(unsafe)
{
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function my_unescapeHTML(safe)
{
	return safe
		.replace(/&amp;/g,  '&')
		.replace(/&lt;/g,   '<')
		.replace(/&gt;/g,   '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'");
}

function my_eos_name_to_uint64t(eos_name)
{
	return eosjsName.nameToUint64(eos_name);
}
