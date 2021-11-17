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
          _user_profiles    (get_self(), get_self().value),
          _pub_albums       (get_self(), get_self().value),
          _albums           (get_self(), get_self().value),
          _pics             (get_self(), get_self().value){};

private:

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
    typedef eosio::multi_index<"user_profiles"_n, st_user_profile> tb_user_profiles;



    tb_user_profiles     _user_profiles;
    tb_pub_albums        _pub_albums;
    tb_albums            _albums;
    tb_pics              _pics;
};
