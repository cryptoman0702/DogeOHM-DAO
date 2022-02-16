import { useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { trim, formatCurrency } from "../../../../helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";

export const Metric = props => <Box className={`metric ${props.className}`}>{props.children}</Box>;

Metric.Value = props => <Typography variant="h5">{props.children || <Skeleton type="text" />}</Typography>;

Metric.Title = props => (
  <Typography variant="h6" color="textSecondary">
    {props.children}
  </Typography>
);

export const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap);

  return (
    <Metric className="market">
      <Metric.Title>Market Cap</Metric.Title>
      <Metric.Value>{marketCap && formatCurrency(marketCap, 0)}</Metric.Value>
    </Metric>
  );
};

export const DOGEPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);

  return (
    <Metric className="price">
      <Metric.Title>DOGE Price</Metric.Title>
      <Metric.Value>{marketPrice && formatCurrency(marketPrice, 2)}</Metric.Value>
    </Metric>
  );
};

export const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);

  const isDataLoaded = circSupply && totalSupply;

  return (
    <Metric className="circ">
      <Metric.Title>Circulating Supply (total)</Metric.Title>
      <Metric.Value>{isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}</Metric.Value>
    </Metric>
  );
};

export const BackingPerDOGE = () => {
  const backingPerDoge = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);

  return (
    <Metric className="bpo">
      <Metric.Title>Backing per DOGE</Metric.Title>
      <Metric.Value>{!isNaN(backingPerDoge) && formatCurrency(backingPerDoge, 2)}</Metric.Value>
    </Metric>
  );
};

export const CurrentIndex = () => {
  const currentIndex = useSelector(state => state.app.currentIndex);

  return (
    <Metric className="index">
      <Metric.Title>
        Current Index
        <InfoTooltip message="The current index tracks the amount of DOGEs accumulated since the beginning of staking. Basically, how much DOGEs one would have if they staked and held a single DOGEs from day 1." />
      </Metric.Title>
      <Metric.Value>{currentIndex && trim(currentIndex, 2) + " DOGEs"}</Metric.Value>
    </Metric>
  );
};

export const WDOGEsPrice = () => {
  const wDogesPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);

  return (
    <Metric className="wsoprice">
      <Metric.Title>
        wDOGEs Price
        <InfoTooltip
          message={
            "wDOGEs = DOGEs * index\n\nThe price of wDOGEs is equal to the price of DOGEs multiplied by the current index."
          }
        />
      </Metric.Title>
      <Metric.Value>{wDogesPrice && formatCurrency(wDogesPrice, 2)}</Metric.Value>
    </Metric>
  );
};
