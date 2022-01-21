import { memo } from "react";
import "./treasury-dashboard.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { MarketCap, DOHMPrice, WDOHMSPrice, CircSupply, BackingPerDOHM, CurrentIndex } from "./components/Metric/Metric";
import { motion } from "framer-motion";

import {
  TotalValueDepositedGraph,
  MarketValueGraph,
  RiskFreeValueGraph,
  ProtocolOwnedLiquidityGraph,
  DOHMStakedGraph,
  APYOverTimeGraph,
  RunwayAvailableGraph,
} from "./components/Graph/Graph";

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <motion.div>
      <div
        id="treasury-dashboard-view"
        className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}
      >
        <Container
          style={{
            paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
            paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          }}
        >
          <Box className="hero-metrics">
            <Paper className="dohm-card">
              <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                <MarketCap />
                <DOHMPrice />
                <WDOHMSPrice />
                <CircSupply />
                <BackingPerDOHM />
                <CurrentIndex />
              </Box>
            </Paper>
          </Box>

          {/* <Zoom in={true}>
            <Grid container spacing={2} className="data-grid">
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card dohm-chart-card">
                  <TotalValueDepositedGraph />
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card dohm-chart-card">
                  <MarketValueGraph />
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card dohm-chart-card">
                  <RiskFreeValueGraph />
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card">
                  <ProtocolOwnedLiquidityGraph />
                </Paper>
              </Grid>

              <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="dohm-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={["holders"]}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data && data[0].holders}`}
                  bulletpointColors={bulletpoints.holder}
                  itemNames={tooltipItems.holder}
                  itemType={""}
                  infoTooltipMessage={tooltipInfoMessages.holder}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card">
                  <DOHMStakedGraph />
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card">
                  <APYOverTimeGraph />
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="dohm-card">
                  <RunwayAvailableGraph />
                </Paper>
              </Grid>
            </Grid>
          </Zoom> */}
        </Container>
      </div>
    </motion.div>
  );
});

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <TreasuryDashboard />
  </QueryClientProvider>
);
