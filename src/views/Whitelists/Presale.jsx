/**
 * Code Written By: Jai
 */

import { Zoom } from "@material-ui/core";
import WhitelistPresaleCard from "./WhitelistPresaleCard";

import "./styles/Presale.scss";
import PublicPresaleCard from "./PublicPresaleCard";

function Presale() {
  return (
    <Zoom in={true}>
      <div id="presale-view">
        <div className="h1">Current Presale</div>
        <div className="container">
          <WhitelistPresaleCard title="Main Whitelist" whitelist="/mainwhitelist" contract={0} />
          {/* <WhitelistPresaleCard title="OG Whitelist" whitelist="/ogwhitelist" contract={1} /> */}
          <PublicPresaleCard title="Public Presale" whitelist="/public" contract={2} />
        </div>
      </div>
    </Zoom>
  );
}

export default Presale;
