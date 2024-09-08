// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImagineKitRegistry {
    struct App {
        address creator;
        uint256 price;
        uint256 usageCount;
        bool isActive;
    }

    mapping(uint256 => App) public apps;
    mapping(address => uint256) public earnings;
    uint256 public appCounter;

    event AppRegistered(uint256 indexed appId, address indexed creator, uint256 price);
    event AppUsed(uint256 indexed appId, address indexed user, uint256 fee);
    event EarningsWithdrawn(address indexed creator, uint256 amount);

    modifier onlyCreator(uint256 _appId) {
        require(apps[_appId].creator == msg.sender, "Only the creator can manage this app");
        _;
    }

    function registerApp(uint256 _price) external {
        require(_price > 0, "Price must be greater than zero");

        appCounter++;
        apps[appCounter] = App({
            creator: msg.sender,
            price: _price,
            usageCount: 0,
            isActive: true
        });

        emit AppRegistered(appCounter, msg.sender, _price);
    }

    function useApp(uint256 _appId) external payable {
        App storage app = apps[_appId];
        require(app.isActive, "This app is not active");
        require(msg.value == app.price, "Incorrect fee sent");

        app.usageCount++;
        earnings[app.creator] += msg.value;

        emit AppUsed(_appId, msg.sender, msg.value);
    }

    function withdrawEarnings() external {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "No earnings to withdraw");

        earnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit EarningsWithdrawn(msg.sender, amount);
    }

    function setAppPrice(uint256 _appId, uint256 _price) external onlyCreator(_appId) {
        require(_price > 0, "Price must be greater than zero");
        apps[_appId].price = _price;
    }

    function toggleAppStatus(uint256 _appId, bool _isActive) external onlyCreator(_appId) {
        apps[_appId].isActive = _isActive;
    }

    function getAppDetails(uint256 _appId) external view returns (address creator, uint256 price, uint256 usageCount, bool isActive) {
        App memory app = apps[_appId];
        return (app.creator, app.price, app.usageCount, app.isActive);
    }
}
