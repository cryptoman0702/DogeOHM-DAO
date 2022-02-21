import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as DogesTokenImg } from "../../assets/tokens/token_DOGEs.svg";
import { ReactComponent as wDogesTokenImg } from "../../assets/tokens/token_wDOGEs.svg";
import { ReactComponent as dogeTokenImg } from "../../assets/tokens/token_DOGE.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";
//import { ReactComponent as DogeImg } from "../../assets/Doge_Dark.svg";

import "./dogemenu.scss";
import { dai, frax } from "src/helpers/AllBonds";
import { Trans } from "@lingui/macro";
import { useWeb3Context } from "../../hooks/web3Context";

import DogeImg from "src/assets/tokens/token_DOGE.svg";
import DogeSImg from "src/assets/tokens/token_DOGEs.svg";
import WDogesImg from "src/assets/tokens/token_wDOGEs.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import { segmentUA } from "../../helpers/userAnalyticHelpers";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "DOGE":
        tokenPath = DogeImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "wDOGEs":
        tokenPath = WDogesImg;
        tokenDecimals = 18;
        break;
      default:
        tokenPath = DogeSImg;
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

function DogeMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID, address } = useWeb3Context();

  const networkID = chainID;

  // const DOGEs_ADDRESS = addresses[networkID].DOGEs_ADDRESS;
  // const DOGE_ADDRESS = addresses[networkID].DOGE_ADDRESS;
  // const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;
  // const WDOGEs_ADDRESS = addresses[networkID].WDOGEs_ADDRESS;
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "doge-popper";
  // const daiAddress = dai.getAddressForReserve(networkID);
  // const fraxAddress = frax.getAddressForReserve(networkID);
  return (
    // <Box
    //   component="div"
    //   onMouseEnter={e => handleClick(e)}
    //   onMouseLeave={e => handleClick(e)}
    //   id="doge-menu-button-hover"
    // >
    //   <Button id="doge-menu-button" size="large" variant="contained" color="secondary" title="DOGE" aria-describedby={id}>
    //     <SvgIcon component={InfoIcon} color="primary" />
    //     <Typography>DOGE</Typography>
    //   </Button>

    //   <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
    //     {({ TransitionProps }) => {
    //       return (
    //         <Fade {...TransitionProps} timeout={100}>
    //           <Paper className="doge-menu" elevation={1}>
    //             <Box component="div" className="buy-tokens">
    //               <Link
    //                 // href={`https://swap.spiritswap.finance/#/exchange/swap?inputCurrency=${fraxAddress}&outputCurrency=${DOGE_ADDRESS}`}
    //                 href={`https://pancakeswap.finance/swap?inputCurrency=0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E&outputCurrency=0x0083a5a7e25e0Ee5b94685091eb8d0A32DfF11D4`}
    //                 target="_blank"
    //                 rel="noreferrer"
    //               >
    //                 <Button size="large" variant="contained" color="secondary" fullWidth>
    //                   <Typography align="left">
    //                     <Trans>Buy on PancakeSwap</Trans>
    //                     <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
    //                   </Typography>
    //                 </Button>
    //               </Link>
    //             </Box>
                
    //           </Paper>
    //         </Fade>
    //       );
    //     }}
    //   </Popper>
    // </Box>
    <></>
  );
}

export default DogeMenu;
