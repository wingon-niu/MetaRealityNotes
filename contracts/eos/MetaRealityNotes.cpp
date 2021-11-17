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

using namespace eosio;
using std::string;

// MetaRealityNotes
// 超越现实笔记

CONTRACT MetaRealityNotes : public eosio::contract {

public:

    using contract::contract;

    MetaRealityNotes(name self, name first_receiver, datastream<const char*> ds) : contract(self, first_receiver, ds),
          _user_profiles         (get_self(), get_self().value),
          _articles              (get_self(), get_self().value),
          _replies_of_article    (get_self(), get_self().value),
          _replies_of_reply      (get_self(), get_self().value),
          _user_relationships    (get_self(), get_self().value){};

private:

    // 用户资料
    TABLE st_user_profile {
        name         user;
        string       user_name;
        string       user_family_name;
        string       gender;
        uint32_t     birthday;
        string       avatar_pic;
        string       description;
        uint32_t     reg_time;

        uint64_t primary_key() const { return user.value; }
    };
    typedef eosio::multi_index<"userprofiles"_n, st_user_profile> tb_user_profiles;

    // 文章
    TABLE st_article {
        name         user;
        uint64_t     article_id;
        string       article_hash;
        uint64_t     forward_article_id;  // 转发的文章的id，0表示没有转发
        uint32_t     post_time;

        uint64_t  primary_key()       const { return article_id; }
        uint128_t by_user_post_time() const {
            uint64_t  aaa = uint64_t{post_time};
            uint64_t  bbb = ~aaa;
            uint128_t ccc = uint128_t{bbb};
            return uint128_t{user.value}<<64 + ccc;
        }
        uint128_t by_forward_article()    const {
            return uint128_t{forward_article_id}<<64 + uint128_t{article_id};
        }
    };
    typedef eosio::multi_index<
        "articles1234"_n, st_article,
        indexed_by< "byusrpostime"_n, const_mem_fun<st_article, uint128_t, &st_article::by_user_post_time>,
        indexed_by< "byforwardart"_n, const_mem_fun<st_article, uint128_t, &st_article::by_forward_article> >
    > tb_articles;

    // 文章的回复
    TABLE st_reply_of_article {
        name         user;
        uint64_t     reply_id;
        string       reply_hash;
        uint64_t     target_article_id;
        uint32_t     post_time;

        uint64_t  primary_key()          const { return reply_id; }
        uint128_t by_article_post_time() const {
            return uint128_t{target_article_id}<<64 + uint128_t{~post_time};
        }
    };
    typedef eosio::multi_index<
        "repofarticle"_n, st_reply_of_article,
        indexed_by< "byartpostime"_n, const_mem_fun<st_reply_of_article, uint128_t, &st_reply_of_article::by_article_post_time> >
    > tb_replies_of_article;

    // 回复的回复
    TABLE st_reply_of_reply {
        name         user;
        uint64_t     reply_id;
        string       reply_hash;
        uint64_t     target_reply_id;
        uint32_t     post_time;

        uint64_t  primary_key()          const { return reply_id; }
        uint128_t by_reply_post_time()   const {
            return uint128_t{target_reply_id}<<64 + uint128_t{~post_time};
        }
    };
    typedef eosio::multi_index<
        "repesofreply"_n, st_reply_of_reply,
        indexed_by< "byreppostime"_n, const_mem_fun<st_reply_of_reply, uint128_t, &st_reply_of_reply::by_reply_post_time> >
    > tb_replies_of_reply;

    // 用户关系
    TABLE st_user_relationship {
        uint64_t     id;
        name         follow_user;
        name         followed_user;
        uint32_t     follow_time;

        uint64_t  primary_key()           const { return id; }
        uint128_t by_follow_followed()    const {
            return uint128_t{follow_user.value}<<64 + uint128_t{followed_user.value};
        }
        uint128_t by_followed_follow()    const {
            return uint128_t{followed_user.value}<<64 + uint128_t{follow_user.value};
        }
    };
    typedef eosio::multi_index<
        "userelations"_n, st_user_relationship,
        indexed_by< "byfllwfllwed"_n, const_mem_fun<st_user_relationship, uint128_t, &st_user_relationship::by_follow_followed> >,
        indexed_by< "byfllwedfllw"_n, const_mem_fun<st_user_relationship, uint128_t, &st_user_relationship::by_followed_follow> >
    > tb_user_relationships;

    tb_user_profiles         _user_profiles;
    tb_articles              _articles;
    tb_replies_of_article    _replies_of_article;
    tb_replies_of_reply      _replies_of_reply;
    tb_user_relationships    _user_relationships;
};

// 
