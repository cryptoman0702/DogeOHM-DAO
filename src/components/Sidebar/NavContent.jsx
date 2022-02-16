import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as LotteriesIcon } from "../../assets/icons/lotteries.svg";
import { ReactComponent as CasinoIcon } from "../../assets/icons/casino.svg";
import { ReactComponent as NFTSIcon } from "../../assets/icons/NFTS.svg";
import { ReactComponent as AirdropIcon } from "../../assets/icons/airdrop.svg";

import { ReactComponent as SaleIcon } from "../../assets/icons/coin.svg";
import logo from "../../assets/Doge_Dark.png";
import { Trans } from "@lingui/macro";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { chainID } = useWeb3Context();
  const { bonds } = useBonds(chainID);

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    // if (currentPath.indexOf("home") >= 0 && page === "home") {
    //   return true;
    // }
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    if (currentPath.indexOf("casino") >= 0 && page === "casino") {
      return true;
    }
    if (currentPath.indexOf("NFTS") >= 0 && page === "NFTS") {
      return true;
    }
    if (currentPath.indexOf("airdrop") >= 0 && page === "airdrop") {
      return true;
    }
    if (currentPath.indexOf("lotteries") >= 0 && page === "lotteries") {
      return true;
    }
    if (currentPath.indexOf("presale") >= 0 && page === "presale") {
      return true;
    }
    if (currentPath.indexOf("public") >= 0 && page === "public") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <img className="mainlogo" width="50%" height="100%" src={logo} alt="Logo" href="/dashboard"/>
            {address && (
              <div className="wallet-link">
                <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>
          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
               {/* <Link
                component={NavLink}
                id="home-nav"
                to="/home"
                isActive={(match, location) => {
                  return checkPage(match, location, "home");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6" >
                  <SvgIcon component={HomeIcon} />
                  <Trans>Home</Trans>
                </Typography>
              </Link> */}
              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6" >
                  <SvgIcon component={DashboardIcon} />
                  <Trans>Dashboard</Trans>
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="stake-nav"
                to="/stake"
                isActive={(match, location) => {
                  return checkPage(match, location, "stake");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon component={StakeIcon} />
                  <Trans>Stake</Trans>
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon component={BondIcon} />
                  <Trans>Bond</Trans>
                </Typography>
              </Link>
              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <Typography variant="body2">
                    <Trans>Bond discounts</Trans>
                  </Typography>
                  {bonds.map((bond, i) => (
                    <Link component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>
                      {!bond.bondDiscount ? (
                        <Skeleton variant="text" width={"150px"} />
                      ) : (
                        <Typography variant="body2">
                          {bond.displayName}
                        
                          <span className="bond-pair-roi">
                            {!bond.isAvailable[chainID]
                              ? "Sold Out"
                              : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                          </span>
                        </Typography>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                component={NavLink}
                id="dash-nav"
                to="/casino"
                isActive={(match, location) => {
                  return checkPage(match, location, "casino");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6" >
                  <SvgIcon component={CasinoIcon} />
                  <Trans>Casino (comming)</Trans>
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="dash-nav"
                to="/NFTS"
                isActive={(match, location) => {
                  return checkPage(match, location, "NFTS");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6" >
                  <SvgIcon component={NFTSIcon} />
                  <Trans>NFTS (comming)</Trans>
                </Typography>
              </Link>
              {/* <Link
                component={NavLink}
                id="dash-nav"
                to="/airdrop"
                isActive={(match, location) => {
                  return checkPage(match, location, "airdrop");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6" >
                  <SvgIcon component={AirdropIcon} />
                  <Trans>Airdrop</Trans>
                </Typography>
              </Link> */}
              <Link
                component={NavLink}
                id="dash-nav"
                to="/lottery"
                isActive={(match, location) => {
                  return checkPage(match, location, "lotteries");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6" >
                  <SvgIcon component={LotteriesIcon} />
                  <Trans>Lottery</Trans>
                </Typography>
              </Link>
              {/* <Link
                component={NavLink}
                id="presale-nav"
                to="/presale"
                isActive={(match, location) => {
                  return checkPage(match, location, "presale");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon component={SaleIcon} viewBox="0 0 64 64" />
                  <Trans>Presale</Trans>
                </Typography>
              </Link> */}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank" >
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
