import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as DOHMsv2 } from "../abi/Dohmsv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
// import { abi as wDOHMs } from "../abi/wDOHMs.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

interface IUserBalances {
  balances: {
    dohm: string;
    dohms: string;
    // fdohms: string;
    // wdohms: string;
    // wdohmsAsDohms: string;
    // pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const dohmContract = new ethers.Contract(addresses[networkID].DOHM_ADDRESS as string, ierc20Abi, provider);
    const dohmBalance = await dohmContract.balanceOf(address);
    const dohmsContract = new ethers.Contract(
      addresses[networkID].DOHMS_ADDRESS as string,
      ierc20Abi,
      provider,
    );
    const dohmsBalance = await dohmsContract.balanceOf(address);
    //const wdohmsContract = new ethers.Contract(addresses[networkID].WDOHMS_ADDRESS as string, wDOHMs, provider);
    //const wdohmsBalance = await wdohmsContract.balanceOf(address);
    // NOTE (appleseed): wdohmsAsDohms is wDOHMs given as a quantity of DOHMs
    // const wdohmsAsDohms = await wdohmsContract.wDOHMToDOHMs(wdohmsBalance);
    // const wdohmsAsDohms = BigNumber.from(0);
    // const poolTokenContract = new ethers.Contract(
    //   addresses[networkID].PT_TOKEN_ADDRESS as string,
    //   ierc20Abi,
    //   provider,
    // );
    // const poolBalance = await poolTokenContract.balanceOf(address);
    const poolBalance = BigNumber.from(0);

    // let fdohmsBalance = BigNumber.from(0);
    // for (const fuseAddressKey of ["FUSE_6_DOHMS", "FUSE_18_DOHMS", "FUSE_36_DOHMS"]) {
    //   if (addresses[networkID][fuseAddressKey]) {
    //     const fdohmsContract = new ethers.Contract(
    //       addresses[networkID][fuseAddressKey] as string,
    //       fuseProxy,
    //       provider.getSigner(),
    //     );
    //     // fdohmsContract.signer;
    //     const balanceOfUnderlying = await fdohmsContract.callStatic.balanceOfUnderlying(address);
    //     fdohmsBalance = balanceOfUnderlying.add(fdohmsBalance);
    //   }
    // }

    return {
      balances: {
        dohm: ethers.utils.formatUnits(dohmBalance, "gwei"),
        dohms: ethers.utils.formatUnits(dohmsBalance, "gwei"),
        // fdohms: ethers.utils.formatUnits(fdohmsBalance, "gwei"),
        //wdohms: ethers.utils.formatEther(wdohmsBalance),
        // wdohmsAsDohms: ethers.utils.formatUnits(wdohmsAsDohms, "gwei"),
        // pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    dohmStake: number;
    dohmUnstake: number;
  };
  // wrapping: {
  //   dohmsWrap: number;
  //   wdohmsUnwrap: number;
  // };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const dohmContract = new ethers.Contract(addresses[networkID].DOHM_ADDRESS as string, ierc20Abi, provider);
    
    const stakeAllowance = await dohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    console.log("accountSlice", stakeAllowance);
    const dohmsContract = new ethers.Contract(addresses[networkID].DOHMS_ADDRESS as string, DOHMsv2, provider);
    const unstakeAllowance = await dohmsContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    // const poolAllowance = await dohmsContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    // const wrapAllowance = await dohmsContract.allowance(address, addresses[networkID].WDOHMS_ADDRESS);

    //const wdohmsContract = new ethers.Contract(addresses[networkID].WDOHMS_ADDRESS as string, wDOHMs, provider);
    //const unwrapAllowance = await wdohmsContract.allowance(address, addresses[networkID].WDOHMS_ADDRESS);

    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        dohmStake: +stakeAllowance,
        dohmUnstake: +unstakeAllowance,
      },
      // wrapping: {
      //   dohmWrap: +wrapAllowance,
      //   dohmUnwrap: +unwrapAllowance,
      // },
      pooling: {
        dohmsPool: 0,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    //console.log("balance_dbut:", bond.name, balanceVal);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  bonds: { [key: string]: IUserBondDetails };
  loading: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { dohm: "", dohms: ""/*, wdohmsAsDohms: "", wdohms: "", fdohms: "", pool: ""*/ },
  staking: { dohmStake: 0, dohmUnstake: 0 },
  //wrapping: { dohmsWrap: 0, wdohmsUnwrap: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
