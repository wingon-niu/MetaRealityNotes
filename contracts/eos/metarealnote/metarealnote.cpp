#include "metarealnote.hpp"

//

// 为用户新增转账信息
ACTION metarealnote::addaccount(const name& user, const asset& quantity)
{
    require_auth( "worldwelfare"_n );

    auto itr = _accounts.find(user.value);
    if( itr == _accounts.end() ) {
       itr = _accounts.emplace(_self, [&](auto& acnt){
          acnt.user     = user;
          acnt.quantity = ZERO_FEE;
       });
    }

    _accounts.modify( itr, _self, [&]( auto& acnt ) {
       acnt.quantity += quantity;
    });
}

// 用户注册
ACTION metarealnote::userregist(const name& user, const string& user_name, const string& user_family_name, const string& gender, const string& birthday, const string& description)
{
    require_auth( user );

    eosio::check( user_name.length()        <=   90, "user_name is too long, max 30" );           // 一个汉字3个字节，utf8编码
    eosio::check( user_family_name.length() <=   90, "user_family_name is too long, max 30" );    // 一个汉字3个字节，utf8编码
    eosio::check( gender.length()           <=   90, "gender is too long, max 30" );              // 一个汉字3个字节，utf8编码
    eosio::check( birthday.length()         <=   90, "birthday is too long, max 30" );            // 一个汉字3个字节，utf8编码
    eosio::check( description.length()      <=  900, "description is too long, max 300" );        // 一个汉字3个字节，utf8编码

    auto itr = _user_profiles.find(user.value);
    if( itr == _user_profiles.end() ) {
       itr = _user_profiles.emplace(_self, [&](auto& acnt){
          acnt.user                 = user;
          acnt.user_name            = user_name;
          acnt.user_family_name     = user_family_name;
          acnt.gender               = gender;
          acnt.birthday             = birthday;
          acnt.avatar_album_item_id = 0;
          acnt.description          = description;
          acnt.reg_time             = now();
          acnt.num_of_articles      = get_num_of_articles(user);
          acnt.num_of_replies       = get_num_of_replies(user);
          acnt.num_of_follow        = get_num_of_follow(user);
          acnt.num_of_followed      = get_num_of_followed(user);
          acnt.num_of_album_items   = get_num_of_album_items(user);
       });
    } else {
       _user_profiles.modify( itr, _self, [&]( auto& acnt ) {
          acnt.user_name            = user_name;
          acnt.user_family_name     = user_family_name;
          acnt.gender               = gender;
          acnt.birthday             = birthday;
          acnt.description          = description;
       });
    }
}

// 用户注销
ACTION metarealnote::userunregist(const name& user)
{
    require_auth( user );

    auto itr = _user_profiles.find(user.value);
    eosio::check(itr != _user_profiles.end(), "user does not exist.");
    _user_profiles.erase(itr);
}

// 关注用户
ACTION metarealnote::followuser(const name& follow_user, const name& followed_user)
{
    require_auth( follow_user );

    auto index = _user_relationships.get_index<name("byfllwfllwed")>();
    auto itr = index.lower_bound((uint128_t{follow_user.value}<<64) + uint128_t{followed_user.value});
    eosio::check( ! (itr != index.end() && itr->follow_user == follow_user && itr->followed_user == followed_user), "already followed.");

    _user_relationships.emplace(_self, [&](auto& item){
        auto id = _user_relationships.available_primary_key();
        if (id == 0) {
            id = 1;
        }
        item.id            = id;
        item.follow_user   = follow_user;
        item.followed_user = followed_user;
        item.follow_time   = now();
    });

    add_num_of_follow(follow_user);
    add_num_of_followed(followed_user);
}

// 取消关注用户
ACTION metarealnote::canclefollow(const name& follow_user, const name& followed_user)
{
    require_auth( follow_user );

    auto index = _user_relationships.get_index<name("byfllwfllwed")>();
    auto itr = index.lower_bound((uint128_t{follow_user.value}<<64) + uint128_t{followed_user.value});
    eosio::check( itr != index.end() && itr->follow_user == follow_user && itr->followed_user == followed_user, "user not been followed.");

    auto itr_pri = _user_relationships.find( itr->id );
    eosio::check( itr_pri != _user_relationships.end(), "user not been followed or unknown error.");
    _user_relationships.erase(itr_pri);

    sub_num_of_follow(follow_user);
    sub_num_of_followed(followed_user);
}

