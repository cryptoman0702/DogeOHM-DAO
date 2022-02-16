import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  Divider,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getDogeTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";

import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DogesImg = getTokenImage("doges");
const dogeImg = getDogeTokenImage(16, 16);
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}
function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const dogeBalance = useSelector(state => {
    return state.account.balances && state.account.balances.doge;
  });
  const oldDogesBalance = useSelector(state => {
    return state.account.balances && state.account.balances.olddoges;
  });
  const dogesBalance = useSelector(state => {
    return state.account.balances && state.account.balances.doges;
  });
  const fdogesBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fdoges;
  });
  const wdogesBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wdoges;
  });
  const wdogesAsDoges = useSelector(state => {
    return state.account.balances && state.account.balances.wdogesAsDoges;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.dogeStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.dogeUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(dogeBalance);
    } else {
      setQuantity(dogesBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }
    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");

    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(dogeBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your DOGE balance.`));
    }
    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(dogesBalance, "gwei"))) {
      return dispatch(error(t`You cannot unstake more than your DOGEs balance.`));
    }
    
    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };
  
  const hasAllowance = useCallback(
    token => {
      if (token === "doge") return stakeAllowance > 0;
      if (token === "doges") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [dogesBalance, fdogesBalance, wdogesAsDoges]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  
  let trimmedStakingAPY = trim(stakingAPY * 100, 1);
  if ( stakingAPY != undefined) {
    trimmedStakingAPY = trim(toFixed(stakingAPY * 100), 1);
    console.log("stakingAPY",toFixed(stakingAPY));
  }
  //console.log("trimmedStakingAPY", trimmedStakingAPY);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`doge-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Single Stake (3, 3)</Typography>
                <RebaseTimer />

                {address && oldDogesBalance > 0.01 && (
                  <Link
                    className="migrate-doges-button"
                    style={{ textDecoration: "none" }}
                    href="https://docs.olympusdao.finance/using-the-website/migrate"
                    aria-label="migrate-doges"
                    target="_blank"
                  >
                    <NewReleases viewBox="0 0 24 24" />
                    <Typography>
                      <Trans>Migrate DOGEs!</Trans>
                    </Typography>
                  </Link>
                )}
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="baseline">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>APY</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? (
                          <span style={{overflowWrap: "anywhere"}} data-testid="apy-value">
                            {(trimmedStakingAPY)}%
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="apy-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Total Value Deposited</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          <span data-testid="tvl-value">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            }).format(stakingTVL)}
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="tvl-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Current Index</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? (
                          <span data-testid="index-value">{trim(currentIndex, 1)} DOGE</span>
                        ) : (
                          <Skeleton width="150px" data-testid="index-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake DOGE</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed && { style: { display: "none" } }}
                    >
                      <Tab
                        label={t({
                          id: "Stake",
                          comment: "The action of staking (verb)",
                        })}
                        {...a11yProps(0)}
                      />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>
                    <Box className="stake-action-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("doge") && view === 0) || (!hasAllowance("doges") && view === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  <Trans>First time staking</Trans> <b>DOGE</b>?
                                  <br />
                                  <Trans>Please approve DOGE to use your</Trans> <b>DOGE</b>{" "}
                                  <Trans>for staking</Trans>.
                                </>
                              ) : (
                                <>
                                  <Trans>First time unstaking</Trans> <b>DOGEs</b>?
                                  <br />
                                  <Trans>Please approve DOGE to use your</Trans> <b>DOGEs</b>{" "}
                                  <Trans>for unstaking</Trans>.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="doge-input" variant="outlined" color="primary">
                            <InputLabel htmlFor="amount-input"></InputLabel>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              onChange={e => setQuantity(e.target.value)}
                              labelWidth={0}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} color="inherit">
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("doge") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "staking")}
                            onClick={() => {
                              onChangeStake("stake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", t`Stake DOGE`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("doge");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", t`Approve`)}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("doges") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", t`Unstake DOGE`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("doges");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">
                        <Trans>Unstaked Balance</Trans>
                      </Typography>
                      <Typography variant="body1" id="user-balance">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(dogeBalance, 4)} DOGE</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">
                        <Trans>Staked Balance</Trans>
                      </Typography>
                      <Typography variant="body1" id="user-staked-balance">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} DOGEs</>}
                      </Typography>
                    </div>

                    {/* <div className="data-row" style={{ paddingLeft: "10px" }}>
                      <Typography variant="body2" color="textSecondary">
                        <Trans>Single Staking</Trans>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(dogesBalance, 4)} DOGEs</>}
                      </Typography>
                    </div>

                    <div className="data-row" style={{ paddingLeft: "10px" }}>
                      <Typography variant="body2" color="textSecondary">
                        <Trans>Staked Balance in Fuse</Trans>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fdogesBalance, 4)} fDOGEs</>}
                      </Typography>
                    </div>

                    <div className="data-row" style={{ paddingLeft: "10px" }}>
                      <Typography variant="body2" color="textSecondary">
                        <Trans>Wrapped Balance</Trans>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wdogesBalance, 4)} wDOGEs</>}
                      </Typography>
                    </div>

                    <Divider color="secondary" /> */}

                    <div className="data-row">
                      <Typography variant="body1">
                        <Trans>Next Reward Amount</Trans>
                      </Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} DOGEs</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">
                        <Trans>Next Reward Yield</Trans>
                      </Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">
                        <Trans>ROI (5-Day Rate)</Trans>
                      </Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Stake;
