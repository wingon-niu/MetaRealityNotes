
const runmode               = "dev";                    // prod or dev

const worldwelfare_contract = 'worldwelfare';
const metarealnote_contract = 'metarealnote';
const pubwelfmedal_contract = 'pubwelfmedal';

const my_app_name_eos       = 'metarealnote';

var eos_chain_id            = null;
var eos_network             = null;

if (runmode === "prod") { // 生产环境
	eos_chain_id     = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191';

	eos_network = {
		blockchain: 'eos',
		protocol: 'https',
		host: 'api-kylin.eosasia.one',
		port: 443,
		chainId: eos_chain_id
	}
} else { // 开发测试环境
	eos_chain_id     = '8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f';

	eos_network = {
		blockchain: 'eos',
		protocol: 'http',
		host: '192.168.135.100',
		port: 8888,
		chainId: eos_chain_id
	}
}

const eos_endpoint     = eos_network.protocol     + '://' + eos_network.host     + ':' + eos_network.port;

var current_block_chain   = "eos";
var current_my_app_name   = my_app_name_eos;
var current_network       = eos_network;
var current_endpoint      = eos_endpoint;
var current_user_account  = "";
var current_note_category = "real";      // "real" or "dream"
var current_article_id    = 0;
var doc_scroll_top        = 0;
var scatter               = null;
var trn_success           = true;
var trn_hash              = "";

const name_max_len   = 36;
const detail_max_len = 512;