// 发表文章
ACTION metarealnote::postarticle(const name& user, const string& article_hash, const uint64_t num_of_trns, const uint8_t category, const uint8_t type, const uint8_t storage_location, const uint64_t forward_article_id)
{
    require_auth( user );
    eosio::check( article_hash.length()  <=  129, "article_hash is too long, max 129" );

    auto itr_account = _accounts.find( user.value );

    if (storage_location == 1) { // 文章的内容数据存储在 EOS 链上
        eosio::check(itr_account != _accounts.end() && itr_account->quantity.amount > 0, "you must transfer tokens to worldwelfare first.");
    }

    _articles.emplace(_self, [&](auto& item){
        auto id = _articles.available_primary_key();
        if (id == 0) {
            id = 1;
        }
        item.user               = user;
        item.article_id         = id;
        item.article_hash       = article_hash;
        item.num_of_trns        = num_of_trns;
        item.category           = category;
        item.type               = type;
        item.storage_location   = storage_location;
        item.forward_article_id = forward_article_id;
        item.forwarded_times    = 0;
        item.replied_times      = 0;
        item.post_time          = now();
    });

    if (forward_article_id > 0) {
        add_article_forwarded_times(forward_article_id);
    }

    if (storage_location == 1) { // 文章的内容数据存储在 EOS 链上
        _accounts.erase(itr_account);
    }

    add_num_of_articles(user);
}

// 删除文章
ACTION metarealnote::rmarticle(const name& user, const uint64_t article_id)
{
    require_auth( user );

    auto itr = _articles.find( article_id );
    eosio::check(itr != _articles.end(), "article does not exist.");
    eosio::check(itr->user == user, "this article is not belong to you.");

    auto forward_article_id = itr->forward_article_id;
    _articles.erase(itr);

    if (forward_article_id > 0) {
        sub_article_forwarded_times(forward_article_id);
    }

    sub_num_of_articles(user);
}

// 发表回复
ACTION metarealnote::postreply(const name& user, const string& reply_hash, const uint32_t num_of_trns, const uint8_t storage_location, const uint64_t target_article_id, const uint64_t target_reply_id)
{
    require_auth( user );
    eosio::check( reply_hash.length()  <=  129, "reply_hash is too long, max 129" );
    eosio::check( target_article_id    >     0, "you must reply to an article.");

    auto itr_account = _accounts.find( user.value );

    if (storage_location == 1) { // 回复的内容数据存储在 EOS 链上
        eosio::check(itr_account != _accounts.end() && itr_account->quantity.amount > 0, "you must transfer tokens to worldwelfare first.");
    }

    _replies.emplace(_self, [&](auto& item){
        auto id = _replies.available_primary_key();
        if (id == 0) {
            id = 1;
        }
        item.user              = user;
        item.reply_id          = id;
        item.reply_hash        = reply_hash;
        item.num_of_trns       = num_of_trns;
        item.storage_location  = storage_location;
        item.target_article_id = target_article_id;
        item.target_reply_id   = target_reply_id;
        item.replied_times     = 0;
        item.post_time         = now();
    });

    if (target_article_id > 0) {
        add_article_replied_times(target_article_id);
    }

    if (target_reply_id > 0) {
        add_reply_replied_times(target_reply_id);
    }

    if (storage_location == 1) { // 回复的内容数据存储在 EOS 链上
        _accounts.erase(itr_account);
    }

    add_num_of_replies(user);
}

// 删除回复
ACTION metarealnote::rmreply(const name& user, const uint64_t reply_id)
{
    require_auth( user );

    auto itr = _replies.find( reply_id );
    eosio::check(itr != _replies.end(), "reply does not exist.");
    eosio::check(itr->user == user, "this reply is not belong to you.");

    auto target_article_id = itr->target_article_id;
    auto target_reply_id   = itr->target_reply_id;
    _replies.erase(itr);

    if (target_article_id > 0) {
        sub_article_replied_times(target_article_id);
    }

    if (target_reply_id > 0) {
        sub_reply_replied_times(target_reply_id);
    }

    sub_num_of_replies(user);
}

