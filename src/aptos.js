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
    getAccountWithAddress(address){
        if(!address){
            throw new Error("Pass address in parameter")
        }
        return this.client.getAccount(address)
    }
    async getBalanceWithPrivateKey(privateKey, extraArgs = null) {
        let account = await this.getAccountWithPrivateKey(privateKey)
        extraArgs = {
            coinType: extraArgs?.coinType ?? '0x1::aptos_coin::AptosCoin'
        }
        let balance = await this.coinClient.checkBalance(account, extraArgs);
        return Number(balance)/Math.pow(10,8);
    }
    async transferCoin(privateKey, to_address, amount,  extraArgs=null, options=null){
        let sender = await this.getAccountWithPrivateKey(privateKey);
        let balance = await this.getBalanceWithPrivateKey(privateKey, extraArgs);
        if(balance < amount){
            throw new Error("Sender lacks blance to send.")
        }
        amount = amount * Math.pow(10,8);
        if(options == null){
            options = {
                gasUnitPrice : BigInt(100)
            }
        }
        extraArgs = {
            coinType: extraArgs?.coinType ?? '0x1::aptos_coin::AptosCoin',
            gasUnitPrice: options.gasUnitPrice
        }
        return this.coinClient.transfer(sender, to_address, amount, extraArgs)
    }
    async createCompleteTxnWithPrivateKey(privateKey, to_address, amount,  extraArgs=null, options=null){
        let txHash = await this.transferCoin(privateKey, to_address, amount,  extraArgs, options);
        console.log(txHash)
        let wait = await this.client.waitForTransaction(txHash);
        return wait;
    }
    // 1 Octa = 10 ^ 8 APT 

}