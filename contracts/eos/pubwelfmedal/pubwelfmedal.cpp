#include "pubwelfmedal.hpp"

//

// ���С�����һ�� NFT
ACTION pubwelfmedal::issue(const string& motto_fixed)
{
}

// NFT ת��
ACTION pubwelfmedal::transfer(const name& from, const name& to, uint64_t nft_id, const string& memo)
{
}

// NFT �ۼƹ���ֵ
ACTION pubwelfmedal::donateaddup(const name& user, const asset& quantity)
{
    get_level(quantity.amount);
}

// ������ֵ���㼶��
uint8_t pubwelfmedal::get_level(const uint64_t amount) const
{
    return 1;
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
