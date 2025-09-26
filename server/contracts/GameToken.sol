// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameToken
 * @dev Gaming token with reward points and player level tracking
 */
contract GameToken is ERC20, Ownable {
    // Player statistics
    mapping(address => uint256) public rewardPoints;
    mapping(address => uint256) public playerLevels;
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalGamesPlayed;

    // Game configuration
    uint256 public constant DAILY_REWARD = 100 * 10**18; // 100 tokens
    uint256 public constant LEVEL_UP_THRESHOLD = 1000; // Points needed to level up
    uint256 public constant GAME_REWARD = 10 * 10**18; // 10 tokens per game

    // Events
    event RewardClaimed(address indexed player, uint256 amount);
    event LevelUp(address indexed player, uint256 newLevel);
    event GamePlayed(address indexed player, uint256 reward);
    event PointsEarned(address indexed player, uint256 points);

    constructor() ERC20("GameTip Token", "GTT") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1M tokens to deployer
    }

    /**
     * @dev Claim daily rewards
     */
    function claimDailyReward() external {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + 1 days,
            "Already claimed today"
        );

        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, DAILY_REWARD);

        // Add reward points
        _addRewardPoints(msg.sender, 50);

        emit RewardClaimed(msg.sender, DAILY_REWARD);
    }

    /**
     * @dev Play a game and earn rewards
     */
    function playGame(bool won) external {
        totalGamesPlayed[msg.sender]++;

        uint256 reward = won ? GAME_REWARD : GAME_REWARD / 10;
        uint256 points = won ? 100 : 10;

        _mint(msg.sender, reward);
        _addRewardPoints(msg.sender, points);

        emit GamePlayed(msg.sender, reward);
    }

    /**
     * @dev Add reward points and check for level up
     */
    function _addRewardPoints(address player, uint256 points) internal {
        rewardPoints[player] += points;
        emit PointsEarned(player, points);

        // Check for level up
        uint256 newLevel = rewardPoints[player] / LEVEL_UP_THRESHOLD;
        if (newLevel > playerLevels[player]) {
            playerLevels[player] = newLevel;

            // Bonus tokens for leveling up
            uint256 levelBonus = newLevel * 50 * 10**18;
            _mint(player, levelBonus);

            emit LevelUp(player, newLevel);
        }
    }

    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address player) external view returns (
        uint256 balance,
        uint256 points,
        uint256 level,
        uint256 games,
        bool canClaimDaily
    ) {
        return (
            balanceOf(player),
            rewardPoints[player],
            playerLevels[player],
            totalGamesPlayed[player],
            block.timestamp >= lastClaimTime[player] + 1 days
        );
    }

    /**
     * @dev Get reward points for a player (for API compatibility)
     */
    function getRewardPoints(address player) external view returns (uint256) {
        return rewardPoints[player];
    }

    /**
     * @dev Get player level (for API compatibility)
     */
    function getPlayerLevel(address player) external view returns (uint256) {
        return playerLevels[player];
    }

    /**
     * @dev Owner can distribute tokens to winners
     */
    function distributeReward(address winner, uint256 amount) external onlyOwner {
        _mint(winner, amount);
    }
}