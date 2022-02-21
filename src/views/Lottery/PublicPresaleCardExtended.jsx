/**
 * Code Written By: Jai
 */

import { Box, Card, Button, InputAdornment, TextField } from "@material-ui/core";
import CardHeader from "../../components/CardHeader/CardHeader";
import { useWeb3Context } from "../../hooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  getLotteryData, 
          checkContributionApproval,
          approveContribution,
          contribute
        } from "../../slices/LotterySlice";
import store from "../../store";
import { Skeleton } from "@material-ui/lab";
import { claim } from "src/slices/WhitelistSlice";

export function PublicPresaleCardExtended(props) {
  const { title } = props;
  const { provider, address, chainID } = useWeb3Context();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [hardCap, setHardCap] = useState(null);
  const [individualAllocation, setIndividualAllocation] = useState(null);
  const [fundsRaised, setFundsRaised] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [contributionRemaining, setContributionRemaining] = useState(null);
  const [amountContributed, setAmountContributed] = useState(null);
  const [amount, setAmount] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [isClaimable, setClaimable] = useState(null);
  const [maxBuy, setMaxBuy] = useState(null);
  const getData = async () => {
    await dispatch(getLotteryData({ address: address, networkID: chainID, provider: provider }));
  };
  const buy = async () =>
    await dispatch(
      contribute({ provider: provider, address: address, networkID: chainID, value: amount }),
    );
    const claim = async () =>
    await dispatch(
      claim({ provider: provider, address: address, networkID: chainID}),
    );
  const validateApproval = async () => {
    await dispatch(
      checkContributionApproval({ provider: provider, address: address, networkID: chainID }),
    );
  };
  const approve = async () => {
    await dispatch(
      approveContribution({ provider: provider, address: address, networkID: chainID }),
    );
  };
  useEffect(async () => {
     if (address) {
      
      await getData();
      await validateApproval();
      console.log(store.getState().lottery.status);
      setStatus(store.getState().lottery.status);
      setIndividualAllocation(store.getState().lottery.individualAllocation);
      setFundsRaised(store.getState().lottery.amountRaised);
      const startDate = new Date(0);
      startDate.setUTCSeconds(store.getState().lottery.presaleOpen);
      setStartDate(startDate);
      const endDate = new Date(0);
      endDate.setUTCSeconds(store.getState().lottery.presaleClose);
      setEndDate(endDate);
      setTimeRemaining(new Date());
      setContributionRemaining(store.getState().lottery.remainingContribution);
      setAmountContributed(store.getState().lottery.amountContributed);

      setMaxBuy(store.getState().lottery.remainingContribution);
      setApprovalStatus(store.getState().lottery.buyApproval);
      setClaimable(store.getState().lottery.isClaimable);
      
     }
    return () => {
      setStatus(null);
      setIndividualAllocation(null);
      setStartDate(null);
      setEndDate(null);
      setTimeRemaining(null);
      setContributionRemaining(null);
      setAmountContributed(null);
      setMaxBuy(null);
      setApprovalStatus(null);
      setClaimable(null);
    };
  }, [timeRemaining, address]);
  return (
    <Card className="doge-card">
      <Box display="flex">
        <CardHeader title={title} />
      </Box>
      <Box>
        <div className="card-layout">
          <span>Status:</span>
          <span className="span-colour">
            {status === null ? <Skeleton variant="text" width={"100px"} /> : <b>{status ? "Open" : "Closed"}</b>}
          </span>
        </div>
        
        <div className="card-layout">
          <span>Lottery Open:</span>
          <span className="span-colour">
            {startDate === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>{startDate.toLocaleString("en-GB", { hour12: false })}</b>
            )}
          </span>
        </div>
        <div className="card-layout">
          <span>Lottery Close:</span>
          <span className="span-colour">
            {endDate === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>{endDate.toLocaleString("en-GB", { hour12: false })}</b>
            )}
          </span>
        </div>
        <div className="card-layout">
          <span>Time Remaining:</span>
          <span className="span-colour">
            {timeRemaining === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>
              {
              startDate - timeRemaining <0?
              ( endDate - timeRemaining < 0
                  ? 0 + "h " + 0 + "m " + 0 + "s"
                  : Math.floor((endDate-timeRemaining) / (1000 * 60 * 60)).toLocaleString() +
                    "h " +
                    Math.floor(((endDate-timeRemaining) / (1000 * 60)) % 60).toLocaleString() +
                    "m " +
                    Math.floor(((endDate-timeRemaining) / 1000) % 60).toLocaleString() +
                    "s"):(( startDate - timeRemaining < 0
                      ? 0 + "h " + 0 + "m " + 0 + "s"
                      : Math.floor((startDate-timeRemaining) / (1000 * 60 * 60)).toLocaleString() +
                        "h " +
                        Math.floor(((startDate-timeRemaining) / (1000 * 60)) % 60).toLocaleString() +
                        "m " +
                        Math.floor(((startDate-timeRemaining) / 1000) % 60).toLocaleString() +
                        "s"))
                }
              </b>
            )}
          </span>
        </div>
        <div className="card-layout"/>
        <div className="card-layout">
          <span>Individual Allocation:</span>
          <span className="span-colour">
            {individualAllocation === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>{(individualAllocation / 10 ** 9).toString() + " DOGE"}</b>
            )}
          </span>
        </div>
        <div className="card-layout">
          <span>Remaining Contribution:</span>
          <span className="span-colour">
            {contributionRemaining === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>{(contributionRemaining / 10 ** 9).toString() + " DOGE"}</b>
            )}
          </span>
        </div>
        <div className="card-layout">
          <span>Amount Contributed:</span>
          <span className="span-colour">
            {amountContributed === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>{(amountContributed / 10 ** 9).toString() + " DOGE"}</b>
            )}
          </span>
        </div>
        <div className="card-layout">
          <span>Total Deposits:</span>
          <span className="span-colour">
            {fundsRaised === null ? (
              <Skeleton variant="text" width={"100px"} />
            ) : (
              <b>{(fundsRaised / 10 ** 9).toString() + " DOGE"}</b>
            )}
          </span>
        </div>
        <div className="card-layout"/>
        <div className="card-layout">
          <span>Chance to win:</span>
          <span className="span-colour">
            <b>{fundsRaised == 0 || fundsRaised === null ? (<Skeleton variant="text" width={"100px"} />):((amountContributed * 100 / fundsRaised).toString() + "%")}</b>
          </span>
        </div>
        {/* <div className="card-layout">
          <span>Prize in budget:</span>
          <span className="reward-colour">
          <Skeleton variant="text" width={"100px"} />
          </span>
        </div> */}
        { !status && 
          <div className="card-layout">
            <span>Winner Wallet:</span>
            <span className="reward-colour">
            <Skeleton variant="text" width={"100px"} />
            </span>
          </div>
        }
      </Box>
      <div className="card-layout" />
      <div className="card-layout" />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            style={{ maxWidth: "330px" }}
            id="outlined-number"
            label="Amount (Ticket)"
            type="number"
            variant="outlined"
            value={amount ? amount : ""}
            disabled={!status || !approvalStatus || store.getState().lottery.amountContributed === store.getState().lottery.individualAllocation }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    style={{
                      maxWidth: "60px",
                      maxHeight: "25px",
                      minWidth: "60px",
                      minHeight: "25px",
                    }}
                    className="presale-button"
                    variant="outlined"
                    color=""
                    size="small"
                    disabled={
                      !status || !approvalStatus ||
                      store.getState().lottery.amountContributed === store.getState().lottery.individualAllocation 
                    }
                    onClick={() => setAmount(maxBuy)}
                  >
                    Max
                  </Button>
                </InputAdornment>
              ),
            }}
            onChange={e =>
              setAmount((e.target.value.toString()).toLocaleString("fullwide", { useGrouping: false }))
            }
          />
        </div>
        <div className="whitelist-button">
          {approvalStatus ? (
            <Button
              className="presale-button"
              variant="contained"
              color="primary"
              size="large"
              disabled={
                !status ||
                store.getState().lottery.amountContributed === store.getState().lottery.individualAllocation 
              }
              onClick={() => {
                if (amount && amount > 0) buy();
              }}
            >
              Contribute
            </Button>
          ) : (
            <Button
              className="presale-button"
              variant="contained"
              color="primary"
              size="large"
              disabled={
                !status ||
                store.getState().lottery.amountContributed === store.getState().lottery.individualAllocation 
              }
              onClick={() => {
                approve();
              }}
            >
              Approve
            </Button>
          )}
          {isClaimable ? (
            <Button
              className="presale-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
               claim();
              }}
            >
              Claim
            </Button>
          ) : (<></>)}
        </div>
      </Box>
    </Card>
  );
}

export default PublicPresaleCardExtended;
