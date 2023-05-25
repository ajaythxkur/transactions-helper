import TronWeb from 'tronweb';
const HttpProvider = TronWeb.providers.HttpProvider;
import axios from 'axios';
export default class Tron {
    constructor(network = "shasta") {
        const netwrk = this.getNetwork(network);
        this.explorer_api = netwrk.explorer_api;
        const fullNode = new HttpProvider(netwrk.providers.fullNode);
        const solidityNode = new HttpProvider(netwrk.providers.solidityNode);
        const eventServer = new HttpProvider(netwrk.providers.eventServer);
        this.tronweb = new TronWeb(fullNode, solidityNode, eventServer);
    }
    getAllNetworks() {
        return [
            {
                name: "shasta",
                providers: {
                    fullNode: "https://api.shasta.trongrid.io/",
                    solidityNode: "https://api.shasta.trongrid.io/",
                    eventServer: "https://api.shasta.trongrid.io/"
                },
                explorer_api: "https://shastapi.tronscan.org/api/"
            },
            {
                name: "mainnet",
                providers: {
                    fullNode: "https://api.trongrid.io/",
                    solidityNode: "https://api.trongrid.io/",
                    eventServer: "https://api.trongrid.io/"
                },
                explorer_api: "https://apilist.tronscanapi.com/api/"
            },
            {
                name: "nile",
                providers: {
                    fullNode: "https://nile.trongrid.io/",
                    solidityNode: "https://nile.trongrid.io/",
                    eventServer: "https://nile.trongrid.io/"
                },
                explorer_api: "https://nileapi.tronscan.org/api/"
            }
        ]
    }

    getNetwork(network) {
        const accepted_string = ["shasta", "mainnet", "nile"];
        if (!(accepted_string.includes(network))) {
            throw new Error('Illegal parameter. Accepted: testnet, mainnet, nile.')
        }
        const all_networks = this.getAllNetworks();
        return all_networks.filter((el) => el.name == network)[0];
    }

    isAddress(address) {
        if (!address) {
            throw new Error("Pass address in parameter")
        }
        return this.tronweb.isAddress(address);
    }

    checkConnection() {
        return this.tronweb.isConnected();
    }

    async createUnsignedTxn(to, from, amount, options = null) {
        if (!to || !from || !amount) {
            throw new Error("Pass all parameters: to, from, amount")
        }
        let from_balance = await this.tronweb.trx.getBalance(from);
        if (from_balance < amount) {
            throw new Error("Insufficient amount in sender address")
        }
        amount = await this.tronweb.toSun(amount);
        //address validation
        let isToAddress = this.isAddress(to);
        if (!isToAddress) {
            throw new Error("Invalid receiver address")
        }
        let isFromAddress = this.isAddress(from);
        if (!isFromAddress) {
            throw new Error("Invalid sending address.")
        }
        if (options != null) {
            return this.tronweb.transactionBuilder.sendTrx(to, amount, from, options);
        }
        return this.tronweb.transactionBuilder.sendTrx(to, amount, from);
    }

    async createSignedTxnWithPrivateKey(to, from, amount, privateKey, options = null) {
        if (!privateKey) {
            throw new Error("Need private key to sign transaction")
        }
        let unsingedTxn = await this.createUnsignedTxn(to, from, amount, options);
        return this.tronweb.trx.sign(unsingedTxn, privateKey);
    }

    async signAndBroadcastTxnWithPrivateKey(to, from, amount, privateKey, options = null) {
        let signedTxn = await this.createSignedTxnWithPrivateKey(to, from, amount, privateKey, options);
        if (!signedTxn.signature) {
            throw new Error("Signature not found.")
        }
        return this.tronweb.trx.sendRawTransaction(signedTxn);
    }

    async createCompletedTransaction(to, from, amount, privateKey, options = null) {
        let receipt = await this.signAndBroadcastTxnWithPrivateKey(to, from, amount, privateKey, options);
        if (!receipt.result) {
            throw new Error("Make sure sender address have funds for gas fees.")
        }
        let response = await this.verifyTransaction(receipt.txid);
        return response;
    }

    async verifyTransaction(hash) {
        console.log("Verifying transaction, please wait!!")
        if (!hash) {
            throw new Error("Hash needed")
        }
        let response = await axios.get(this.explorer_api + 'transaction-info?hash=' + hash);
        if (response.data == undefined || Object.keys(response.data).length == 0) {
            await this.sleep(2500);
            return this.verifyTransaction(hash);
        }
        return response.data;
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    createUnsignedContractTxn(to, from, amount, contract_address, options = null) {
        if (!contract_address) {
            throw new Error("Provide contract address")
        }

    }

}


