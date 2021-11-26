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

#define  MAX_SUPPLY      3
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
// ����ѫ��

CONTRACT pubwelfmedal : public eosio::contract {

public:

    using contract::contract;

    pubwelfmedal(name self, name first_receiver, datastream<const char*> ds) : contract(self, first_receiver, ds),
          _medalnfts              (get_self(), get_self().value){};

    // ���С�����һ�� NFT
    ACTION issue(const string& motto_fixed);

    // NFT ת��
    ACTION transfer(const name& from, const name& to, uint64_t nft_id, const string& memo);

    // NFT �ۼƹ���ֵ
    ACTION donateaddup(const name& user, const asset& quantity);

    // �û��޸��Լ��� NFT �Ŀ����ø���
    ACTION editmotto(const name& user, const uint64_t nft_id, const string& motto_modifiable);

    // ��� multi_index �е��������ݣ�����ʱʹ�ã�����ʱȥ��
    ACTION clearalldata();

private:

    // ����ѫ�� NFT
    TABLE st_medalnft {
        uint64_t     nft_id;
        asset        quantity;
        uint8_t      level;
        string       pic_hash;
        string       motto_fixed;         // ���ԣ�����ʱ���ã��Ժ�̶������޸�
        string       motto_modifiable;    // ���ԣ��û������Լ�����
        string       reserved_field;      // Ԥ���ֶ�
        name         owner;               // ӵ����
        uint32_t     time_of_receipt;     // �յ� NFT ��ʱ��

        uint64_t  primary_key()  const { return nft_id; }
        uint128_t by_owner_nft() const {
            return (uint128_t{owner.value}<<64) + uint128_t{nft_id};
        }
    };
    typedef eosio::multi_index<
        "medalnfts"_n, st_medalnft,
        indexed_by< "byownernft"_n, const_mem_fun<st_medalnft, uint128_t, &st_medalnft::by_owner_nft> >
    > tb_medalnfts;

    tb_medalnfts              _medalnfts;

    // ���ص�ǰʱ���
    uint32_t now() const {
        return current_time_point().sec_since_epoch();
    };

    // ������ֵ���㼶��
    uint8_t get_level(const uint64_t amount) const;
};
