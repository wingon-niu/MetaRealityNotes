#include "metarealnote.hpp"

//

// 用户注册
ACTION metarealnote::userregist(const name& user, const string& user_name, const string& user_family_name, const string& gender, const string& birthday, const string& avatar_pic_hash, const string& description)
{
    require_auth( user );

    eosio::check( user_name.length()        <=  100, "user_name is too long, max 100" );
    eosio::check( user_family_name.length() <=  100, "user_family_name is too long, max 100" );
    eosio::check( gender.length()           <=  100, "gender is too long, max 100" );
    eosio::check( birthday.length()         <=  100, "birthday is too long, max 100" );
    eosio::check( avatar_pic_hash.length()  <=  129, "avatar_pic_hash is too long, max 129" );
    eosio::check( description.length()      <= 1000, "description is too long, max 1000" );

    auto itr = _user_profiles.find(user.value);
    if( itr == _user_profiles.end() ) {
       itr = _user_profiles.emplace(_self, [&](auto& acnt){
          acnt.user             = user;
          acnt.user_name        = "";
          acnt.user_family_name = "";
          acnt.gender           = "";
          acnt.birthday         = "";
          acnt.avatar_pic_hash  = "";
          acnt.description      = "";
          acnt.reg_time         = 1;
       });
    }

    _user_profiles.modify( itr, _self, [&]( auto& acnt ) {
          acnt.user_name        = user_name;
          acnt.user_family_name = user_family_name;
          acnt.gender           = gender;
          acnt.birthday         = birthday;
          acnt.avatar_pic_hash  = avatar_pic_hash;
          acnt.description      = description;
          acnt.reg_time         = now();
    });
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
}

// 取消关注用户
ACTION metarealnote::canclefollow(const name& follow_user, const name& followed_user)
{
}

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
    for (auto& item : _replies_of_article) {
        keysForDeletion.push_back(item.reply_id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _replies_of_article.find(key);
        if (itr != _replies_of_article.end()) {
            _replies_of_article.erase(itr);
        }
    }

    keysForDeletion.clear();
    for (auto& item : _replies_of_reply) {
        keysForDeletion.push_back(item.reply_id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _replies_of_reply.find(key);
        if (itr != _replies_of_reply.end()) {
            _replies_of_reply.erase(itr);
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
}
