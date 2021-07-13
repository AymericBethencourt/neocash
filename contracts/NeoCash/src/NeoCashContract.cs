using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace NeoCash
{
    [DisplayName("aymericb.NeoCashContract")]
    [ManifestExtra("Author", "Aymeric B")]
    [ManifestExtra("Email", "aymericb87@gmail.som")]
    [ManifestExtra("Description", "Store Neo N3 addresses corresponding to Twitter account names")]

    public class NeoCashContract : SmartContract
    {
        private static StorageMap ContractStorage => new StorageMap(Storage.CurrentContext, "NeoCashContract");
        private static StorageMap ContractMetadata => new StorageMap(Storage.CurrentContext, "Metadata");

        private static Transaction Tx => (Transaction)Runtime.ScriptContainer;

        [DisplayName("AddressChanged")]
        public static event Action<ByteString, ByteString> OnAddressChanged;

        public static void CreateRequest(string tweetId, string username)
        {
            Oracle.Request("https://api.neocash.io/" + tweetId, "address", "callback", username.ToByteArray(), 0_10000000);
        }

        public static void Callback(string url, byte[] username, int code, byte[] result)
        {
            Runtime.Log("OracleCallback");
            Runtime.Log(username.ToString());
            Runtime.Log(result.ToString());
            ContractStorage.Put(username.ToString(), result.ToString());
            OnAddressChanged(username.ToString(), result.ToString());

        }
        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update)
        {
            if (!update)
            {
                ContractMetadata.Put("Owner", (ByteString)Tx.Sender);
            }
        }

        public static ByteString GetAddress(ByteString Name)
        {
            return ContractStorage.Get(Name);
        }

        public static void UpdateContract(ByteString nefFile, string manifest)
        {
            ByteString owner = ContractMetadata.Get("Owner");
            if (!Tx.Sender.Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Update(nefFile, manifest, null);
        }

        public static bool Verify()
        {
            return true;
        }
    }
}
