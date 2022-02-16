import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as DOGEsv2 } from "../abi/Dogesv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
// import { abi as wDOGEs } from "../abi/wDOGEs.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

interface IUserBalances {
  balances: {
    doge: string;
    doges: string;
    // fdoges: string;
    // wdoges: string;
    // wdogesAsDoges: string;
    // pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const dogeContract = new ethers.Contract(addresses[networkID].DOGE_ADDRESS as string, ierc20Abi, provider);
    const dogeBalance = await dogeContract.balanceOf(address);
    const dogesContract = new ethers.Contract(
      addresses[networkID].DOGEs_ADDRESS as string,
      ierc20Abi,
      provider,
    );
    const dogesBalance = await dogesContract.balanceOf(address);
    //const wdogesContract = new ethers.Contract(addresses[networkID].WDOGEs_ADDRESS as string, wDOGEs, provider);
    //const wdogesBalance = await wdogesContract.balanceOf(address);
    // NOTE (appleseed): wdogesAsDoges is wDOGEs given as a quantity of DOGEs
    // const wdogesAsDoges = await wdogesContract.wDOGEToDOGEs(wdogesBalance);
    // const wdogesAsDoges = BigNumber.from(0);
    // const poolTokenContract = new ethers.Contract(
    //   addresses[networkID].PT_TOKEN_ADDRESS as string,
    //   ierc20Abi,
    //   provider,
    // );
    // const poolBalance = await poolTokenContract.balanceOf(address);
    const poolBalance = BigNumber.from(0);

    // let fdogesBalance = BigNumber.from(0);
    // for (const fuseAddressKey of ["FUSE_6_DOGEs", "FUSE_18_DOGEs", "FUSE_36_DOGEs"]) {
    //   if (addresses[networkID][fuseAddressKey]) {
    //     const fdogesContract = new ethers.Contract(
    //       addresses[networkID][fuseAddressKey] as string,
    //       fuseProxy,
    //       provider.getSigner(),
    //     );
    //     // fdogesContract.signer;
    //     const balanceOfUnderlying = await fdogesContract.callStatic.balanceOfUnderlying(address);
    //     fdogesBalance = balanceOfUnderlying.add(fdogesBalance);
    //   }
    // }

    return {
      balances: {
        doge: ethers.utils.formatUnits(dogeBalance, "gwei"),
        doges: ethers.utils.formatUnits(dogesBalance, "gwei"),
        // fdoges: ethers.utils.formatUnits(fdogesBalance, "gwei"),
        //wdoges: ethers.utils.formatEther(wdogesBalance),
        // wdogesAsDoges: ethers.utils.formatUnits(wdogesAsDoges, "gwei"),
        // pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    dogeStake: number;
    dogeUnstake: number;
  };
  // wrapping: {
  //   dogesWrap: number;
  //   wdogesUnwrap: number;
  // };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const dogeContract = new ethers.Contract(addresses[networkID].DOGE_ADDRESS as string, ierc20Abi, provider);
    
    const stakeAllowance = await dogeContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    console.log("accountSlice", stakeAllowance);
    const dogesContract = new ethers.Contract(addresses[networkID].DOGEs_ADDRESS as string, DOGEsv2, provider);
    const unstakeAllowance = await dogesContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    // const poolAllowance = await dogesContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    // const wrapAllowance = await dogesContract.allowance(address, addresses[networkID].WDOGEs_ADDRESS);

    //const wdogesContract = new ethers.Contract(addresses[networkID].WDOGEs_ADDRESS as string, wDOGEs, provider);
    //const unwrapAllowance = await wdogesContract.allowance(address, addresses[networkID].WDOGEs_ADDRESS);

    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        dogeStake: +stakeAllowance,
        dogeUnstake: +unstakeAllowance,
      },
      // wrapping: {
      //   dogeWrap: +wrapAllowance,
      //   dogeUnwrap: +unwrapAllowance,
      // },
      pooling: {
        dogesPool: 0,
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
  balances: { doge: "", doges: ""/*, wdogesAsDoges: "", wdoges: "", fdoges: "", pool: ""*/ },
  staking: { dogeStake: 0, dogeUnstake: 0 },
  //wrapping: { dogesWrap: 0, wdogesUnwrap: 0 },
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
