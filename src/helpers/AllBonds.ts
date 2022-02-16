import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as BusdImg } from "src/assets/tokens/Busd.svg";
import { ReactComponent as DogeDaiImg } from "src/assets/tokens/DOGE-DAI.svg";
import { ReactComponent as DogeBusdImg } from "src/assets/tokens/DOGE-BUSD.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as DogeFraxImg } from "src/assets/tokens/DOGE-FRAX.svg";
import { ReactComponent as DogeLusdImg } from "src/assets/tokens/DOGE-LUSD.svg";
import { ReactComponent as DogeEthImg } from "src/assets/tokens/DOGE-WETH.svg";
import { ReactComponent as wFTMImg } from "src/assets/tokens/wFTM.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";
import { ReactComponent as CvxImg } from "src/assets/tokens/CVX.svg";

import { abi as FraxDogeBondContract } from "src/abi/bonds/DogeFraxContract.json";
import { abi as BondDogeDaiContract } from "src/abi/bonds/DogeDaiContract.json";
import { abi as BondDogeBusdContract } from "src/abi/bonds/DogeBusdContract.json";
import { abi as BondDogeLusdContract } from "src/abi/bonds/DogeLusdContract.json";
import { abi as BondDogeEthContract } from "src/abi/bonds/DogeEthContract.json";

import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as BusdBondContract } from "src/abi/bonds/BusdContract.json";
import { abi as ReserveDogeLusdContract } from "src/abi/reserves/DogeLusd.json";
import { abi as ReserveDogeDaiContract } from "src/abi/reserves/DogeBusd.json";
import { abi as ReserveDogeBusdContract } from "src/abi/reserves/DogeDai.json";
import { abi as ReserveDogeFraxContract } from "src/abi/reserves/DogeFrax.json";
import { abi as ReserveDogeEthContract } from "src/abi/reserves/DogeEth.json";

import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as CvxBondContract } from "src/abi/bonds/CvxContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BigNumberish } from "ethers";
import { getTokenPrice } from "src/helpers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x6092Cc646226fd6e66D8EDF2feD1436E8F8d50aF",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});

export const lusd = new StableBond({
  name: "lusd",
  displayName: "USDC",
  bondToken: "LUSD",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: LusdImg,
  bondContractABI: LusdBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D",
      reserveAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
      reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
    },
  },
});

export const ftm = new CustomBond({
  name: "ftm",
  displayName: "wFTM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wFTM",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: wFTMImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xEA8A38aa660E1b15215380207a229dc2eCa8C362",
      reserveAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
      reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    let ethPrice: BigNumberish = await ethBondContract.assetPrice();
    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 8);
    return ethAmount * ethPrice;
  },
});


// the old convex bonds. Just need to be claimable for the users who previously purchased
export const cvx_expired = new CustomBond({
  name: "cvx-v1",
  displayName: "CVX OLD",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "CVX",
  isAvailable: { [NetworkID.Mainnet]: false, [NetworkID.Testnet]: true },
  bondIconSvg: CvxImg,
  bondContractABI: CvxBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x6754c69fe02178f54ADa19Ebf1C5569826021920",
      reserveAddress: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    let cvxPrice: number = await getTokenPrice("convex-finance");
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 18);
    return cvxAmount * cvxPrice;
  },
});

export const doge_busd = new LPBond({
  name: "doge_busd_lp",
  displayName: "DOGE-BUSD LP",
  bondToken: "BUSD",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: false },
  bondIconSvg: DogeBusdImg,
  bondContractABI: BondDogeBusdContract,
  reserveContract: ReserveDogeBusdContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xa60f663055945139F27862331E9eb45208C7E84F",
      reserveAddress: "0x716a54efe0d4f838ff6c7eb67f16e2a65ff7b20d",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://bscscan.com/address/0x42F766D0327Ac163E36D26A9210BDaa910F7C771",
});

export const busd = new StableBond({
  name: "busd",
  displayName: "BUSD",
  bondToken: "BUSD",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: BusdImg,
  bondContractABI: BusdBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xA38aaFA41A40cee22fdAEc59540AD6697dE6b639",
      reserveAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});
export const doge_lusd = new LPBond({
  name: "doge_lusd_lp",
  displayName: "DOGE-USDC LP",
  bondToken: "LUSD",
  isAvailable: { [NetworkID.Mainnet]: false, [NetworkID.Testnet]: true },
  bondIconSvg: DogeLusdImg,
  bondContractABI: BondDogeLusdContract,
  reserveContract: ReserveDogeLusdContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xFB1776299E7804DD8016303Df9c07a65c80F67b6",
      reserveAddress: "0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
    },
    [NetworkID.Testnet]: {
      // NOTE (appleseed-lusd): using doge-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://bscscan.com/address/0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
// export const allBonds = [dai, frax, eth, cvx, doge_dai, doge_frax, lusd, doge_lusd, doge_weth];
export const allBonds = [busd, doge_busd]; // ychm - removing ftm for starting
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds = [cvx_expired];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
