const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deployContract(deployer) {

  const RelaySet = await ethers.getContractFactory("RelaySet");
  const relaySet = await RelaySet.deploy();

  await relaySet.deployed();

  const RelayedOwnedSet = await ethers.getContractFactory("RelayedOwnedSet");
  const relayedOwnedSet = await RelayedOwnedSet.deploy(relaySet.address, [deployer.address]);

  await relayedOwnedSet.deployed();

  await relaySet.setRelayed(relayedOwnedSet.address);

  return { relaySet, relayedOwnedSet };
}

describe("RelaySet", function () {
  // it("Should return the new greeting once it's changed", async function () {
  //   const Greeter = await ethers.getContractFactory("Greeter");
  //   const greeter = await Greeter.deploy("Hello, world!");
  //   await greeter.deployed();

  //   expect(await greeter.greet()).to.equal("Hello, world!");

  //   const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });

  it("Should deploy smart contract", async () => {
    const [ deployer ] = await ethers.getSigners();
    const { relaySet, relayedOwnedSet } = await deployContract(deployer);

    console.log("RelaySet deployed to:", relaySet.address);
    console.log("RelayedOwnedSet deployed to:", relayedOwnedSet.address);
  })

  it("Should add a new relay", async () => {
    const [ deployer, relay1, relay2 ] = await ethers.getSigners();
    const { relaySet, relayedOwnedSet } = await deployContract(deployer);

    await relaySet.connect(deployer).finalizeChange();

    await relayedOwnedSet.connect(deployer).addValidator(relay1.address);
    await relaySet.connect(deployer).finalizeChange();
    await relayedOwnedSet.connect(deployer).addValidator(relay2.address);
    await relaySet.connect(deployer).finalizeChange();
    
    console.log(await relayedOwnedSet.getValidators());

    await relayedOwnedSet.connect(deployer).removeValidator(relay1.address);
    await relaySet.connect(deployer).finalizeChange();
    
    console.log(await relayedOwnedSet.getValidators());
  })


});
