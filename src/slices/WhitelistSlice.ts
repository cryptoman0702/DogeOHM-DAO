import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { IBaseWhitelistAsyncThunk, IJsonRPCError, IValueWhitelistAsyncThunk } from "./interfaces";
import { error } from "./MessagesSlice";
import { setAll } from "../helpers";
import { BigNumber, ethers } from "ethers";
import { addresses, presaleAddresses } from "../constants";
import { abi as WhitelistContractABI } from "../abi/WhitelistContract.json";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { ogWhitelist } from "./resources/OGWhitelist";
import { mainWhitelist } from "./resources/MainWhitelist";

const contracts = [mainWhitelist, ogWhitelist];

export const checkContributionApproval = createAsyncThunk(
  "whitelist/checkContributionApproval",
  async ({ provider, address, networkID, contract }: IBaseWhitelistAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(addresses[networkID].BUSD_ADDRESS as string, ierc20ABI, signer);
    const applicableAllowance = await daiContract.allowance(address, presaleAddresses[networkID][contract]);
    const bigZero = BigNumber.from("0");
    return {
      buyApproval: applicableAllowance.gt(bigZero),
    };
  },
);

export const approveContribution = createAsyncThunk(
  "whitelist/approveContribution",
  async ({ provider, address, networkID, contract }: IBaseWhitelistAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(addresses[networkID].BUSD_ADDRESS as string, ierc20ABI, signer);
    let approveTx;
    try {
      approveTx = await daiContract.approve(
        presaleAddresses[networkID][contract],
        ethers.utils.parseUnits("100000000000000000", "gwei").toString(),
      );
      const text = "Approve Spend";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: "Approve Presale" }));
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

export const claim = createAsyncThunk(
  "whitelist/claim",
  async ({ address, networkID, provider, contract }: IBaseWhitelistAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const whitelistContract = selectContract(networkID, provider, contract);
    await whitelistContract.claim();
  },
);

export const contribute = createAsyncThunk(
  "whitelist/contribute",
  async ({ address, networkID, provider, contract, value }: IValueWhitelistAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const whitelistContract = selectContract(networkID, provider, contract);
    await whitelistContract.buyTokens(value);
  },
);

export const getWhitelistEligibility = createAsyncThunk(
  "whitelist/getWhitelistEligibility",
  async ({ address, networkID, provider, contract }: IBaseWhitelistAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    // const participants = contracts[contract];
    // let eligibility = false;
    // for (let i = 0; i < participants.length; i++)
    //   if (participants[i].toLocaleLowerCase() === address.toLocaleLowerCase()) eligibility = true;
    const whitelistContract = selectContract(networkID, provider, contract);
    const eligibility = await whitelistContract.verify(address.toLocaleLowerCase());
    console.log("ychm log ",eligibility);
    return { eligibility: eligibility};
  },
);

export const getWhitelistData = createAsyncThunk(
  "whitelist/getWhitelistData",
  async ({ address, networkID, provider, contract }: IBaseWhitelistAsyncThunk, { dispatch }) => {
    providerCheck(dispatch, provider);
    const whitelistContract = selectContract(networkID, provider, contract);
    const allocationCap = (await whitelistContract.allocationCap()).toString();
    return {
      status: await whitelistContract.isOpen(),
      hardCap: (await whitelistContract.hardCap()).toString(),
      individualAllocation: allocationCap.toString(),
      amountRaised: (await whitelistContract.subjectRaised()).toString(),
      presaleOpen: (await whitelistContract.openingTime()).toString(),
      presaleClose: (await whitelistContract.closingTime()).toString(),
      remainingContribution: (await whitelistContract.getPurchasableAmount(address, allocationCap)).toString(),
      amountContributed: (await whitelistContract.purchasedAddresses(address)).toString(),
      claimOpen: await whitelistContract.claimOpen(),
      loading: false,
    };
  },
);

function selectContract(networkID: number, provider: { getSigner: () => any }, contract: number) {
  const signer = provider.getSigner();
  return new ethers.Contract(presaleAddresses[networkID][contract], WhitelistContractABI, signer);
  
}

function providerCheck(dispatch: ThunkDispatch<unknown, unknown, AnyAction>, provider: { getSigner: () => any }) {
  if (!provider) {
    dispatch(error("Please connect your wallet!"));
    return;
  }
}

export interface IWhitelistDetails {
  status: boolean;
  hardCap: string;
  individualAllocation: string;
  amountRaised: string;
  presaleOpen: string;
  presaleClose: string;
  eligibility: boolean;
  remainingContribution: string;
  amountContributed: string;
  claimOpen: boolean;
  buyApproval: boolean;
  loading: boolean;
}

const initialState: IWhitelistDetails = {
  status: false,
  hardCap: "",
  individualAllocation: "",
  amountRaised: "",
  presaleOpen: "",
  presaleClose: "",
  eligibility: false,
  remainingContribution: "",
  amountContributed: "",
  claimOpen: false,
  buyApproval: false,
  loading: false,
};

const whitelistSlice = createSlice({
  name: "whitelistData",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getWhitelistData.pending, state => {
        state.loading = true;
      })
      .addCase(getWhitelistData.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getWhitelistData.rejected, (state, { error }) => {
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
      .addCase(getWhitelistEligibility.pending, state => {
        state.loading = true;
      })
      .addCase(getWhitelistEligibility.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getWhitelistEligibility.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

export default whitelistSlice.reducer;

const baseInfo = (state: any) => state.whitelistData;

export const getWhitelistState = createSelector(baseInfo, app => app);
