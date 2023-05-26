import { JsonRpcProvider, devnetConnection, mainnetConnection, testnetConnection, RawSigner, TransactionBlock } from "@mysten/sui.js";

export default class Sui {
    static NETWORKS = {
        "devnet": devnetConnection,
        "mainnet": mainnetConnection,
        "testnet": testnetConnection
    }
    constructor(network = "devnet") {
        if (!(Object.keys(NETWORKS).includes(network))) {
            throw new Error("Illegal Network parameter!! Accepted: devnet, mainnet, testnet")
        }
        this.provider = new JsonRpcProvider(NETWORKS[network])
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

