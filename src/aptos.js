import { AptosClient, CoinClient, AptosAccount, HexString } from "aptos";

export default class Aptos {
    constructor(network = "devnet") {
        const netwrk = this.getNetwork(network);
        this.client = new AptosClient(netwrk.node);
        this.coinClient = new CoinClient(this.client);
    }

    getAllNetworks() {
        return [
            {
                name: "mainnet",
                node: "https://fullnode.mainnet.aptoslabs.com",
                explorer_api: ""
            },
            {
                name: "testnet",
                node: "https://fullnode.testnet.aptoslabs.com",
                explorer_api: ""
            },
            {
                name: "devnet",
                node: "https://fullnode.devnet.aptoslabs.com",
                explorer_api: ""
            }
        ]
    }

    getNetwork(network) {
        const accepted_string = ["mainnet", "testnet", "devnet"];
        if (!(accepted_string.includes(network))) {
            throw new Error('Illegal parameter. Accepted: mainnet, testnet, devnet.')
        }
        const all_networks = this.getAllNetworks();
        return all_networks.filter((el) => el.name == network)[0];
    }
    getAccountWithPrivateKey(privateKey) {
        if (!privateKey) {
            throw new Error("Pass private key in parameter")
        }
        return new AptosAccount(HexString.ensure(privateKey).toUint8Array());
    }
    async getBalanceWithPrivateKey(privateKey, extraArgs = null) {
        let account = await this.getAccountWithPrivateKey(privateKey)
        extraArgs = {
            coinType: extraArgs?.coinType ?? 'APTOS_COIN'
        }
        return this.coinClient.checkBalance(account, extraArgs)
    }
    // 1 Octa = 10-8 APT
}

const obj = new Aptos();
console.log(await obj.getBalanceWithPrivateKey("0x24d0afb5baf8056f8e11298d0f2376c5814e8fa8b415abea1ba1200699df7a54"))