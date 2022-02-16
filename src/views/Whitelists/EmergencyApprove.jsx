/**
 * Code Written By: Jai
 */

import { useWeb3Context } from "../../hooks";
import React from "react";
import { useDispatch } from "react-redux";
import { approveContribution } from "../../slices/WhitelistSlice";
import { Box, Button, Card } from "@material-ui/core";
import CardHeader from "../../components/CardHeader/CardHeader";

function EmergencyApprove(props) {
  const { contract } = props;
  const { provider, address, chainID } = useWeb3Context();
  const dispatch = useDispatch();
  const approve = async () => {
    await dispatch(
      approveContribution({ provider: provider, address: address, networkID: chainID, contract: contract }),
    );
  };
  return (
    <Card className="doge-card">
      <Box display="flex">
        <CardHeader title="Manual Approval" />
      </Box>
      <span>Only useful if you're having troubles contributing.</span>
      <div style={{ minWidth: "320px" }} className="card-layout">
        <Box>
          <Button
            style={{ minWidth: "308px" }}
            className="presale-button"
            variant="contained"
            color="primary"
            size="large"
            disabled={!address}
            onClick={() => {
              approve();
            }}
          >
            Approve
          </Button>
        </Box>
      </div>
    </Card>
  );
}

export default EmergencyApprove;
