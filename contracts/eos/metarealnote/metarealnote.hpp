#include <eosio/eosio.hpp>
#include <eosio/time.hpp>
#include <eosio/system.hpp>
#include <eosio/asset.hpp>
#include <eosio/contract.hpp>
#include <eosio/dispatcher.hpp>
#include <eosio/print.hpp>
#include <utility>
#include <vector>
#include <string>

#define  MAIN_SYMBOL     symbol(symbol_code("SYS"), 4)
#define  ZERO_FEE        asset((int64_t)0, MAIN_SYMBOL)   // 0 EOS

using namespace eosio;
using std::string;

// MetaRealityNotes
// 超越现实笔记

CONTRACT metarealnote : public eosio::contract {

public:

    using contract::contract;

    metarealnote(name self, name first_receiver, datastream<const char*> ds) : contract(self, first_receiver, ds),
          _accounts              (get_self(), get_self().value),
          _user_profiles         (get_self(), get_self().value),
          _articles              (get_self(), get_self().value),
          _replies               (get_self(), get_self().value),
          _user_relationships    (get_self(), get_self().value),
          _albums                (get_self(), get_self().value),
          _pri_keys              (get_self(), get_self().value){};

    // 为用户新增转账信息
    ACTION addaccount(const name& user, const asset& quantity);

    // 用户注册
    ACTION userregist(const name& user, const string& user_name, const string& user_family_name, const string& gender, const string& birthday, const string& description);

    // 用户注销
    ACTION userunregist(const name& user);

    // 关注用户
    ACTION followuser(const name& follow_user, const name& followed_user);

    // 取消关注用户
    ACTION canclefollow(const name& follow_user, const name& followed_user);

    // 发表文章
    ACTION postarticle(const name& user, const string& article_hash, const uint64_t num_of_trns, const uint8_t category, const uint8_t type, const uint8_t storage_location, const uint64_t forward_article_id);

    // 删除文章
    ACTION rmarticle(const name& user, const uint64_t article_id);

    // 发表回复
    ACTION postreply(const name& user, const string& reply_hash, const uint32_t num_of_trns, const uint8_t storage_location, const uint64_t target_article_id, const uint64_t target_reply_id);

    // 删除回复
    ACTION rmreply(const name& user, const uint64_t reply_id);

    // 上传相册条目
    ACTION postalbumitm(const name& user, const uint8_t item_type, const uint8_t storage_location, const string& description, const string& preview_head_hash, const uint64_t preview_trn_num, const uint64_t preview_length, const string& origin_head_hash, const uint64_t origin_trn_num, const uint64_t origin_length);

    // 删除相册条目
    ACTION rmalbumitem(const name& user, const uint64_t item_id);

    // 修改相册条目的描述
    ACTION edititemdesc(const name& user, const uint64_t item_id, const string& description);

    // 设置用户头像
    ACTION setavatar(const name& user, const uint64_t avatar_album_item_id);

    // 清除 multi_index 中的所有数据，测试时使用，上线时去掉
    ACTION clearalldata();

private:

    // 返回当前时间戳
    uint32_t now() const {
        return current_time_point().sec_since_epoch();
    };

    // 文章的转发数加1
    void add_article_forwarded_times(const uint64_t & article_id);

    // 文章的转发数减1
    void sub_article_forwarded_times(const uint64_t & article_id);

    // 文章的回复数加1
    void add_article_replied_times(const uint64_t & article_id);

    // 文章的回复数减1
    void sub_article_replied_times(const uint64_t & article_id);

    // 回复的回复数加1
    void add_reply_replied_times(const uint64_t & reply_id);

    // 回复的回复数减1
    void sub_reply_replied_times(const uint64_t & reply_id);

    // 查询用户发表的文章总数
    uint64_t get_num_of_articles(const name& user);

    // 查询用户发表的回复总数
    uint32_t get_num_of_replies(const name& user);

    // 查询用户关注的用户总数
    uint32_t get_num_of_follow(const name& user);

    // 查询用户被关注的总数
    uint32_t get_num_of_followed(const name& user);

    // 查询用户相册中的条目总数
    uint32_t get_num_of_album_items(const name& user);

    // 用户的文章总数加1
    void add_num_of_articles(const name& user);

    // 用户的文章总数减1
    void sub_num_of_articles(const name& user);

    // 用户的回复总数加1
    void add_num_of_replies(const name& user);

    // 用户的回复总数减1
    void sub_num_of_replies(const name& user);

    // 用户的关注用户总数加1
    void add_num_of_follow(const name& user);

    // 用户的关注用户总数减1
    void sub_num_of_follow(const name& user);

    // 用户的被关注总数加1
    void add_num_of_followed(const name& user);

    // 用户的被关注总数减1
    void sub_num_of_followed(const name& user);

    // 用户相册中的条目的总数加1
    void add_num_of_album_items(const name& user);

    // 用户相册中的条目的总数减1
    void sub_num_of_album_items(const name& user);

    // 获取某个表的主键
    uint64_t get_pri_key(const name& table_name);

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // 用户转账信息
    TABLE st_account {
        name         user;
        asset        quantity;

        uint64_t primary_key() const { return user.value; }
    };
    typedef eosio::multi_index<"accounts"_n, st_account> tb_accounts;

    // 用户资料
    TABLE st_user_profile {
        name         user;
        string       user_name;
        string       user_family_name;
        string       gender;
        string       birthday;
        uint64_t     avatar_album_item_id;  // 头像。相册条目的id。  0表示没有设置头像。
        string       description;
        uint32_t     reg_time;
        uint64_t     num_of_articles;       // 用户发表的文章总数。
        uint32_t     num_of_replies;        // 用户发表的回复总数。
        uint32_t     num_of_follow;         // 用户关注的用户总数。
        uint32_t     num_of_followed;       // 用户被关注的总数。
        uint32_t     num_of_album_items;    // 用户相册中的条目总数。

        uint64_t primary_key()        const { return user.value; }
        uint64_t by_num_of_articles() const { return ~num_of_articles; }
    };
    typedef eosio::multi_index<
        "userprofiles"_n, st_user_profile,
        indexed_by< "bynumofarts"_n, const_mem_fun<st_user_profile, uint64_t, &st_user_profile::by_num_of_articles> >
    > tb_user_profiles;

    // 文章
    TABLE st_article {
        name         user;
        uint64_t     article_id;
        string       article_hash;        // 文章的内容的数据的首hash
        uint64_t     num_of_trns;         // 发送文章进行的转账交易次数
        uint8_t      category;            // 1=现实笔记；2=梦想笔记
        uint8_t      type;                // 1=微文；    2=长文      （区别在于长文可以有标题，微文没有标题。长文与微文都没有长度限制。）
        uint8_t      storage_location;    // 1=EOS；     2=ETH；     3=BSC；    5=BTC；                    （文章内容数据存储在哪条链上）
        uint64_t     forward_article_id;  // 转发的文章的id，0表示没有转发
        uint32_t     forwarded_times;     // 被转发的次数
        uint32_t     replied_times;       // 被回复的次数
        uint32_t     num_of_liked;        // 被点赞的次数
        uint32_t     post_time;

        uint64_t  primary_key()                const { return article_id; }
        uint128_t by_user_category_post_time() const {
            return (uint128_t{user.value}<<64) + (uint128_t{category}<<32) + uint128_t{~post_time};
        }
        uint128_t by_category_article()        const {
            return (uint128_t{category}<<64) + uint128_t{~article_id};
        }
        uint128_t by_forward_article()         const {
            return (uint128_t{forward_article_id}<<64) + uint128_t{~article_id};
        }
        uint128_t by_user_article()            const {
            return (uint128_t{user.value}<<64) + uint128_t{~article_id};
        }
    };
    typedef eosio::multi_index<
        "articles"_n, st_article,
        indexed_by< "byusrcatpost"_n, const_mem_fun<st_article, uint128_t, &st_article::by_user_category_post_time> >,
        indexed_by< "bycatarticle"_n, const_mem_fun<st_article, uint128_t, &st_article::by_category_article> >,
        indexed_by< "byforwardart"_n, const_mem_fun<st_article, uint128_t, &st_article::by_forward_article> >,
        indexed_by< "byusrarticle"_n, const_mem_fun<st_article, uint128_t, &st_article::by_user_article> >
    > tb_articles;

    // 回复
    TABLE st_reply {
        name         user;
        uint64_t     reply_id;
        string       reply_hash;          // 回复的内容的数据的首hash
        uint32_t     num_of_trns;         // 发送回复进行的转账交易次数
        uint8_t      storage_location;    // 1=EOS；     2=ETH；     3=BSC；    5=BTC；                    （回复内容数据存储在哪条链上）
        uint64_t     target_article_id;   // 目标文章的id。所有的回复都有一个目标文章。
        uint64_t     target_reply_id;     // 目标回复的id。回复属于一个目标文章，同时回复还可以指向一个回复，也就是对回复进行的回复。
        uint16_t     replied_times;       // 自己被回复的次数
        uint32_t     num_of_liked;        // 被点赞的次数
        uint32_t     post_time;

        uint64_t  primary_key()      const { return reply_id; }
        uint128_t by_article_reply() const {
            return (uint128_t{target_article_id}<<64) + uint128_t{~reply_id};
        }
        uint128_t by_reply_reply()   const {
            return (uint128_t{target_reply_id}<<64) + uint128_t{~reply_id};
        }
        uint128_t by_user_reply()    const {
            return (uint128_t{user.value}<<64) + uint128_t{~reply_id};
        }
    };
    typedef eosio::multi_index<
        "replies"_n, st_reply,
        indexed_by< "byarticlerep"_n, const_mem_fun<st_reply, uint128_t, &st_reply::by_article_reply> >,
        indexed_by< "byreplyreply"_n, const_mem_fun<st_reply, uint128_t, &st_reply::by_reply_reply> >,
        indexed_by< "byuserreply"_n,  const_mem_fun<st_reply, uint128_t, &st_reply::by_user_reply> >
    > tb_replies;

    // 用户关系
    TABLE st_user_relationship {
        uint64_t     id;
        name         follow_user;
        name         followed_user;
        uint32_t     follow_time;

        uint64_t  primary_key()           const { return id; }
        uint128_t by_follow_followed()    const {
            return (uint128_t{follow_user.value}<<64) + uint128_t{followed_user.value};
        }
        uint128_t by_followed_follow()    const {
            return (uint128_t{followed_user.value}<<64) + uint128_t{follow_user.value};
        }
    };
    typedef eosio::multi_index<
        "userelations"_n, st_user_relationship,
        indexed_by< "byfllwfllwed"_n, const_mem_fun<st_user_relationship, uint128_t, &st_user_relationship::by_follow_followed> >,
        indexed_by< "byfllwedfllw"_n, const_mem_fun<st_user_relationship, uint128_t, &st_user_relationship::by_followed_follow> >
    > tb_user_relationships;

    // 相册
    TABLE st_album {
        name         user;
        uint64_t     item_id;
        uint8_t      item_type;           // 1=图片；2=视频；
        uint8_t      storage_location;    // 1=EOS；     2=ETH；     3=BSC；    5=BTC；                    （条目的数据存储在哪条链上）
        string       description;
        uint32_t     num_of_liked;        // 被点赞的次数
        uint32_t     post_time;
        string       preview_head_hash;   // preview 代表图片的缩略图或者视频的首画面的缩略图。
        uint64_t     preview_trn_num;
        uint64_t     preview_length;
        string       origin_head_hash;    // origin  代表图片或者视频的原始文件。
        uint64_t     origin_trn_num;
        uint64_t     origin_length;

        uint64_t  primary_key()      const { return item_id; }
        uint128_t by_user_item()     const { return (uint128_t{user.value}<<64) + uint128_t{item_id}; }
        uint64_t  by_origin_length() const { return ~origin_length; }
    };
    typedef eosio::multi_index<
        "albums"_n, st_album,
        indexed_by< "byuseritem"_n,  const_mem_fun<st_album, uint128_t, &st_album::by_user_item> >,
        indexed_by< "byoriginlen"_n, const_mem_fun<st_album, uint64_t,  &st_album::by_origin_length> >
    > tb_albums;

    // 保存各个表的主键的表
    TABLE st_pri_keys {
        name      table_name;
        uint64_t  pri_key;

        uint64_t  primary_key()  const { return table_name.value; }
    };
    typedef eosio::multi_index<"prikeys"_n, st_pri_keys> tb_pri_keys;

    tb_accounts              _accounts;
    tb_user_profiles         _user_profiles;
    tb_articles              _articles;
    tb_replies               _replies;
    tb_user_relationships    _user_relationships;
    tb_albums                _albums;
    tb_pri_keys              _pri_keys;
};
