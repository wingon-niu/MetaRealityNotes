#include "pubwelfmedal.hpp"

//

// ���С�����һ�� NFT
ACTION pubwelfmedal::issue(const string& motto_fixed)
{
    require_auth( ISSUER );
    eosio::check( motto_fixed.size() <= 256, "motto_fixed has more than 256 bytes." );

    auto nft_count = _medalnfts.available_primary_key();
    eosio::check( nft_count <= MAX_SUPPLY, "supply exceeds max supply." );

    _medalnfts.emplace(_self, [&](auto& item){
        auto id = _medalnfts.available_primary_key();
        if (id == 0) {
            id = 1;
        }
        item.nft_id           = id;
        item.quantity         = ZERO_FEE;
        item.level            = 1;
        item.pic_hash         = PIC_HASH_LEVEL_1;
        item.motto_fixed      = motto_fixed;
        item.motto_modifiable = "";
        item.reserved_field   = "";
        item.owner            = ISSUER;
        item.time_of_receipt  = now();
    });
}

// NFT ת��
ACTION pubwelfmedal::transfer(const name& from, const name& to, uint64_t nft_id, const string& memo)
{
    require_auth( from );
    eosio::check( memo.size() <= 256, "memo has more than 256 bytes.");
    eosio::check( nft_id != 1, "number 1 nft can not be transfered to other user.");

    auto itr = _medalnfts.find( nft_id );
    eosio::check( itr != _medalnfts.end(), "nft_id does not exist." );
    eosio::check( itr->owner == from, "this nft is not belong to you." );

    _medalnfts.modify( itr, _self, [&]( auto& item ) {
        item.owner           = to;
        item.time_of_receipt = now();
    });
}

// NFT �ۼƹ���ֵ
ACTION pubwelfmedal::donateaddup(const name& user, const asset& quantity)
{
    require_auth( ISSUER );

    uint64_t nft_id = 1;                                        // Ĭ�Ͻ�����ֵ�ۼƵ� 1 �� NFT��

    auto index = _medalnfts.get_index<name("byownernft")>();
    auto itr = index.lower_bound(uint128_t{user.value}<<64);
    if ( itr != index.end() && itr->owner == user ) {           // ����û�ӵ�� NFT�����ҵ��û�ӵ�еĵ�һ�� NFT����������ֵ�ۼƸ���� NFT��
        nft_id = itr->nft_id;
    }

    auto itr_nft = _medalnfts.find( nft_id );
    if ( itr_nft != _medalnfts.end() ) {                        // �ҵ����ۼƣ�û�ҵ���ʲô������������Ҫ����
        _medalnfts.modify( itr_nft, _self, [&]( auto& item ) {
            const string s[11] = {"", PIC_HASH_LEVEL_1, PIC_HASH_LEVEL_2, PIC_HASH_LEVEL_3, PIC_HASH_LEVEL_4, PIC_HASH_LEVEL_5, PIC_HASH_LEVEL_6, PIC_HASH_LEVEL_7, PIC_HASH_LEVEL_8, PIC_HASH_LEVEL_9, PIC_HASH_LEVEL_10};
            item.quantity += quantity;
            auto i = get_level(item.quantity.amount);
            if ( i > item.level ) {
                item.level    = i;
                item.pic_hash = s[i];
            }
        });
    }
}

// ������ֵ���㼶��
uint8_t pubwelfmedal::get_level(const uint64_t amount) const
{
    uint8_t i = 1;

    if      (           0 <= amount && amount < 10 )         { i = 1;  }
    else if (          10 <= amount && amount < 100 )        { i = 2;  }
    else if (         100 <= amount && amount < 1000 )       { i = 3;  }
    else if (        1000 <= amount && amount < 10000 )      { i = 4;  }
    else if (       10000 <= amount && amount < 100000 )     { i = 5;  }
    else if (      100000 <= amount && amount < 1000000 )    { i = 6;  }
    else if (     1000000 <= amount && amount < 10000000 )   { i = 7;  }
    else if (    10000000 <= amount && amount < 100000000 )  { i = 8;  }
    else if (   100000000 <= amount && amount < 1000000000 ) { i = 9;  }
    else if (  1000000000 <= amount )                        { i = 10; }

    return i;
}

// �û��޸��Լ��� NFT �Ŀ����ø���
ACTION pubwelfmedal::editmotto(const name& user, const uint64_t nft_id, const string& motto_modifiable)
{
}

// ��� multi_index �е��������ݣ�����ʱʹ�ã�����ʱȥ��
ACTION pubwelfmedal::clearalldata()
{
    require_auth( _self );
    std::vector<uint64_t> keysForDeletion;
    print("\nclear all data.\n");

    keysForDeletion.clear();
    for (auto& item : _medalnfts) {
        keysForDeletion.push_back(item.nft_id);
    }
    for (uint64_t key : keysForDeletion) {
        auto itr = _medalnfts.find(key);
        if (itr != _medalnfts.end()) {
            _medalnfts.erase(itr);
        }
    }
}
