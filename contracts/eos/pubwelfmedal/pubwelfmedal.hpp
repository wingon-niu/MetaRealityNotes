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

#define  DREAM_REAL_NOTES_VERSION_DEV              // DREAM_REAL_NOTES_VERSION_DEV             or DREAM_REAL_NOTES_VERSION_PROD
#define  DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_YES  // DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_YES or DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_NO

#ifdef   DREAM_REAL_NOTES_VERSION_DEV
#define  MAIN_SYMBOL     symbol(symbol_code("SYS"), 4)
#else
#define  MAIN_SYMBOL     symbol(symbol_code("EOS"), 4)
#endif

#define  ZERO_FEE        asset((int64_t)0, MAIN_SYMBOL)   // 0 EOS

#define  MAX_SUPPLY      210000
#define  ISSUER          name("worldwelfare")

#define  PIC_HASH_LEVEL_1   "pic_hash_level_1"
#define  PIC_HASH_LEVEL_2   "pic_hash_level_2"
#define  PIC_HASH_LEVEL_3   "pic_hash_level_3"
#define  PIC_HASH_LEVEL_4   "pic_hash_level_4"
#define  PIC_HASH_LEVEL_5   "pic_hash_level_5"
#define  PIC_HASH_LEVEL_6   "pic_hash_level_6"
#define  PIC_HASH_LEVEL_7   "pic_hash_level_7"
#define  PIC_HASH_LEVEL_8   "pic_hash_level_8"
#define  PIC_HASH_LEVEL_9   "pic_hash_level_9"
#define  PIC_HASH_LEVEL_10  "pic_hash_level_10"

using namespace eosio;
using std::string;

// pubwelfmedal
// 公益勋章

CONTRACT pubwelfmedal : public eosio::contract {

public:

    using contract::contract;

    pubwelfmedal(name self, name first_receiver, datastream<const char*> ds) : contract(self, first_receiver, ds),
          _medalnfts              (get_self(), get_self().value){};

    // 发行、创建一个 NFT
    ACTION issue(const string& motto_fixed);

    // NFT 转账
    ACTION transfer(const name& from, const name& to, uint64_t nft_id, const string& memo);

    // NFT 累计贡献值
    ACTION donateaddup(const name& user, const asset& quantity);

    // 用户修改自己的 NFT 的可设置格言
    ACTION editmotto(const name& user, const uint64_t nft_id, const string& motto_modifiable);

#ifdef DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_YES
    // 清除 multi_index 中的所有数据，测试时使用，上线时去掉
    ACTION clearalldata();
#endif

private:

    // 公益勋章 NFT
    TABLE st_medalnft {
        uint64_t     nft_id;
        asset        quantity;
        uint8_t      level;
        string       pic_hash;
        string       motto_fixed;         // 格言，创建时设置，以后固定不可修改
        string       motto_modifiable;    // 格言，用户可以自己设置
        string       reserved_field;      // 预留字段
        name         owner;               // 拥有者
        uint32_t     time_of_receipt;     // 收到 NFT 的时间

        uint64_t  primary_key()  const { return nft_id; }
        uint128_t by_owner_nft() const {
            return (uint128_t{owner.value}<<64) + uint128_t{nft_id};
        }
        uint64_t  by_quantity()  const {
            uint64_t amount = quantity.amount;
            return ~amount;
        }
    };
    typedef eosio::multi_index<
        "medalnfts"_n, st_medalnft,
        indexed_by< "byownernft"_n, const_mem_fun<st_medalnft, uint128_t, &st_medalnft::by_owner_nft> >,
        indexed_by< "byquantity"_n, const_mem_fun<st_medalnft, uint64_t,  &st_medalnft::by_quantity> >
    > tb_medalnfts;

    tb_medalnfts              _medalnfts;

    // 返回当前时间戳
    uint32_t now() const {
        return current_time_point().sec_since_epoch();
    };

    // 根据数值计算级别
    uint8_t get_level(const uint64_t amount) const;
};
