import { ethers, Wallet, id, parseEther, formatEther, formatUnits, Contract, getUint } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers";
import { Signer } from "ethers";

let signer = null;

let provider;

let eth = parseEther("1.0");
formatEther(eth);

let feePerGas = parseUnits("4.5", "gwei");
formatUnits(feePerGas);

async function getBalance(address: string) {
    const balance = await provider.getBalance(address);
    if (balance > 1e18) { // wei
        return formatEther(balance);
    }
    // gwei
    return formatUnits(balance);
}

//send 
async function sendTransaction(address: string) {
    const tx = await signer.sendTransaction({
        to: address,
        value: parseEther("1.0")
    })
    return tx;
}

const receipt = sendTransaction("123");

const abi = [
    "function decimals() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address addr) view returns (uint)"
]

const contract = new Contract("dai.tokens.ether.eth", abi, provider);

const getSymbol = async () => {
    const sym = await contract.symbol();
    return sym;
}

const getDecimals = async () => {
    const decimals = await contract.decimals();
    return decimals;
}

const formatBalance = (
    balance: number,
    decimals: string
) => {

}

const getBalances = async (address: string) => {
    const balances = await contract.balanceOf(address);
    formatUnits(balances);
}

const transfer = async (address: string, amount: string) => {
    const parseAmount = parseUnits(amount, "18");
    const tx = await contract.transfer(address, parseAmount);
    await tx.await(); // 等待交易添加进区块链中
}

const filter = contract.filters.Transfer("ether.eth");
contract.on(filter, (from, to, _amount, event) => {
    const amount = parseEther(_amount);
    console.log(`${from} => ${to}: ${amount}`);
    event.removeListener();
})

const getEvents = async () => {
    const events = await contract.queryFilter(filter);
    console.log(events[0]);
}

signer = new Wallet(id("test"));
const message = "hello ether";
const signMessage = async (message: string) => {
    const sig = await signer.signMessage(message);
}

const verifyMessage = async (message, sig) => {
    verifyMessage(message, sig);
}

console.log(eth, feePerGas);

// const utils = getUint();