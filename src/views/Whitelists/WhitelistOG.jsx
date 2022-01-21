/**
 * Code Written By: Jai
 */

import { Zoom } from "@material-ui/core";

import "./styles/Whitelist.scss";
import WhitelistPresaleCardExtended from "./WhitelistPresaleCardExtended";
import ContributionCard from "./ContributionCard";
import ClaimCard from "./ClaimCard";

function WhitelistOG() {
  return (
    <Zoom in={true}>
      <div id="og-view">
        <div className="container">
          <WhitelistPresaleCardExtended title="OG Whitelist" contract={1} />
          <div className="og-container">
            <ContributionCard contract={1} />
            <ClaimCard contract={1} />
          </div>
        </div>
      </div>
    </Zoom>
  );
}

export default WhitelistOG;
