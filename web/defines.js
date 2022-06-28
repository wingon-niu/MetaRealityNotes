
const runmode               = "dev";                    // prod or dev

const worldwelfare_contract = 'worldwelfare';
const metarealnote_contract = 'metarealnote';
const pubwelfmedal_contract = 'pubwelfmedal';

const my_app_name_eos       = 'metarealnote';

var eos_chain_id            = null;
var eos_network             = null;

if (runmode === "prod") {    // 生产环境
	eos_chain_id     = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

	eos_network = {
		blockchain: 'eos',
		protocol: 'https',
		host: 'eos.greymass.com',
		port: 443,
		chainId: eos_chain_id
	}
} else {                     // 开发测试环境
	eos_chain_id     = '8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f';

	eos_network = {
		blockchain: 'eos',
		protocol: 'https',
		host: '192.168.135.100',
		port: 8899,
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

var post_item_preview_data_first_time    = true;
var post_item_preview_data_current_index = -1;
var post_item_origin_data_first_time     = true;
var post_item_origin_data_current_index  = -1;
var post_item_write_to_table             = false;

const eos_per_trn_len     = 63;           // 一个utf8编码的汉字3个字节，63*3+64+2=255，刚好可以放进eos交易的memo中
const eth_per_trn_len     = 3336;         // 一个utf8编码的汉字3个字节，每个交易的备注长度为：3336*3+64+2+2=10076字节，需要使用的gas数量为：10076*68+21000=706168个
const arweave_per_trn_len = 100000;       // 一个utf8编码的汉字3个字节，100000汉字*3=300000字节，300000字节/1024=292.96875 KB
const btc_per_trn_len     = 1000;

const arweave_per_trn_len_post_item = 8388608; // 1024*1024*8=8388608=8MB

var current_page   = "home"; // 当前页面：home/my_articles/my_replies/users_i_follow/users_follow_me/articles_of_user_i_follow/articles_of_user_follow_me
var articles_array = [0];    // 数组，保存所有打开的文章的ID，因为从文章中可以打开别的文章，所以可能会有多个打开的文章，用于点击后退按钮功能时从一个文章后退到前一个文章，逐个进行后退

const storage_locations = ['WHO', 'EOS', 'ETH', 'BSC', 'HECO', 'BTC', 'Arweave'];

var items_per_page       = 20; // 每页显示数量
var album_items_per_page = 20; // 相册条目每页显示数量

var article_num_per_page = 7;  // 每页显示文章数量
var reply_num_per_page   = 8;  // 每页显示回复数量
var user_num_per_page    = 9;  // 每页显示用户数量
var item_num_per_page    = 10; // 每页显示相册条目数量

var   preview_of_article_map = null;
var   content_of_article_map = null;
var   content_of_reply_map   = null;
var   content_of_image_map   = null;
var   article_user_map       = null;
var   reply_user_map         = null;
var   user_avatar_map        = null;

var eth_worldwelfare_account = '0x3F4D7E42751Ca6461605241525006FA7086F0d92';
var eth_user_account         = '';
var eth_http_provider        = '';
var eth_chain_id             = 0;
var eth_network_id           = 0;
var eth_gasPrice             = '0x0';
var eth_gasLimit             = '0x0';

if (runmode === "prod") {    // 生产环境
	eth_http_provider = 'https://mainnet.infura.io/v3/8867675a02a94c3b85a00caad19bbe32';
	eth_chain_id      = 1;
	eth_network_id    = 1;
	eth_gasPrice      = '0x177825f000'; // 100.8 Gwei
	eth_gasLimit      = '0x107ac0';     // 1080000个gas
} else {                     // 开发测试环境
	eth_http_provider = 'https://kovan.infura.io/v3/8867675a02a94c3b85a00caad19bbe32';
	eth_chain_id      = 42;
	eth_network_id    = 42;
	eth_gasPrice      = '0x9502f900';   // 2.5 Gwei
	eth_gasLimit      = '0x107ac0';     // 1080000个gas
}

const eth_article_preview_length     = 100;      // 存放在ETH链上的文章在文章列表中显示的预览长度
const arweave_article_preview_length = 100;      // 存放在Arweave链上的文章在文章列表中显示的预览长度

var articles_sort_by    = "last_replied_time";    // 文章在文章列表中的排序方式： article_post_time/last_replied_time
var replies_sort_by     = "ascending_order";      // 回复在回复列表中的排序方式： ascending_order/descending_order
var album_items_sort_by = "asc";                  // 相册条目的排序方式：         asc/desc

var amount_per_trn_article_conf_eos = '';
var amount_per_trn_article_conf_eth = '';
var amount_per_trn_reply_conf_eos   = '';
var amount_per_trn_reply_conf_eth   = '';

if (runmode === "prod") {    // 生产环境
	amount_per_trn_article_conf_eos = '0.0001 EOS';
	amount_per_trn_article_conf_eth = '0.0005 ETH';
	amount_per_trn_reply_conf_eos   = '0.0001 EOS';
	amount_per_trn_reply_conf_eth   = '0.0005 ETH';
} else {                     // 开发测试环境
	amount_per_trn_article_conf_eos = '0.0001 SYS';
	amount_per_trn_article_conf_eth = '0.000000000000000001 ETH';
	amount_per_trn_reply_conf_eos   = '0.0001 SYS';
	amount_per_trn_reply_conf_eth   = '0.000000000000000001 ETH';
}

const storage_locations_supported_conf = 'ETH, Arweave';      //   'EOS, ETH, BSC, HECO, BTC, Arweave'
const storage_locations_supported_conf_post_item = 'Arweave'; //   'EOS, ETH, BSC, HECO, BTC, Arweave'

const arweave_initialisation_options = {
	host:     'arweave.net',  // Hostname or IP address for a Arweave host
	port:     443,            // Port
	protocol: 'https',        // Network protocol http or https
	timeout:  30000,          // Network request timeouts in milliseconds
	logging:  false           // Enable network request logging
}

const arweave_endpoint = arweave_initialisation_options.protocol + '://' + arweave_initialisation_options.host + ':' + arweave_initialisation_options.port + '/';
var   arweave          = null;

var album_item_type      = 1;          // 1：图片   2：视频   3：音频   5：其他
var album_item_loaded_ok = false;

var origin_data_of_item = '';
var origin_size_of_item = 0;

const album_item_data_preview_length = 100;

