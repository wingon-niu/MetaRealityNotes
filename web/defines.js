
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

const eos_endpoint        = eos_network.protocol     + '://' + eos_network.host     + ':' + eos_network.port;

var current_block_chain   = "eos";
var current_my_app_name   = my_app_name_eos;
var current_network       = eos_network;
var current_endpoint      = eos_endpoint;
var current_user_account  = "";
var current_note_category = "real";      // "real" or "dream"
var current_article_id    = 0;
var doc_scroll_top        = 0;
var scatter               = null;

var trn_success                 = true;   // 最近一次交易的状态
var trn_hash                    = "";     // 最近一次成功的转账交易的交易hash
var post_article_first_time     = true;   // true：表示第一次发送文章；false：表示出错后进行的断点续传
var post_article_write_to_table = false;  // true：表示合约metarealnote的postarticle交易已经完成；false：表示没有完成
var post_article_current_index  = -1;     // 正在发送的字符串在整个字符串数组中的位置下标。也就是发送失败后，进行断点续传的起始下标

var post_reply_first_time       = true;
var post_reply_write_to_table   = false;
var post_reply_current_index    = -1;

const eos_per_trn_len     = 63;           // 一个utf8编码的汉字3个字节，63*3+64+2=255，刚好可以放进eos交易的memo中
const eth_per_trn_len     = 2000;
const btc_per_trn_len     = 1000;

var current_page   = "home"; // 当前页面：home/my_articles/my_replies/users_i_follow/users_follow_me/articles_of_user_i_follow/articles_of_user_follow_me
var articles_array = [0];    // 数组，保存所有打开的文章的ID，因为从文章中可以打开别的文章，所以可能会有多个打开的文章，用于点击后退按钮功能时从一个文章后退到前一个文章，逐个进行后退

const storage_locations = ['WHO', 'EOS', 'ETH', 'BSC', 'HECO', 'BTC'];

var   preview_of_article_map = null;
var   content_of_article_map = null;
var   content_of_reply_map   = null;
var   article_user_map       = null;
var   reply_user_map         = null;
