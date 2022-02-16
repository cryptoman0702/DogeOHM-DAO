import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom, SvgIcon } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { t, Trans } from "@lingui/macro";
import { motion } from "framer-motion";

import  { ReactComponent as CirculationImg } from "../../assets/icons/circulation.svg";
import  { ReactComponent as LotteryImg } from "../../assets/icons/lotterygiveaway.svg";
import  { ReactComponent as PriceImg } from "../../assets/icons/price.svg";
import  { ReactComponent as TreasuryBalImg } from "../../assets/icons/treasuryBal.svg";
import  { ReactComponent as TreasuryNFTImg } from "../../assets/icons/treasuryNFT.svg";
import  { ReactComponent as StakeImg } from "../../assets/icons/stakebal.svg";

function Dashboard() {
  // Use marketPrice as indicator of loading.
  const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  return (
    <div id="dashboard-view">
      <Grid container spacing={1} className="top-row-data">
        <Grid item lg={4} md={4} sm={5} xs={12}>
          <Zoom in={true}>
            <Paper className="doge-card">
              <SvgIcon component={CirculationImg} />
              <div>
              <Typography variant="h6">
                <Trans>Circulating Supply</Trans>
              </Typography>
              <Typography variant="h5">
                {isAppLoading ? (
                  <Skeleton width="250px" />
                ) : (
                  `${new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(circSupply)}
                    `
                )}
              </Typography>
              </div>
            </Paper>
          </Zoom>
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={5} className="olympus-card">
          <Zoom in={true}>
            <Paper className="doge-card">
              <SvgIcon component={PriceImg} />
              <div>
                <Typography variant="h6">
                  <Trans>DOGE Price</Trans>
                </Typography>
                <Typography variant="h5">
                  {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
                </Typography>
              </div>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item lg={4} md={4} sm={4} xs={7}>
          <Zoom in={true}>
            <Paper className="doge-card">
              <SvgIcon component={TreasuryBalImg} />
              <div>
                <Typography variant="h6">
                  <Trans>Treasury Balance</Trans>
                </Typography>
                <Typography variant="h5">
                  {isAppLoading ? (
                    <Skeleton width="160px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(marketCap)
                  )}
                </Typography>
              </div>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>
      {/* <Grid container spacing={1} className="top-row-data">
        <Grid item lg={4} md={4} sm={5} xs={12}>
          <Zoom in={true}>
            <Paper className="doge-card">
              <SvgIcon component={TreasuryNFTImg} />
              <div>
                <Typography variant="h6">
                  <Trans>Treasury NFTs</Trans>
                </Typography>
                <Typography variant="h5">
                  {isAppLoading ? (
                    <Skeleton width="250px" />
                  ) : (
                    `${new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(circSupply)}
                      `
                  )}
                </Typography>
              </div>
            </Paper>
          </Zoom>
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={5} className="olympus-card">
          <Zoom in={true}>
            <Paper className="doge-card">
              <SvgIcon component={LotteryImg} />
              <div>
                <Typography variant="h6">
                  <Trans>Total Lottery Giveaway</Trans>
                </Typography>
                <Typography variant="h5">
                  {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
                </Typography>
              </div>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item lg={4} md={4} sm={4} xs={7}>
          <Zoom in={true}>
            <Paper className="doge-card">
              <SvgIcon component={StakeImg} />
              <div>
                <Typography variant="h6">
                  <Trans>Defi Staking Balance</Trans>
                </Typography>
                <Typography variant="h5">
                  {isAppLoading ? (
                    <Skeleton width="160px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(marketCap)
                  )}
                </Typography>
              </div>
            </Paper>
          </Zoom>
        </Grid> 
      </Grid>*/}

      <Box className="main-data-area">
        <Grid container spacing={2} className="data-grid">
          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7"
                title="Total Value Staking"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff"
                title="Market value of Treasury"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/29153/58862/b6d18145-763a-48b6-ac4c-a8e43ec1c1f6"
                title="Risk Free Value of Treasury"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/29815/60140/0be45969-dfc2-4625-9b48-d7af19a45546"
                title="Total Value Staking"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/27661/55859/fd0e3db2-d033-4000-9f70-c65de52ef9a9"
                title="Holders"
              />
            </div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/34202/69216/17e353f6-ccb4-42ff-b6cb-150f69543f4d"
                title="APY Over Time"
              />
            </div>
          </Grid>

          <Grid item lg={6} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/28756/58813/c7893c75-d8f1-421e-85c3-556a22cd7885"
                title="DOGE Stakers"
              />
            </div>
          </Grid>

          <Grid item lg={6} sm={12}>
            <div className="dune-card">
              <iframe
                frameBorder="0"
                loading="lazy"
                src="https://duneanalytics.com/embeds/37326/74014/f0ad674a-2787-4314-b534-86dc1b910922"
                title="Runway Available"
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Dashboard;
