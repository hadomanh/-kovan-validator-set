const { ethers } = require("hardhat");

async function main() {
    const [ deployer, relay1, relay2 ] = await ethers.getSigners();

    const RelayedOwnedSet = await ethers.getContractFactory("RelayedOwnedSet");
    const relayedOwnedSet = await RelayedOwnedSet.attach('0x9c76603cC0Be6E5912aa8d7248774e3A6D874A49');

    const RelaySet = await ethers.getContractFactory("RelaySet");
    const relaySet = await RelaySet.attach('0xE2De1edaDd96A3C17d23FD54faA817b722b34C7a');

    await relaySet.finalizeChange();

    await relayedOwnedSet.addValidator(relay1.address);
    await relaySet.finalizeChange();
    await relayedOwnedSet.addValidator(relay2.address);
    await relaySet.finalizeChange();

    console.log(await relayedOwnedSet.getValidators());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
