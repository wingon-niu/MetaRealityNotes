
function create_edit_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		$("#menu_body").offCanvas('close');
		return;
	}
	$("#menu_body").offCanvas('close');
	$('#div_create_edit_profile').modal({
		relatedTarget: this,
		onCancel: function() {},
		onConfirm: function() {}
	});
}

function save_profile()
{
}

function delete_profile()
{
	if(current_user_account === "") {
		alert($("#please_login").html());
		$("#menu_body").offCanvas('close');
		return;
	}
	$("#menu_body").offCanvas('close');
}
