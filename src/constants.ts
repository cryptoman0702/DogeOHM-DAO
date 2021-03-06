export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/cryptoman0702/doge-protocol";
export const EPOCH_INTERVAL = 9600; // ychm bsc net block 3s

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

export const TOKEN_DECIMALS = 9;

export const POOL_GRAPH_URLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

interface IPresaleAddresses {
  [key: number]: string[];
}

export const presaleAddresses: IPresaleAddresses = {
  250: [
    "0x23dFf3DBFB35cF796A27F1765126FF2C677B7d4e",
    "0x773562B2Fdf0cC191b142713e37661f1ec24bebd",
    "0x33C65e2E89ffbA7EAA6C783dc57678FE51d3E9b3",
  ],
  56: [
    "0x0C0dc67fA972C4D28b102D623E00Aa4bB3b49c3d",
    "0x773562B2Fdf0cC191b142713e37661f1ec24bebd",
    "0x3d6eEa0E2d7dF05701c03E0150DD8b8257B890c1",
  ],
};
export const addresses: IAddresses = {
  56: { // ychm BSC
    DEAD_ADDRESS: "0x0000000000000000000000000000000000000000",
    BUSD_ADDRESS: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // ychm this address is used for presale and to get the token price
    DOGE_ADDRESS: "0x29C7f3e5876E0de90D1736eD6aD761BD360135Ae",
    DOGEs_ADDRESS: "0x88757DA24c844E187d43B74120e04b6667e6615B",
    LOTTERY_ADDRESS: "0x73A0d36B9ab7aF8194A112e2161D182767c34F42",
    STAKING_ADDRESS: "0x05D41f9844591d36085dF4B51E714F5042c73B25",
    STAKING_HELPER_ADDRESS: "0x3274cE71f04b730cE9e108B3e6648139F35b0C70",
    TREASURY_ADDRESS: "0x31d227aaFEA4CAB932c00BEf38Bb841250440e30",
    REDEEM_HELPER_ADDRESS: "0x7a71b91c59aA262Bc3DB8F77E8a905bABFa4ab0B",
    BONDINGCALC_ADDRESS: "0xE8Bc0e59701fa8CE235DC1835d0795024a5951e7",
    WARMINGUP_ADDRESS: "0x2B6A3e630b3b6440E0c63fBbbAc0618eF6cA1CDd", 

    LAST_DOGE_ADDRESS: "0x06df6e7686F8999430d63e10194664156F3aFC22",
    DISTRIBUTOR_ADDRESS: "0xf8368E9Be737004976fCEa9059De147d768ae125",
    WDOGEs_ADDRESS: "0x6d89207A1b21CF1A6036DFCD320A30d9Cd779c7D"
  },
  250: {  // ychm Fantom
    DAI_ADDRESS: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", // duplicate
    DOGE_ADDRESS: "0xAE280713f30942C5956eb0dA21F8feD0394af211",
    STAKING_ADDRESS: "0xa51c8576c6C4Af6A5EdF1Bf485284b63797fe409", // The new staking contract
    STAKING_HELPER_ADDRESS: "0x309E65aec68845447C3b9288276056a152862a42", // Helper contract used for Staking only
    DOGEs_ADDRESS: "0xBECe17fE60ea0c583AC350a48b1634cc74640F25",
    DISTRIBUTOR_ADDRESS: "0xf8368E9Be737004976fCEa9059De147d768ae125",
    BONDINGCALC_ADDRESS: "0xfbA30002C32E7e8d1Ff6f519e4f02B84bD839168",
    TREASURY_ADDRESS: "0xD55B096C7E268dF9d7d335f00a2FcaDf31774Cb3",
    REDEEM_HELPER_ADDRESS: "0x6786283a725D528f21963CA63688caA012B6e2E9",
    WDOGEs_ADDRESS: "0x6d89207A1b21CF1A6036DFCD320A30d9Cd779c7D"
  },
  4002: {
    WHITELIST_ADDRESS_MAIN: "0xcBe436BbD82420ed2F34a5253f1E98D81832b117",
    WHITELIST_ADDRESS_OG: "0xcBe436BbD82420ed2F34a5253f1E98D81832b117",
    DAI_ADDRESS: "",
  },
  4: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    DOGE_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    DOGEs_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
    WDOGEs_ADDRESS: "0xe73384f11Bb748Aa0Bc20f7b02958DF573e6E2ad",
    OLD_DOGEs_ADDRESS: "0x8Fc4167B0bdA22cb9890af2dB6cB1B818D6068AE",
    MIGRATE_ADDRESS: "0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b", // NEW
  },
  1: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    DOGE_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    DOGEs_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    WDOGEs_ADDRESS: "0xca76543cf381ebbb277be79574059e32108e3e65",
    OLD_DOGEs_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    ADOGE_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    CRUCIBLE_DOGE_LUSD: "0x2230ad29920D61A535759678191094b74271f373",
    LQTY: "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
    MIST: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
    FUSE_6_DOGEs: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
    FUSE_18_DOGEs: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Olympus Pool Party
    FUSE_36_DOGEs: "0x252d447c54F33e033AD04048baEAdE7628cB1274", // Fraximalist Money Market
    PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
  },
};
