import { ReactComponent as SpiritSwap } from "../../assets/icons/spiritswap.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { SvgIcon } from "@material-ui/core";
import { Trans } from "@lingui/macro";

const externalUrls = [
  {
    title: <Trans>Buy</Trans>,
    url: `https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x0083a5a7e25e0Ee5b94685091eb8d0A32DfF11D4`,
    icon: <SvgIcon color="primary" component={SpiritSwap} />,
  },
  {
    title: <Trans>Governance</Trans>,
    url: "",
    icon: <SvgIcon component={GovIcon} />,
  },
  {
    title: <Trans>Docs</Trans>,
    url: "https://dogeohmdao.gitbook.io/dogeohm-dao/",
    icon: <SvgIcon component={DocsIcon} />,
  },
];

export default externalUrls;
