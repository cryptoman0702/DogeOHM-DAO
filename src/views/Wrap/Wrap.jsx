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
  SvgIcon,
  makeStyles,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { getDohmTokenImage, getTokenImage, trim, formatCurrency } from "../../helpers";
//import { changeApproval, changeWrap } from "../../slices/WrapThunk";
import "../Stake/stake.scss";
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

const DohmsImg = getTokenImage("dohms");
const dohmImg = getDohmTokenImage(16, 16);

const useStyles = makeStyles(theme => ({
  textHighlight: {
    color: theme.palette.highlight,
  },
}));

function Wrap() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const classes = useStyles();

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const DohmsPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const wDohmsPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const dohmsBalance = useSelector(state => {
    return state.account.balances && state.account.balances.dohms;
  });
  const wdohmsBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wdohms;
  });
  const wrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.dohmWrap;
  });
  const unwrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.dohmUnwrap;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(dohmsBalance);
    } else {
      setQuantity(wdohmsBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeWrap = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || Number(quantity) === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    if (
      action === "wrap" &&
      ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(dohmsBalance, "gwei"))
    ) {
      return dispatch(error("You cannot wrap more than your DOHMs balance."));
    }

    if (
      action === "unwrap" &&
      ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wdohmsBalance, "ether"))
    ) {
      return dispatch(error("You cannot unwrap more than your wDOHMs balance."));
    }

    await dispatch(changeWrap({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "dohms") return wrapAllowance > 0;
      if (token === "wdohms") return wrapAllowance > 0;
      return 0;
    },
    [wrapAllowance, unwrapAllowance],
  );

  const isAllowanceDataLoading = (wrapAllowance == null && view === 0) || (unwrapAllowance == null && view === 1);

  const isUnwrap = view === 1;
  const convertedQuantity = isUnwrap ? (quantity * wDohmsPrice) / DohmsPrice : (quantity * DohmsPrice) / wDohmsPrice;

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`dohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Wrap / Unwrap</Typography>
                <Link
                  className="migrate-dohms-button"
                  style={{ textDecoration: "none" }}
                  href="https://docs.olympusdao.finance/main/contracts/tokens#wdohms"
                  aria-label="wdohms-wut"
                  target="_blank"
                >
                  <Typography>wDOHMs</Typography> <SvgIcon component={InfoIcon} color="primary" />
                </Link>
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-DOHMs">
                      <Typography variant="h5" color="textSecondary">
                        DOHMs Price
                      </Typography>
                      <Typography variant="h4">
                        {DohmsPrice ? formatCurrency(DohmsPrice, 2) : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-index">
                      <Typography variant="h5" color="textSecondary">
                        Current Index
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} DOHM</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="wrap-wDOHMs">
                      <Typography variant="h5" color="textSecondary">
                        wDOHMs Price
                        <InfoTooltip
                          message={
                            "wDOHMs = DOHMs * index\n\nThe price of wDOHMs is equal to the price of DOHM multiplied by the current index"
                          }
                        />
                      </Typography>
                      <Typography variant="h4">
                        {wDohmsPrice ? formatCurrency(wDohmsPrice, 2) : <Skeleton width="150px" />}
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
                  <Typography variant="h6">Connect your wallet to wrap DOHMs</Typography>
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
                    >
                      <Tab label="Wrap" {...a11yProps(0)} />
                      <Tab label="Unwrap" {...a11yProps(1)} />
                    </Tabs>
                    <Box className="stake-action-row " display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      {address && !isAllowanceDataLoading ? (
                        !hasAllowance("dohms") && view === 0 ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 && (
                                <>
                                  First time wrapping <b>DOHMs</b>?
                                  <br />
                                  Please approve Olympus Dao to use your <b>DOHMs</b> for wrapping.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="dohm-input" variant="outlined" color="primary">
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
                        {address && hasAllowance("dohms") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "wrapping")}
                            onClick={() => {
                              onChangeWrap("wrap");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "wrapping", "Wrap DOHMs")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
                            onClick={() => {
                              onSeekApproval("dohms");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}
                          </Button>
                        )}
                      </TabPanel>

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        <Button
                          className="stake-button"
                          variant="contained"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "unwrapping")}
                          onClick={() => {
                            onChangeWrap("unwrap");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "unwrapping", "Unwrap DOHMs")}
                        </Button>
                      </TabPanel>
                    </Box>

                    {quantity && (
                      <Box padding={1}>
                        <Typography variant="body2" className={classes.textHighlight}>
                          {isUnwrap
                            ? `Unwrapping ${quantity} wDOHMs will result in ${trim(convertedQuantity, 4)} DOHMs`
                            : `Wrapping ${quantity} DOHMs will result in ${trim(convertedQuantity, 4)} wDOHMs`}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">Wrappable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(dohmsBalance, 4)} DOHMs</>}
                      </Typography>
                    </div>
                    <div className="data-row">
                      <Typography variant="body1">Unwrappable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wdohmsBalance, 4)} wDOHMs</>}
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

export default Wrap;
