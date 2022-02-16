import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as wDOGEs } from "../abi/wDOGEs.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, wrapAllowance: BigNumber, unwrapAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "doges") {
    applicableAllowance = wrapAllowance;
  } else if (token === "wdoges") {
    applicableAllowance = unwrapAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

// export const changeApproval = createAsyncThunk(
//   "wrap/changeApproval",
//   async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }

//     const signer = provider.getSigner();
//     const dogesContract = new ethers.Contract(addresses[networkID].DOGEs_ADDRESS as string, ierc20ABI, signer) ;
//     // const wdogesContract = new ethers.Contract(
//     //   addresses[networkID].WDOGEs_ADDRESS as string,
//     //   ierc20ABI,
//     //   signer,
//     // );
//     let approveTx;
//     //let wrapAllowance = await dogesContract.allowance(address, addresses[networkID].WDOGEs_ADDRESS);
//     //let unwrapAllowance = await wdogesContract.allowance(address, addresses[networkID].WDOGEs_ADDRESS);

//     // return early if approval has already happened
//     // if (alreadyApprovedToken(token, wrapAllowance, unwrapAllowance)) {
//     //   dispatch(info("Approval completed."));
//     //   return dispatch(
//     //     fetchAccountSuccess({
//     //       wrapping: {
//     //         dogeWrap: +wrapAllowance,
//     //         dogeUnwrap: +unwrapAllowance,
//     //       },
//     //     }),
//     //   );
//     // }

//     try {
//       if (token === "doges") {
//         // won't run if wrapAllowance > 0
//         approveTx = await dogesContract.approve(
//           addresses[networkID].WDOGEs_ADDRESS,
//           ethers.utils.parseUnits("1000000000", "gwei").toString(),
//         );
//       } else if (token === "wdoges") {
//         approveTx = await wdogesContract.approve(
//           addresses[networkID].WDOGEs_ADDRESS,
//           ethers.utils.parseUnits("1000000000", "gwei").toString(),
//         );
//       }

//       const text = "Approve " + (token === "doges" ? "Wrapping" : "Unwrapping");
//       const pendingTxnType = token === "doges" ? "approve_wrapping" : "approve_unwrapping";
//       if (approveTx) {
//         dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

//         await approveTx.wait();
//       }
//     } catch (e: unknown) {
//       dispatch(error((e as IJsonRPCError).message));
//       return;
//     } finally {
//       if (approveTx) {
//         dispatch(clearPendingTxn(approveTx.hash));
//       }
//     }

//     // go get fresh allowances
//     wrapAllowance = await dogesContract.allowance(address, addresses[networkID].WDOGEs_ADDRESS);
//     unwrapAllowance = await wdogesContract.allowance(address, addresses[networkID].WDOGEs_ADDRESS);

//     return dispatch(
//       fetchAccountSuccess({
//         wrapping: {
//           dogeWrap: +wrapAllowance,
//           dogeUnwrap: +unwrapAllowance,
//         },
//       }),
//     );
//   },
// );

// export const changeWrap = createAsyncThunk(
//   "wrap/changeWrap",
//   async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }

//     const signer = provider.getSigner();
//     const wdogesContract = new ethers.Contract(addresses[networkID].WDOGEs_ADDRESS as string, wDOGEs, signer) ;

//     let wrapTx;
//     let uaData: IUAData = {
//       address: address,
//       value: value,
//       approved: true,
//       txHash: null,
//       type: null,
//     };
//     try {
//       if (action === "wrap") {
//         uaData.type = "wrap";
//         wrapTx = await wdogesContract.wrap(ethers.utils.parseUnits(value, "gwei"));
//       } else {
//         uaData.type = "unwrap";
//         wrapTx = await wdogesContract.unwrap(ethers.utils.parseUnits(value));
//       }
//       const pendingTxnType = action === "wrap" ? "wrapping" : "unwrapping";
//       uaData.txHash = wrapTx.hash;
//       dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: pendingTxnType }));
//       await wrapTx.wait();
//     } catch (e: unknown) {
//       uaData.approved = false;
//       const rpcError = e as IJsonRPCError;
//       if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
//         dispatch(
//           error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
//         );
//       } else {
//         dispatch(error(rpcError.message));
//       }
//       return;
//     } finally {
//       if (wrapTx) {
//         segmentUA(uaData);

//         dispatch(clearPendingTxn(wrapTx.hash));
//       }
//     }
//     dispatch(getBalances({ address, networkID, provider }));
//   },
// );
