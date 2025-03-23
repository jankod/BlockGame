const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("\\Game Contracts\\", function () {
  let GameToken, gameToken, GameMap, gameMap, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    console.log("owner:", owner.address);

    GameToken = await ethers.getContractFactory("GameToken");

    gameToken = await GameToken.deploy(ethers.parseEther("1000"), {gasLimit: 3000000});
    await gameToken.waitForDeployment();
    if (!gameToken.address) throw new Error("GameToken deployment failed");


    GameMap = await ethers.getContractFactory("GameMap");
    gameMap = await GameMap.deploy(gameToken.address, owner.address);
    await gameMap.waitForDeployment();
    if (!gameMap.address) throw new Error("GameMap deployment failed");
  });

  it("should allow buying a plot with valid payment", async function () {
    // Transfer tokens to addr1
    await gameToken.transfer(addr1.address, ethers.parseEther("200"));

    // Approve and buy a plot
    await gameToken.connect(addr1).approve(gameMap.address, ethers.parseEther("200"));
    await gameMap.connect(addr1).buyPlot(0);

    // Check ownership
    expect(await gameMap.plotOwners(0)).to.equal(addr1.address);
  });
});