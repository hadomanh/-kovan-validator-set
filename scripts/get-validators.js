const { ethers } = require("hardhat");

async function main() {
    const RelayedOwnedSet = await ethers.getContractFactory("RelayedOwnedSet");
    const relayedOwnedSet = await RelayedOwnedSet.attach('0xd84444316304eA1a5d84E883a245221Ec13f666b');

    console.log(await relayedOwnedSet.getValidators());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