// 上传相册条目
ACTION metarealnote::postalbumitm(const name& user, const uint8_t item_type, const uint8_t storage_location, const string& description, const string& preview_head_hash, const uint64_t preview_trn_num, const uint64_t preview_length, const string& origin_head_hash, const uint64_t origin_trn_num, const uint64_t origin_length)
{
    require_auth( user );
    eosio::check( preview_head_hash.length() <= 129, "preview_head_hash is too long, max 129" );
    eosio::check( origin_head_hash.length()  <= 129, "origin_head_hash is too long, max 129" );
    eosio::check( description.length()       <=  90, "description is too long, max 30" );         // 一个汉字3个字节，utf8编码

    auto itr_account = _accounts.find( user.value );

    if (storage_location == 1) { // 数据存储在 EOS 链上
        eosio::check(itr_account != _accounts.end() && itr_account->quantity.amount > 0, "you must transfer tokens to worldwelfare first.");
    }

    _albums.emplace(_self, [&](auto& item){
        auto id = _albums.available_primary_key();
        if (id == 0) {
            id = 1;
        }
        item.user              = user;
        item.item_id           = id;
        item.item_type         = item_type;
        item.storage_location  = storage_location;
        item.description       = description;
        item.post_time         = now();
        item.preview_head_hash = preview_head_hash;
        item.preview_trn_num   = preview_trn_num;
        item.preview_length    = preview_length;
        item.origin_head_hash  = origin_head_hash;
        item.origin_trn_num    = origin_trn_num;
        item.origin_length     = origin_length;
    });

    if (storage_location == 1) { // 数据存储在 EOS 链上
        _accounts.erase(itr_account);
    }

    add_num_of_album_items(user);
}

// 删除相册条目
ACTION metarealnote::rmalbumitem(const name& user, const uint64_t item_id)
{
    require_auth( user );

    auto itr = _albums.find( item_id );
    eosio::check(itr != _albums.end(), "item does not exist.");
    eosio::check(itr->user == user, "this item is not belong to you.");
    _albums.erase(itr);

    sub_num_of_album_items(user);
}

// 修改相册条目的描述
ACTION metarealnote::edititemdesc(const name& user, const uint64_t item_id, const string& description)
{
    require_auth( user );
    eosio::check( description.length()       <=  90, "description is too long, max 30" );         // 一个汉字3个字节，utf8编码

    auto itr = _albums.find( item_id );
    eosio::check(itr != _albums.end(), "item does not exist.");
    eosio::check(itr->user == user, "this item is not belong to you.");

    _albums.modify( itr, _self, [&]( auto& item ) {
        item.description = description;
    });
}

// 设置用户头像
ACTION metarealnote::setavatar(const name& user, const uint64_t avatar_album_item_id)
{
    require_auth( user );

    auto itr = _albums.find( avatar_album_item_id );
    eosio::check(itr != _albums.end(), "album item does not exist.");
    eosio::check(itr->user == user, "this album item is not belong to you.");

    auto itr_user = _user_profiles.find( user.value );
    eosio::check(itr_user != _user_profiles.end(), "user does not exist.");
    _user_profiles.modify( itr_user, _self, [&]( auto& item ) {
        item.avatar_album_item_id = avatar_album_item_id;
    });
}

// 文章的转发数加1
void metarealnote::add_article_forwarded_times(const uint64_t & article_id)
{
    auto itr = _articles.find(article_id);
    if (itr != _articles.end()) {
        _articles.modify( itr, _self, [&]( auto& item ) {
            item.forwarded_times += 1;
        });
    }
}

// 文章的转发数减1
void metarealnote::sub_article_forwarded_times(const uint64_t & article_id)
{
    auto itr = _articles.find(article_id);
    if (itr != _articles.end()) {
        _articles.modify( itr, _self, [&]( auto& item ) {
            item.forwarded_times -= 1;
        });
    }
}

// 文章的回复数加1
void metarealnote::add_article_replied_times(const uint64_t & article_id)
{
    auto itr = _articles.find(article_id);
    if (itr != _articles.end()) {
        _articles.modify( itr, _self, [&]( auto& item ) {
            item.replied_times += 1;
        });
    }
}

// 文章的回复数减1
void metarealnote::sub_article_replied_times(const uint64_t & article_id)
{
    auto itr = _articles.find(article_id);
    if (itr != _articles.end()) {
        _articles.modify( itr, _self, [&]( auto& item ) {
            item.replied_times -= 1;
        });
    }
}

// 回复的回复数加1
void metarealnote::add_reply_replied_times(const uint64_t & reply_id)
{
    auto itr = _replies.find(reply_id);
    if (itr != _replies.end()) {
        _replies.modify( itr, _self, [&]( auto& item ) {
            item.replied_times += 1;
        });
    }
}

// 回复的回复数减1
void metarealnote::sub_reply_replied_times(const uint64_t & reply_id)
{
    auto itr = _replies.find(reply_id);
    if (itr != _replies.end()) {
        _replies.modify( itr, _self, [&]( auto& item ) {
            item.replied_times -= 1;
        });
    }
}

// 查询用户发表的文章总数
uint64_t metarealnote::get_num_of_articles(const name& user)
{
    auto index = _articles.get_index<name("byusrarticle")>();
    auto itr = index.lower_bound(uint128_t{user.value}<<64);
    if (itr == index.end()) {
        return 0;
    }
    uint64_t num = 0;
    while(itr != index.end() && itr->user == user) {
        num++;
        itr++;
    }
    return num;
}

