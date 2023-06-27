import Web3 from "web3";

export default class Bsc{
    constructor(net="testnet"){
        let network = this.getNetwork(net);
        this.web3 = new Web3(new Web3.providers.HttpProvider(network.rpc[0])); //rpc at 0th index
    }
    getAllNetworks(){
        return [
            {
                name:"mainnet",
                rpc:["https://bsc-dataseed.binance.org"],
                explorer:"https://bscscan.com/"
            },
            {
                name:"testnet",
                rpc:["https://data-seed-prebsc-1-s1.bnbchain.org:8545/","https://data-seed-prebsc-2-s1.bnbchain.org:8545/","https://data-seed-prebsc-1-s2.bnbchain.org:8545/"],
                explorer:"https://testnet.bscscan.com/"
            }
        ]
    }
    getNetwork(network){
        let network_arr = this.getAllNetworks()
        return network_arr.filter((element)=>element.name == network)[0];
    }
    getBalance(address){
        return this.web3.eth.getBalance(address); //returns balance in wei
    }
    getBalanceInEth(address){
        return this.web3.utils.fromWei(
            this.web3.getBalance(address),
            "ether"
        )
    }
    createTxn(from, to, amount){
        return {
            from, 
            to,
            value: this.web3.utils.toWei(amount, "ether")
        }
    }
    async signTxn(from, to, amount, private_key){
        let txn_object = await this.createTxn(from, to, amount);
        return this.web3.eth.signTransaction(txn_object, private_key);
    }
    async sendSignedTxn(from, to, amount, private_key){
        let signedTxn = await this.signTxn(from, to, amount, private_key);
        return this.web3.eth.sendSignedTransaction(signedTxn); //the will return the txn receipt
    }
}
