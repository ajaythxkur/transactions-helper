import { JsonRpcProvider, devnetConnection, mainnetConnection, testnetConnection, RawSigner, TransactionBlock } from "@mysten/sui.js";

export default class Sui {
    
    constructor(network = "devnet") {
        const netwrk = this.getNetwork(network);
        this.provider = new JsonRpcProvider(netwrk.node)
    }
    getAllNetworks() {
        return [
            {
                name: "mainnet",
                node: mainnetConnection
            },
            {
                name: "testnet",
                node: testnetConnection
            },
            {
                name: "devnet",
                node: devnetConnection
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
    getSigner(keypair) {
        return new RawSigner(keypair, this.provider);
    }
    createTransferObject(keypair, from, to) {
        const tx = new TransactionBlock();
        tx.transferObjects(
            [
                tx.object(
                    '',
                ),
            ],
            tx.pure(''),
        );
    }

}

const obj = new Sui();
obj.createTransferObject();

