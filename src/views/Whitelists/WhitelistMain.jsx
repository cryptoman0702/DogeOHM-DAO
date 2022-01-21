/**
 * Code Written By: Jai
 */

import { Zoom } from "@material-ui/core";

import "./styles/Whitelist.scss";
import ClaimCard from "./ClaimCard";
import ContributionCard from "./ContributionCard";
import WhitelistPresaleCardExtended from "./WhitelistPresaleCardExtended";

function WhitelistMain() {
  return (
    <Zoom in={true}>
      <div id="og-view">
        <div className="container">
          <WhitelistPresaleCardExtended title="Main Whitelist" contract={0} />
          <div className="og-container">
            <ContributionCard contract={0} />
            <ClaimCard contract={0} />
          </div>
        </div>
      </div>
    </Zoom>
  );
}

export default WhitelistMain;
