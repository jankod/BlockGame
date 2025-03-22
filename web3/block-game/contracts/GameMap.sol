// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract GameMap is Ownable {

    IERC20 public gameToken; // Token igre
    uint256 public constant PLOT_PRICE = 100 * 10 ** 18; // Cijena dijela mape (100 tokena)
    mapping(uint256 => address) public plotOwners; // ID dijela mape -> vlasnik
    uint256 public totalPlots = 1000; // Ukupno dijelova mape

    event PlotPurchased(uint256 plotId, address buyer);

    constructor(address _gameToken, address _initialOwner) Ownable(_initialOwner){
        gameToken = IERC20(_gameToken);
    }

    /**
        * Funkcija za kupovinu dijela mape
        *
        * @param plotId ID dijela mape
        */
    function buyPlot(uint256 plotId) external {
        require(plotId < totalPlots, "Invalid plot ID");
        require(plotOwners[plotId] == address(0), "Plot already owned");
        require(gameToken.transferFrom(msg.sender, address(this), PLOT_PRICE), "Payment failed");

        plotOwners[plotId] = msg.sender;
        emit PlotPurchased(plotId, msg.sender);
    }

    // Funkcija za povlačenje tokena (samo vlasnik ugovora)
    function withdrawTokens() external onlyOwner {
        uint256 balance = gameToken.balanceOf(address(this));
        gameToken.transfer(msg.sender, balance);
    }
}