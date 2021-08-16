// const Web3 = require("web3");
const axios = require("axios");
const lodash = require("lodash");
const web3 = new Web3(
  new Web3.providers.HttpProvider("https://exchaintestrpc.okex.org")
);
const cTokenList = [
  {
    currency: "USDK",
    tokenContract: "0x533367b864d9b9aa59d0dcb6554df0c89feef1ff",
    cTokenContract: "0x73761a92465739E070CecBf90994be75AfbA6a9d",
  },
  {
    currency: "BTCK",
    tokenContract: "0x09973e7e3914eb5ba69c7c025f30ab9446e3e4e0",
    cTokenContract: "0xBfB7432c1B6a1937B87D25531c316aedF812c3F9",
  },
  {
    currency: "OKT",
    tokenContract: "0x2219845942d28716c0F7C605765fABDcA1a7d9E0",
    cTokenContract: "0x6239c8f786E077330284474560aBa434410d32E3",
  },
  {
    currency: "OKB",
    tokenContract: "0xda9d14072ef2262c64240da3a93fea2279253611",
    cTokenContract: "0x716b78d0508b4275f0131aD0C505CEB42160f1e3",
  },
  {
    currency: "ETHK",
    tokenContract: "0xdf950cecf33e64176ada5dd733e170a56d11478e",
    cTokenContract: "0x71DE41a3bfBCbaEA401c33787B6EaB8A746D07bF",
  },
  {
    currency: "DOTK",
    tokenContract: "0x72f8fa5da80dc6e20e00d02724cf05ebd302c35f",
    cTokenContract: "0x9165a2A1c01Ee99d9E8ee15A29766A26F2729219",
  },
  {
    currency: "LTCK",
    tokenContract: "0xd616388f6533b6f1c31968a305fbee1727f55850",
    cTokenContract: "0x806bB603E8E10b4fFA8f064c88B940F11A61C1F8",
  },
];
var url = "https://www.oklink.com/api/explorer/v1/okexchain_test/addresses/";
var limit = 10;
var cTokenAddress = [];
async function getAddress(address, index, offset = 0) {
  const response = await axios.get(url + address + "/transactions/condition", {
    params: {
      offset: offset * limit,
      limit: limit,
      tokenType: "OIP20",
    },
  });
  const res = response.data.data;
  const total = res.total;
  const hits = res.hits;

  if (hits.length === 0) {
    return;
  }
  if (hits.length > 0) {
    if (lodash.isEmpty(cTokenAddress[index])) {
      cTokenAddress[index] = {};
      cTokenAddress[index][address.toLowerCase()] = [];
    }
    hits.forEach((item) => {
      if (
        !cTokenAddress[index][address.toLowerCase()].includes(
          item.fromEvmAddress.toLowerCase()
        )
      ) {
        cTokenAddress[index][address.toLowerCase()].push(
          item.fromEvmAddress.toLowerCase()
        );
      }
    });
    offset = offset + 1;
    getAddress(address, index, offset);
  } else {
    return true;
  }
}
async function getAddressPromise() {
  const promiseList = [];
  cTokenList.forEach((item, index) => {
    const cTokenAddressList = getAddress(item.cTokenContract, index, 0);
    promiseList.push(cTokenAddressList);
  });
  Promise.all(promiseList).then((res) => {
    console.log(cTokenAddress, "addressList========");
  });
}
getAddressPromise();
