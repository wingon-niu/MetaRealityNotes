
function create_edit_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}

function delete_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
}