// 查询用户发表的回复总数
uint32_t metarealnote::get_num_of_replies(const name& user)
{
    auto index = _replies.get_index<name("byuserreply")>();
    auto itr = index.lower_bound(uint128_t{user.value}<<64);
    if (itr == index.end()) {
        return 0;
    }
    uint32_t num = 0;
    while(itr != index.end() && itr->user == user) {
        num++;
        itr++;
    }
    return num;
}

// 查询用户关注的用户总数
uint32_t metarealnote::get_num_of_follow(const name& user)
{
    auto index = _user_relationships.get_index<name("byfllwfllwed")>();
    auto itr = index.lower_bound(uint128_t{user.value}<<64);
    if (itr == index.end()) {
        return 0;
    }
    uint32_t num = 0;
    while(itr != index.end() && itr->follow_user == user) {
        num++;
        itr++;
    }
    return num;
}

// 查询用户被关注的总数
uint32_t metarealnote::get_num_of_followed(const name& user)
{
    auto index = _user_relationships.get_index<name("byfllwedfllw")>();
    auto itr = index.lower_bound(uint128_t{user.value}<<64);
    if (itr == index.end()) {
        return 0;
    }
    uint32_t num = 0;
    while(itr != index.end() && itr->followed_user == user) {
        num++;
        itr++;
    }
    return num;
}

// 查询用户相册中的条目总数
uint32_t metarealnote::get_num_of_album_items(const name& user)
{
    auto index = _albums.get_index<name("byuseritem")>();
    auto itr = index.lower_bound(uint128_t{user.value}<<64);
    if (itr == index.end()) {
        return 0;
    }
    uint32_t num = 0;
    while(itr != index.end() && itr->user == user) {
        num++;
        itr++;
    }
    return num;
}

// 用户的文章总数加1
void metarealnote::add_num_of_articles(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_articles += 1;
        });
    }
}

// 用户的文章总数减1
void metarealnote::sub_num_of_articles(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_articles -= 1;
        });
    }
}

// 用户的回复总数加1
void metarealnote::add_num_of_replies(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_replies += 1;
        });
    }
}

// 用户的回复总数减1
void metarealnote::sub_num_of_replies(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_replies -= 1;
        });
    }
}

// 用户的关注用户总数加1
void metarealnote::add_num_of_follow(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_follow += 1;
        });
    }
}

// 用户的关注用户总数减1
void metarealnote::sub_num_of_follow(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_follow -= 1;
        });
    }
}

// 用户的被关注总数加1
void metarealnote::add_num_of_followed(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_followed += 1;
        });
    }
}

// 用户的被关注总数减1
void metarealnote::sub_num_of_followed(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_followed -= 1;
        });
    }
}

// 用户相册中的条目的总数加1
void metarealnote::add_num_of_album_items(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_album_items += 1;
        });
    }
}

// 用户相册中的条目的总数减1
void metarealnote::sub_num_of_album_items(const name& user)
{
    auto itr = _user_profiles.find(user.value);
    if (itr != _user_profiles.end()) {
        _user_profiles.modify( itr, _self, [&]( auto& item ) {
            item.num_of_album_items -= 1;
        });
    }
}

// 清除 multi_index 中的所有数据，测试时使用，上线时去掉
ACTION metarealnote::clearalldata()
{
    require_auth( _self );
    std::vector<uint64_t> keysForDeletion;
    print("\nclear all data.\n");

    keysForDeletion.clear();
    for (auto& item : _accounts) {
        keysForDeletion.push_back(item.user.value);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _accounts.find(key);
        if (itr != _accounts.end()) {
            _accounts.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _user_profiles) {
        keysForDeletion.push_back(item.user.value);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _user_profiles.find(key);
        if (itr != _user_profiles.end()) {
            _user_profiles.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _articles) {
        keysForDeletion.push_back(item.article_id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _articles.find(key);
        if (itr != _articles.end()) {
            _articles.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _replies) {
        keysForDeletion.push_back(item.reply_id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _replies.find(key);
        if (itr != _replies.end()) {
            _replies.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _user_relationships) {
        keysForDeletion.push_back(item.id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _user_relationships.find(key);
        if (itr != _user_relationships.end()) {
            _user_relationships.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _albums) {
        keysForDeletion.push_back(item.item_id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _albums.find(key);
        if (itr != _albums.end()) {
            _albums.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _pri_keys) {
        keysForDeletion.push_back(item.table_name.value);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _pri_keys.find(key);
        if (itr != _pri_keys.end()) {
            _pri_keys.erase(itr);
        }
    }
}
