
function create_edit_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	$("#menu_body").offCanvas('close');
}

function delete_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		return;
	}
	$("#menu_body").offCanvas('close');
}
