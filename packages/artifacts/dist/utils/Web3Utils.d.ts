import { JSONRPCResponsePayload, TransactionReceipt } from 'ethereum-types';
import * as Web3 from 'web3';
export declare class Web3Utils {
    private web3;
    constructor(web3: Web3);
    static soliditySHA3(...payload: any[]): string;
    static fromAscii(ascii: string): string;
    static bytes32Ascii(ascii: string, chars: number, sign: string): string;
    getNetworkIdAsync(): Promise<number>;
    getAvailableAddressesAsync(): Promise<string[]>;
    doesContractExistAtAddressAsync(address: string): Promise<boolean>;
    getTransactionReceiptAsync(txHash: string): Promise<TransactionReceipt>;
    saveTestSnapshot(): Promise<number>;
    revertToSnapshot(snapshotId: number): Promise<boolean>;
    /**
     * Returns the current blocktime in seconds.
     *
     * @returns {Promise<number>}
     */
    getCurrentBlockTime(): Promise<number>;
    /**
     * Increases block time by the given number of seconds. Returns true
     * if the next block was mined successfully after increasing time.
     *
     * @param {number} seconds
     * @returns {Promise<boolean>}
     */
    increaseTime(seconds: number): Promise<boolean>;
    /**
     * Mines a single block.
     *
     * @returns {Promise<"web3".JSONRPCResponsePayload>}
     */
    mineBlock(): Promise<JSONRPCResponsePayload>;
    private sendJsonRpcRequestAsync;
}