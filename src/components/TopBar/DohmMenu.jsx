import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as DohmsTokenImg } from "../../assets/tokens/token_DOHMs.svg";
import { ReactComponent as wDohmsTokenImg } from "../../assets/tokens/token_wDOHMs.svg";
import { ReactComponent as dohmTokenImg } from "../../assets/tokens/token_DOHM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";
import { ReactComponent as DogeImg } from "../../assets/Doge_Dark.svg";

import "./dohmmenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { Trans } from "@lingui/macro";
import { useWeb3Context } from "../../hooks/web3Context";

import DohmImg from "src/assets/tokens/token_DOHM.svg";
import DohmSImg from "src/assets/tokens/token_DOHMs.svg";
import WDohmsImg from "src/assets/tokens/token_wDOHMs.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import { segmentUA } from "../../helpers/userAnalyticHelpers";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "DOHM":
        tokenPath = DohmImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "wDOHMs":
        tokenPath = WDohmsImg;
        tokenDecimals = 18;
        break;
      default:
        tokenPath = DohmSImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function DohmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID, address } = useWeb3Context();

  const networkID = chainID;

  // const DOHMS_ADDRESS = addresses[networkID].DOHMS_ADDRESS;
  // const DOHM_ADDRESS = addresses[networkID].DOHM_ADDRESS;
  // const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;
  // const WDOHMS_ADDRESS = addresses[networkID].WDOHMS_ADDRESS;
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "dohm-popper";
  // const daiAddress = dai.getAddressForReserve(networkID);
  // const fraxAddress = frax.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="dohm-menu-button-hover"
    >
      <Button id="dohm-menu-button" size="large" variant="contained" color="secondary" title="DOHM" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>DOHM</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="dohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    // href={`https://swap.spiritswap.finance/#/exchange/swap?inputCurrency=${fraxAddress}&outputCurrency=${DOHM_ADDRESS}`}
                    href={`https://pancakeswap.finance/swap?inputCurrency=0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E&outputCurrency=0x0083a5a7e25e0Ee5b94685091eb8d0A32DfF11D4`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        <Trans>Buy on PancakeSwap</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>
                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>
                      <Trans>TOKEN COMING SOON</Trans>
                    </p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {/*DOHM_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("DOHM", DOHM_ADDRESS, address)}
                        >
                          {<SvgIcon
                            component={dohmTokenImg}
                            viewBox="0 0 32 32"
                            style={{ height: "25px", width: "25px" }}
                          />}
                          <Typography variant="body1">DOHM</Typography>
                        </Button>
                      ) */}
                      {/*DOHMS_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("DOHMs", DOHMS_ADDRESS, address)}
                        >
                          {<SvgIcon
                            component={dohmTokenImg}
                            viewBox="0 0 100 100"
                            style={{ height: "25px", width: "25px" }}
                          />}
                          <Typography variant="body1">Doge</Typography>
                        </Button>
                      ) */}
                      {/* {WDOHMS_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("wDOHMs", WDOHMS_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={wDohmsTokenImg}
                            viewBox="0 0 180 180"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">wDOHMs</Typography>
                        </Button>
                      )} */}
                      {/* {PT_TOKEN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={t33TokenImg}
                            viewBox="0 0 1000 1000"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1">33T</Typography>
                        </Button>
                      )} */}
                    </Box>
                  </Box>
                ) : null}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default DohmMenu;
