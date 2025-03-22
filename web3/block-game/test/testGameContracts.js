const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("\\Game Contracts\\", function () {
  let GameToken, gameToken, GameMap, gameMap, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    GameToken = await ethers.getContractFactory("GameToken");
    gameToken = await GameToken.deploy(ethers.utils.parseEther("1000"));
    await gameToken.deployed();

    GameMap = await ethers.getContractFactory("GameMap");
    gameMap = await GameMap.deploy(gameToken.address, owner.address);
    await gameMap.deployed();
  });

  it("should allow buying a plot with valid payment", async function () {
    // Transfer tokens to addr1
    await gameToken.transfer(addr1.address, ethers.utils.parseEther("200"));

    // Approve and buy a plot
    await gameToken.connect(addr1).approve(gameMap.address, ethers.utils.parseEther("200"));
    await gameMap.connect(addr1).buyPlot(0);

    // Check ownership
    expect(await gameMap.plotOwners(0)).to.equal(addr1.address);
  });
});