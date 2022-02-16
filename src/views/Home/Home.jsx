import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./home.scss";
import { Skeleton } from "@material-ui/lab";
import { t, Trans } from "@lingui/macro";
import { motion } from "framer-motion";
// import VideoPlayer from 'react-video-js-player';

function Home() {
  return (
    <div id="home-view">
    <Zoom in={true} onEntered={() => setZoomed(true)}>
      <Paper className={`doge-card`}>
      {/* <VideoPlayer
          controls={true}
          src={0}
          poster={this.state.video.poster}
          width="720"
          height="420"
          onReady={this.onPlayerReady.bind(this)}
      /> */}
      </Paper>
    </Zoom>
    </div>
  );
}

export default Home;
