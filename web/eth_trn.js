
// utf8编码

function check_eth_metamask_installed()
{
	if (typeof window.ethereum !== 'undefined') {
		return true;
	} else {
		alert( $("#metamask_not_installed").html() );
		return false;
	}
}

function check_eth_metamask_connected()
{
	if ( eth_user_account !== '' && window.ethereum.isConnected() ) {
		return true;
	} else {
		alert( $("#metamask_not_connected").html() );
		return false;
	}
}

function eth_connect_metamask()
{
}
