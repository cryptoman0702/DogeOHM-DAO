/**
 * Code Written By: Jai xD
 */

import { Box, Button, Card, InputAdornment, TextField } from "@material-ui/core";
import CardHeader from "../../components/CardHeader/CardHeader";
import {
  checkContributionApproval,
  approveContribution,
  contribute,
  getLotteryData,
} from "../../slices/LotterySlice";
import { useWeb3Context } from "../../hooks";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import store from "../../store";

function ContributionCard(props) {
  const { provider, address, chainID } = useWeb3Context();
  const [status, setStatus] = useState(null);
  const [amount, setAmount] = useState(null);
  const [maxBuy, setMaxBuy] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const dispatch = useDispatch();
  
  const getData = async () =>
    await dispatch(
      getLotteryData({
        address: address,
        networkID: chainID,
        provider: provider,
      }),
    );
  const buy = async () =>
    await dispatch(
      contribute({ provider: provider, address: address, networkID: chainID, value: amount }),
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
      // await validateApproval();
      // setStatus(store.getState().whitelist.status);
      // setMaxBuy(store.getState().whitelist.remainingContribution);
      // setApprovalStatus(store.getState().whitelist.buyApproval);
      // setTimeRemaining(new Date());
    }
    return () => {
      setStatus(null);
      setMaxBuy(null);
      setApprovalStatus(null);
      setTimeRemaining(null);
    };
  }, [timeRemaining, address]);
  return (
    <Card className="doge-card">
      <Box display="flex">
        <CardHeader title="Contribute" />
      </Box>
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
            label="Amount (BUSD)"
            type="number"
            variant="outlined"
            value={amount ? amount / 10 ** 18 : ""}
            disabled={!status}
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
                      !status ||
                      store.getState().lottery.amountContributed ===
                        store.getState().lottery.individualAllocation 
                    }
                    onClick={() => setAmount(maxBuy)}
                  >
                    Max
                  </Button>
                </InputAdornment>
              ),
            }}
            onChange={e =>
              setAmount((e.target.value.toString() * 10 ** 18).toLocaleString("fullwide", { useGrouping: false }))
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
        </div>
      </Box>
    </Card>
  );
}

export default ContributionCard;
