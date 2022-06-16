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

#define  DREAM_REAL_NOTES_VERSION_PROD              // DREAM_REAL_NOTES_VERSION_DEV             or DREAM_REAL_NOTES_VERSION_PROD
#define  DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_NO    // DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_YES or DREAM_REAL_NOTES_WITH_CLEAR_FUNCTION_NO

#ifdef   DREAM_REAL_NOTES_VERSION_DEV
#define  MAIN_SYMBOL     symbol(symbol_code("SYS"), 4)
#else
#define  MAIN_SYMBOL     symbol(symbol_code("EOS"), 4)
#endif

#define  ZERO_FEE        asset((int64_t)0, MAIN_SYMBOL)   // 0 EOS

using namespace eosio;
using std::string;

// worldwelfare
// 公益基金

CONTRACT worldwelfare : public eosio::contract {

public:

    using contract::contract;

    worldwelfare(name self, name first_receiver, datastream<const char*> ds) : contract(self, first_receiver, ds){};

    // 接收用户转账，并调用 metarealnote 合约，为用户新增转账信息
    [[eosio::on_notify("eosio.token::transfer")]]
    void deposit(name from, name to, eosio::asset quantity, std::string memo);

    // 空 ACTION
    ACTION empty();
};
