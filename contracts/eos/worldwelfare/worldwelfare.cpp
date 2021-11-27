#include "worldwelfare.hpp"

// 接收用户转账，并调用 metarealnote 合约，为用户新增转账信息
[[eosio::on_notify("eosio.token::transfer")]]
void worldwelfare::deposit(name from, name to, eosio::asset quantity, std::string memo)
{
    if (from == _self) {
        return;
    }
    if (to != _self) {
        return;
    }
    if (!quantity.symbol.is_valid()) {
        return;
    }
    if (!(quantity.symbol == MAIN_SYMBOL)) {
        return;
    }
    if (!quantity.is_valid()) {
        return;
    }
    if (!quantity.is_amount_within_range()) {
        return;
    }
    if (!(quantity.amount > 0)) {
        return;
    }

    action{
        permission_level{get_self(), "active"_n},
        "metarealnote"_n,
        "addaccount"_n,
        std::make_tuple(from, quantity)
    }.send();

    action{
        permission_level{get_self(), "active"_n},
        "pubwelfmedal"_n,
        "donateaddup"_n,
        std::make_tuple(from, quantity)
    }.send();
}

// 空 ACTION
ACTION worldwelfare::empty()
{
    require_auth( _self );
}
