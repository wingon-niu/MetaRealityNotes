#include "pubwelfmedal.hpp"

//

// 发行、创建一个 NFT
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
        item.level            = 1;
        item.pic_hash         = PIC_HASH_LEVEL_1;
        item.motto_fixed      = motto_fixed;
        item.motto_modifiable = "";
        item.reserved_field   = "";
        item.owner            = ISSUER;
        item.time_of_receipt  = now();
    });
}

// NFT 转账
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

// NFT 累计贡献值
ACTION pubwelfmedal::donateaddup(const name& user, const asset& quantity)
{
    get_level(quantity.amount);
}

// 根据数值计算级别
uint8_t pubwelfmedal::get_level(const uint64_t amount) const
{
    return 1;
}

// 用户修改自己的 NFT 的可设置格言
ACTION pubwelfmedal::editmotto(const name& user, const uint64_t nft_id, const string& motto_modifiable)
{
}

// 清除 multi_index 中的所有数据，测试时使用，上线时去掉
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
