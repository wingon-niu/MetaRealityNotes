#include "metarealnote.hpp"



// TODO

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
