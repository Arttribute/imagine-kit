const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImagineKitRegistry", function () {
  let ImagineKitRegistry, marketplace;
  let owner, user1, user2;
  const appPrice = ethers.parseEther("1"); // 1 ETH

  beforeEach(async function () {
    // Deploy the contract
    ImagineKitRegistry = await ethers.getContractFactory("ImagineKitRegistry");
    [owner, user1, user2] = await ethers.getSigners();
    marketplace = await ImagineKitRegistry.deploy();
  });

  it("should register a new app", async function () {
    await expect(marketplace.connect(user1).registerApp(appPrice))
      .to.emit(marketplace, "AppRegistered")
      .withArgs(1, user1.address, appPrice);

    const appDetails = await marketplace.getAppDetails(1);
    expect(appDetails.creator).to.equal(user1.address);
    expect(appDetails.price).to.equal(appPrice);
    expect(appDetails.usageCount).to.equal(0);
    expect(appDetails.isActive).to.be.true;
  });

  it("should allow users to use an app and pay the fee", async function () {
    await marketplace.connect(user1).registerApp(appPrice);

    await expect(marketplace.connect(user2).useApp(1, { value: appPrice }))
      .to.emit(marketplace, "AppUsed")
      .withArgs(1, user2.address, appPrice);

    const appDetails = await marketplace.getAppDetails(1);
    expect(appDetails.usageCount).to.equal(1);

    const earnings = await marketplace.earnings(user1.address);
    expect(earnings).to.equal(appPrice);
  });

  it("should not allow users to use an app with incorrect fee", async function () {
    await marketplace.connect(user1).registerApp(appPrice);

    await expect(
      marketplace.connect(user2).useApp(1, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Incorrect fee sent");
  });

  it("should allow the creator to withdraw earnings", async function () {
    await marketplace.connect(user1).registerApp(appPrice);
    await marketplace.connect(user2).useApp(1, { value: appPrice });

    const initialBalance = await ethers.provider.getBalance(user1.address);

    await expect(marketplace.connect(user1).withdrawEarnings())
      .to.emit(marketplace, "EarningsWithdrawn")
      .withArgs(user1.address, appPrice);

    const finalBalance = await ethers.provider.getBalance(user1.address);
    expect(finalBalance).to.be.above(initialBalance);
  });

  it("should not allow non-creators to manage apps", async function () {
    await marketplace.connect(user1).registerApp(appPrice);

    await expect(
      marketplace.connect(user2).setAppPrice(1, ethers.parseEther("2"))
    ).to.be.revertedWith("Only the creator can manage this app");
  });

  it("should allow the creator to change the app price", async function () {
    await marketplace.connect(user1).registerApp(appPrice);

    const newPrice = ethers.parseEther("2");
    await marketplace.connect(user1).setAppPrice(1, newPrice);

    const appDetails = await marketplace.getAppDetails(1);
    expect(appDetails.price).to.equal(newPrice);
  });

  it("should allow the creator to toggle the app status", async function () {
    await marketplace.connect(user1).registerApp(appPrice);

    await marketplace.connect(user1).toggleAppStatus(1, false);
    let appDetails = await marketplace.getAppDetails(1);
    expect(appDetails.isActive).to.be.false;

    await marketplace.connect(user1).toggleAppStatus(1, true);
    appDetails = await marketplace.getAppDetails(1);
    expect(appDetails.isActive).to.be.true;
  });

  it("should not allow usage of inactive apps", async function () {
    await marketplace.connect(user1).registerApp(appPrice);
    await marketplace.connect(user1).toggleAppStatus(1, false);

    await expect(
      marketplace.connect(user2).useApp(1, { value: appPrice })
    ).to.be.revertedWith("This app is not active");
  });
});
