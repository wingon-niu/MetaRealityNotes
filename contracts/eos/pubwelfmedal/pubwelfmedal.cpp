#include "pubwelfmedal.hpp"

//

// 发行、创建一个 NFT
ACTION pubwelfmedal::issue(const string& motto_fixed)
{
}

// NFT 转账
ACTION pubwelfmedal::transfer(const name& from, const name& to, uint64_t nft_id, const string& memo)
{
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
