import TronWeb from 'tronweb';
const HttpProvider = TronWeb.providers.HttpProvider;
export default class Tron {
    constructor(network = "testnet", privateKey = null, apiKey = null) {
        const netwrk = this.getNetwork(network);
        const fullNode = new HttpProvider(netwrk.providers.fullNode);
        const solidityNode = new HttpProvider(netwrk.providers.solidityNode);
        const eventServer = new HttpProvider(netwrk.providers.eventServer);
        this.tronweb = new TronWeb(fullNode, solidityNode, eventServer);
        if (privateKey != null) {
            this.tronweb.setPrivateKey(privateKey);
        }
        if (apiKey != null) {
            this.tronweb.setHeader({ "TRON-PRO-API-KEY": apiKey })
        }
    }
    getAllNetworks() {
        return [
            {
                name: "testnet",
                providers: {
                    fullNode: "https://api.shasta.trongrid.io/",
                    solidityNode: "https://api.shasta.trongrid.io/",
                    eventServer: "https://api.shasta.trongrid.io/"
                }
            },
            {
                name: "mainnet",
                providers: {
                    fullNode: "https://api.trongrid.io/",
                    solidityNode: "https://api.trongrid.io/",
                    eventServer: "https://api.trongrid.io/"
                }
            },
            {
                name: "nile",
                providers: {
                    fullNode: "https://nile.trongrid.io/",
                    solidityNode: "https://nile.trongrid.io/",
                    eventServer: "https://nile.trongrid.io/"
                }
            }
        ]
    }
    getNetwork(network) {
        const accepted_string = ["testnet", "mainnet", "nile"];
        if (!(accepted_string.includes(network))) {
            throw new Error('Illegal parameter. Accepted: testnet, mainnet, nile.')
        }
        const all_networks = this.getAllNetworks();
        return all_networks.filter((el) => el.name == network)[0];
    }
    isAddress(address) {
        if (!address) {
            throw new Error("Need address in parameter")
        }
        return this.tronweb.isAddress(address);
    }
    async checkConnection() {
        return this.tronweb.isConnected();
    }
}

var obj = new Tron();
console.log(await obj.isAddress("abc"))
