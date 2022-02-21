import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { IBaseWhitelistAsyncThunk,IValueAsyncThunk, IBaseAddressAsyncThunk, IJsonRPCError, IValueWhitelistAsyncThunk } from "./interfaces";
import { error } from "./MessagesSlice";
import { setAll } from "../helpers";
import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as LotteryContractABI } from "../abi/LotteryContract.json";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

export const checkContributionApproval = createAsyncThunk(
  "lottery/checkContributionApproval",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const signer = provider.getSigner();
    const ticketContract = new ethers.Contract(addresses[networkID].VP_ADDRESS as string, ierc20ABI, signer);
    const applicableAllowance = await ticketContract.allowance(address, addresses[networkID].LOTTERY_ADDRESS);
    const bigZero = BigNumber.from("0");
    return {
      buyApproval: applicableAllowance.gt(bigZero),
    };
  },
);

export const approveContribution = createAsyncThunk(
  "lottery/approveContribution",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const signer = provider.getSigner();
    const ticketContract = new ethers.Contract(addresses[networkID].VP_ADDRESS as string, ierc20ABI, signer);
    let approveTx;
    try {
      approveTx = await ticketContract.approve(
        addresses[networkID].LOTTERY_ADDRESS,
        ethers.utils.parseUnits("100000000000000000", "gwei").toString(),
      );
      const text = "Approve Spend";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: "Approve Tickets" }));
        await approveTx.wait();
        return {
          buyApproval: true,
        };
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const contribute = createAsyncThunk(
  "lottery/contribute",
  async ({ address, networkID, provider, value }: IValueAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const lotteryContract = selectContract(networkID, provider);
    await lotteryContract.deposit(value);
  },
);
export const claim = createAsyncThunk(
  "lottery/claim",
  async ({ address, networkID, provider}: IValueAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const lotteryContract = selectContract(networkID, provider);
    await lotteryContract.claim();
  },
);

export const getLotteryData = createAsyncThunk(
  "lottery/getLotteryData",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const lotteryContract = selectContract(networkID, provider);
    const allocationCap = (await lotteryContract.allocLimit()).toString();
    return {
      status: await lotteryContract.isOpen(),
      isClaimable: await lotteryContract.isClaimable(),
      individualAllocation: allocationCap,
      amountRaised: (await lotteryContract.totalDeposit()).toString(),
      presaleOpen: (await lotteryContract.openingTime()).toString(),
      presaleClose: (await lotteryContract.closingTime()).toString(),
      remainingContribution: (await lotteryContract.getDepositable(address)).toString(),
      amountContributed: (await lotteryContract.deposits(address)).toString(),
      loading: false,
    };
  },
);

function selectContract(networkID: number, provider: { getSigner: () => any }) {
  const signer = provider.getSigner();
  return new ethers.Contract(addresses[networkID].LOTTERY_ADDRESS, LotteryContractABI, signer);
  
}

function providerCheck(dispatch: ThunkDispatch<unknown, unknown, AnyAction>, provider: { getSigner: () => any }) {
  if (!provider) {
    dispatch(error("Please connect your wallet!"));
    return;
  }
}

export interface LotteryDetails {
  status: boolean,
  individualAllocation: string,
  amountRaised: string,
  presaleOpen: string,
  presaleClose: string,
  remainingContribution: string,
  amountContributed: string,
  buyApproval: false,
  //claimOpen: await lotteryContract.claimOpen(),
  loading: boolean,
  isClaimable: boolean,
}

const initialState: LotteryDetails = {
  status: false,
  individualAllocation: "1",
  amountRaised: "0",
  presaleOpen: "0",
  presaleClose: "0",
  remainingContribution: "0",
  amountContributed: "0",
  buyApproval: false,
  loading: true,
  isClaimable: false,
};

const lotterySlice = createSlice({
  name: "lottery",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getLotteryData.pending, state => {
        state.loading = true;
      })
      .addCase(getLotteryData.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getLotteryData.rejected, (state, { error }) => {
        state.loading = false;
      })
      .addCase(checkContributionApproval.pending, state => {
        state.loading = true;
      })
      .addCase(checkContributionApproval.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(checkContributionApproval.rejected, (state, { error }) => {
        state.loading = false;
      })
  },
});

export default lotterySlice.reducer;

const baseInfo = (state: any) => state.lottery;

export const getWhitelistState = createSelector(baseInfo, app => app);
