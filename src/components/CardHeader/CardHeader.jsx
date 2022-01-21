import { Box, Typography } from "@material-ui/core";
// import "./cardheader.scss";

const CardHeader = ({ title, children }) => {
  return (
    <Box className={`card-header`}>
      <Typography variant="h4">{title}</Typography>
      {children}
    </Box>
  );
};

export default CardHeader;
