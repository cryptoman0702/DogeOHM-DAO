/**
 * Code Written By: Jai
 */

import { Zoom } from "@material-ui/core";

import "./styles/Whitelist.scss";
import ClaimCard from "./ClaimCard";
import ContributionCard from "./ContributionCard";
import PublicPresaleCardExtended from "./PublicPresaleCardExtended";

function PublicPresale() {
  return (
    <Zoom in={true}>
      <div id="og-view">
        <div className="container">
          <PublicPresaleCardExtended title="Public Presale" contract={2} />
          <div className="og-container">
            <ContributionCard contract={2} />
            <ClaimCard contract={2} />
          </div>
        </div>
      </div>
    </Zoom>
  );
}

export default PublicPresale;
