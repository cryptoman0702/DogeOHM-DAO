/**
 * Code Written By: Jai
 */

import { Zoom,Card } from "@material-ui/core";

import "./styles/Whitelist.scss";
import "./styles/Presale.scss";
import PublicPresaleCardExtended from "./PublicPresaleCardExtended";

function Lottery() {
  return (
    <Zoom in={true}>
      <div id="og-view">
        <div className="container">
          {/* <div className="og-container">
            <Card className="doge-card">
              <img src="lottery.png" height="480"/>
            </Card>
          </div> */}
          <PublicPresaleCardExtended title="Current Lottery" />
        </div>
      </div>
    </Zoom>
  );
}

export default Lottery;
