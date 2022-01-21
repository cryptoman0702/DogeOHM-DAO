/**
 * Code Written By: Jai 6969
 */

import { Box, Button, Card } from "@material-ui/core";
import CardHeader from "../../components/CardHeader/CardHeader";
import { useWeb3Context } from "../../hooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { claim, getWhitelistData, getWhitelistEligibility } from "../../slices/WhitelistSlice";
import store from "../../store";
import { Skeleton } from "@material-ui/lab";

function ClaimCard(props) {
  const { contract } = props;
  const { provider, address, chainID } = useWeb3Context();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
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
  const claimTokens = async () =>
    await dispatch(claim({ provider: provider, address: address, networkID: chainID, contract: contract }));
  useEffect(async () => {
    if (address) {
      await getData();
      setStatus(store.getState().whitelist.claimOpen);
      setTimeRemaining(new Date());
    }
    return () => {
      setStatus(null);
      setTimeRemaining(null);
    };
  }, [timeRemaining, address]);
  useEffect(async () => {
    await getEligibility();
    //if (contract === 0) setEligibility(store.getState().whitelist.mainEligibility);
    //else if (contract === 0) setEligibility(store.getState().whitelist.ogEligibility);
    //else
      setEligibility(true);
  }, [eligibility]);
  return (
    <Card className="dohm-card">
      <Box display="flex">
        <CardHeader title="Claim" />
      </Box>
      <div className="card-layout">
        <span>Claim Status:</span>
        <span className="span-colour">
          {status === null ? <Skeleton variant="text" width={"100px"} /> : <b>{status ? "Open" : "Closed"}</b>}
        </span>
      </div>
      <Box>
        <div className="whitelist-button">
          <Button
            className="presale-button"
            variant="contained"
            color="primary"
            size="large"
            //disabled={!status || !eligibility}
            onClick={() => {
              claimTokens();
            }}
          >
            Claim
          </Button>
        </div>
      </Box>
    </Card>
  );
}

export default ClaimCard;
