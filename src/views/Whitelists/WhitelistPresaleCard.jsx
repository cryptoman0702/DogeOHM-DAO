/**
 * Code Written By: Jai
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Card } from "@material-ui/core";
import CardHeader from "../../components/CardHeader/CardHeader";
import { getWhitelistData, getWhitelistEligibility } from "../../slices/WhitelistSlice";
import { useWeb3Context } from "../../hooks";
import { useDispatch } from "react-redux";

import store from "../../store";
import { Skeleton } from "@material-ui/lab";

export function WhitelistPresaleCard(props) {
  const { title, whitelist, contract } = props;
  const { provider, address, chainID } = useWeb3Context();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [hardCap, setHardCap] = useState(null);
  const [individualAllocation, setIndividualAllocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [fundsRaised, setFundsRaised] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const getEligibility = async () => {
    await dispatch(
      getWhitelistEligibility({
        address: address,
        networkID: chainID,
        provider: provider,
        contract: contract,
      }),
    );
  };
  const getData = async () =>
    await dispatch(getWhitelistData({ address: address, networkID: chainID, provider: provider, contract: contract }));
  useEffect(async () => {
    if (address) {
      await getData();
      setStatus(store.getState().whitelist.status);
      setHardCap(store.getState().whitelist.hardCap);
      setIndividualAllocation(store.getState().whitelist.individualAllocation);
      setFundsRaised(store.getState().whitelist.amountRaised);
      const startDate = new Date(0);
      startDate.setUTCSeconds(store.getState().whitelist.presaleOpen);
      setStartDate(startDate);
      const endDate = new Date(0);
      endDate.setUTCSeconds(store.getState().whitelist.presaleClose);
      setEndDate(endDate);
      setTimeRemaining(new Date());
    }
    return () => {
      setStatus(null);
      setHardCap(null);
      setIndividualAllocation(null);
      setFundsRaised(null);
      setStartDate(null);
      setEndDate(null);
      setTimeRemaining(null);
    };
  }, [timeRemaining, address]);
  useEffect(async () => {
    await getEligibility();
    console.log("ychm",store.getState().whitelist.eligibility);
    if (store.getState().whitelist.eligibility) setEligibility("Eligible");
    else setEligibility("Ineligible");
  }, [eligibility]);
  return (
    <Card className="dohm-card">
      <Box display="flex">
        <CardHeader title={title} />
      </Box>
      <div className="card-layout">
        <span>Status:</span>
        <span className="span-colour">
          {status === null ? <Skeleton variant="text" width={"100px"} /> : <b>{status ? "Open" : "Closed"}</b>}
        </span>
      </div>
      <div className="card-layout">
        <span>Hard Cap:</span>
        <span className="span-colour">
          {hardCap === null ? (
            <Skeleton variant="text" width={"100px"} />
          ) : (
            <b>{(hardCap / 10 ** 18).toString() + " BUSD"}</b>
          )}
        </span>
      </div>
      <div className="card-layout">
        <span>Individual Allocation:</span>
        <span className="span-colour">
          {individualAllocation === null ? (
            <Skeleton variant="text" width={"100px"} />
          ) : (
            <b>{(individualAllocation / 10 ** 18).toString() + " BUSD"}</b>
          )}
        </span>
      </div>
      <div className="card-layout">
        <span>Funds Raised:</span>
        <span className="span-colour">
          {fundsRaised === null ? (
            <Skeleton variant="text" width={"100px"} />
          ) : (
            <b>{(fundsRaised / 10 ** 18).toString() + " BUSD"}</b>
          )}
        </span>
      </div>
      <div className="card-layout">
        <span>Presale Open:</span>
        <span className="span-colour">
          {startDate === null ? (
            <Skeleton variant="text" width={"100px"} />
          ) : (
            <b>{startDate.toLocaleString("en-GB", { hour12: false })}</b>
          )}
        </span>
      </div>
      <div className="card-layout">
        <span>Presale Close:</span>
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
      <div className="card-layout" />
      <div className="card-layout">
        <span>Contribution Eligibility:</span>
        <span className="span-colour">
          {individualAllocation === null || eligibility === null ? (
            <Skeleton variant="text" width={"100px"} />
          ) : (
            <b>{eligibility}</b>
          )}
        </span>
      </div>
      <div className="card-layout">
        <span>Conversion Rate:</span>
        <span className="span-colour">100 BUSD : 1 DOHM</span>
      </div>
      <Link to={whitelist} style={{ textDecoration: "none" }}>
        <Button variant="outlined" color="secondary" className="view-button">
          Open
        </Button>
      </Link>
    </Card>
  );
}

export default WhitelistPresaleCard;
