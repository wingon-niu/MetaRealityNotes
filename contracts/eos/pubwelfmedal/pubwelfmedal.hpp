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

using namespace eosio;
using std::string;

// MetaRealityNotes
// ��Խ��ʵ�ʼ�

CONTRACT metarealnote : public eosio::contract {

public:

    using contract::contract;

    metarealnote(name self, name first_receiver, datastream<const char*> ds) : contract(self, first_receiver, ds),
          _accounts              (get_self(), get_self().value),
          _user_profiles         (get_self(), get_self().value),
          _articles              (get_self(), get_self().value),
          _replies               (get_self(), get_self().value),
          _user_relationships    (get_self(), get_self().value){};

    // Ϊ�û�����ת����Ϣ
    ACTION addaccount(const name& user, const asset& quantity);

    // �û�ע��
    ACTION userregist(const name& user, const string& user_name, const string& user_family_name, const string& gender, const string& birthday, const string& avatar_pic_hash, const string& description);

    // �û�ע��
    ACTION userunregist(const name& user);

    // ��ע�û�
    ACTION followuser(const name& follow_user, const name& followed_user);

    // ȡ����ע�û�
    ACTION canclefollow(const name& follow_user, const name& followed_user);

    // ��������
    ACTION postarticle(const name& user, const string& article_hash, const uint8_t category, const uint8_t type, const uint8_t storage_location, const uint64_t forward_article_id);

    // ɾ������
    ACTION rmarticle(const name& user, const uint64_t article_id);

    // ����ظ�
    ACTION postreply(const name& user, const string& reply_hash, const uint8_t storage_location, const uint64_t target_article_id, const uint64_t target_reply_id);

    // ɾ���ظ�
    ACTION rmreply(const name& user, const uint64_t reply_id);

    // ��� multi_index �е��������ݣ�����ʱʹ�ã�����ʱȥ��
    ACTION clearalldata();

private:

    // ���ص�ǰʱ���
    uint32_t now() const {
        return current_time_point().sec_since_epoch();
    };

    // ���µ�ת������1
    void add_article_forwarded_times(const uint64_t & article_id);

    // ���µ�ת������1
    void sub_article_forwarded_times(const uint64_t & article_id);

    // ���µĻظ�����1
    void add_article_replied_times(const uint64_t & article_id);

    // ���µĻظ�����1
    void sub_article_replied_times(const uint64_t & article_id);

    // �ظ��Ļظ�����1
    void add_reply_replied_times(const uint64_t & reply_id);

    // �ظ��Ļظ�����1
    void sub_reply_replied_times(const uint64_t & reply_id);

    // �û�ת����Ϣ
    TABLE st_account {
        name         user;
        asset        quantity;

        uint64_t primary_key() const { return user.value; }
    };
    typedef eosio::multi_index<"accounts"_n, st_account> tb_accounts;

    // �û�����
    TABLE st_user_profile {
        name         user;
        string       user_name;
        string       user_family_name;
        string       gender;
        string       birthday;
        string       avatar_pic_hash;
        string       description;
        uint32_t     reg_time;

        uint64_t primary_key() const { return user.value; }
    };
    typedef eosio::multi_index<"userprofiles"_n, st_user_profile> tb_user_profiles;

    // ����
    TABLE st_article {
        name         user;
        uint64_t     article_id;
        string       article_hash;
        uint8_t      category;            // 1=��ʵ�ʼǣ�2=����ʼ�
        uint8_t      type;                // 1=΢�ģ�    2=����      ���������ڳ��Ŀ����б��⣬΢��û�б��⡣������΢�Ķ�û�г������ơ���
        uint8_t      storage_location;    // 1=EOS��     2=ETH��     3=BSC��    5=BTC��                    �������������ݴ洢���������ϣ�
        uint64_t     forward_article_id;  // ת�������µ�id��0��ʾû��ת��
        uint32_t     forwarded_times;     // ��ת���Ĵ���
        uint32_t     replied_times;       // ���ظ��Ĵ���
        uint32_t     post_time;

        uint64_t  primary_key()                const { return article_id; }
        uint128_t by_user_category_post_time() const {
            return (uint128_t{user.value}<<64) + (uint128_t{category}<<32) + uint128_t{~post_time};
        }
        uint128_t by_category_article()        const {
            return (uint128_t{category}<<64) + uint128_t{~article_id};
        }
        uint128_t by_forward_article()         const {
            return (uint128_t{forward_article_id}<<64) + uint128_t{~article_id};
        }
    };
    typedef eosio::multi_index<
        "articles"_n, st_article,
        indexed_by< "byusrcatpost"_n, const_mem_fun<st_article, uint128_t, &st_article::by_user_category_post_time> >,
        indexed_by< "bycatarticle"_n, const_mem_fun<st_article, uint128_t, &st_article::by_category_article> >,
        indexed_by< "byforwardart"_n, const_mem_fun<st_article, uint128_t, &st_article::by_forward_article> >
    > tb_articles;

    // �ظ�
    TABLE st_reply {
        name         user;
        uint64_t     reply_id;
        string       reply_hash;
        uint8_t      storage_location;    // 1=EOS��     2=ETH��     3=BSC��    5=BTC��                    �������������ݴ洢���������ϣ�
        uint64_t     target_article_id;   // Ŀ�����µ�id��0��ʾ�Լ��������µĻظ�
        uint64_t     target_reply_id;     // Ŀ��ظ���id��0��ʾ�Լ����ǻظ��Ļظ�
        uint16_t     replied_times;       // �Լ����ظ��Ĵ���
        uint32_t     post_time;

        uint64_t  primary_key()      const { return reply_id; }
        uint128_t by_article_reply() const {
            return (uint128_t{target_article_id}<<64) + uint128_t{~reply_id};
        }
        uint128_t by_reply_reply()   const {
            return (uint128_t{target_reply_id}<<64) + uint128_t{~reply_id};
        }
        uint128_t by_user_reply()    const {
            return (uint128_t{user.value}<<64) + uint128_t{~reply_id};
        }
    };
    typedef eosio::multi_index<
        "replies"_n, st_reply,
        indexed_by< "byarticlerep"_n, const_mem_fun<st_reply, uint128_t, &st_reply::by_article_reply> >,
        indexed_by< "byreplyreply"_n, const_mem_fun<st_reply, uint128_t, &st_reply::by_reply_reply> >,
        indexed_by< "byuserreply"_n,  const_mem_fun<st_reply, uint128_t, &st_reply::by_user_reply> >
    > tb_replies;

    // �û���ϵ
    TABLE st_user_relationship {
        uint64_t     id;
        name         follow_user;
        name         followed_user;
        uint32_t     follow_time;

        uint64_t  primary_key()           const { return id; }
        uint128_t by_follow_followed()    const {
            return (uint128_t{follow_user.value}<<64) + uint128_t{followed_user.value};
        }
        uint128_t by_followed_follow()    const {
            return (uint128_t{followed_user.value}<<64) + uint128_t{follow_user.value};
        }
    };
    typedef eosio::multi_index<
        "userelations"_n, st_user_relationship,
        indexed_by< "byfllwfllwed"_n, const_mem_fun<st_user_relationship, uint128_t, &st_user_relationship::by_follow_followed> >,
        indexed_by< "byfllwedfllw"_n, const_mem_fun<st_user_relationship, uint128_t, &st_user_relationship::by_followed_follow> >
    > tb_user_relationships;

    tb_accounts              _accounts;
    tb_user_profiles         _user_profiles;
    tb_articles              _articles;
    tb_replies               _replies;
    tb_user_relationships    _user_relationships;
};
