// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DonationContract is Ownable, ReentrancyGuard {
    struct Donation {
        address donor;
        address token; // address(0) for ETH
        uint256 amount;
        uint256 timestamp;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    struct UserDonations {
        uint256 totalETH;
        mapping(address => uint256) tokenBalances; // token address => amount
    }

    mapping(string => Donation[]) private postDonations; // streamId => donations
    mapping(address => UserDonations) private userDonations; // user => donations received
    mapping(string => address) private streamToAuthor; // streamId => post author

    event DonationReceived(
        string indexed streamId,
        address indexed donor,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event DonationWithdrawn(
        address indexed user,
        address indexed token,
        uint256 amount
    );

    function donateETH(string memory streamId) external payable {
        require(msg.value > 0, "Must send ETH");
        require(bytes(streamId).length > 0, "Invalid stream ID");

        address author = streamToAuthor[streamId];
        if (author == address(0)) {
            author = msg.sender;
            streamToAuthor[streamId] = author;
        }

        postDonations[streamId].push(
            Donation({
                donor: msg.sender,
                token: address(0),
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        userDonations[author].totalETH += msg.value;

        emit DonationReceived(
            streamId,
            msg.sender,
            address(0),
            msg.value,
            block.timestamp
        );
    }

    function donateToken(
        string memory streamId,
        address token,
        uint256 amount
    ) external {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(streamId).length > 0, "Invalid stream ID");

        IERC20 tokenContract = IERC20(token);
        require(
            tokenContract.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        address author = streamToAuthor[streamId];
        if (author == address(0)) {
            author = msg.sender;
            streamToAuthor[streamId] = author;
        }

        postDonations[streamId].push(
            Donation({
                donor: msg.sender,
                token: token,
                amount: amount,
                timestamp: block.timestamp
            })
        );

        userDonations[author].tokenBalances[token] += amount;

        emit DonationReceived(
            streamId,
            msg.sender,
            token,
            amount,
            block.timestamp
        );
    }

    function withdrawETH() external nonReentrant {
        uint256 amount = userDonations[msg.sender].totalETH;
        require(amount > 0, "No ETH to withdraw");

        userDonations[msg.sender].totalETH = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH transfer failed");

        emit DonationWithdrawn(msg.sender, address(0), amount);
    }

    function withdrawToken(address token) external nonReentrant {
        require(token != address(0), "Invalid token address");

        uint256 amount = userDonations[msg.sender].tokenBalances[token];
        require(amount > 0, "No tokens to withdraw");

        userDonations[msg.sender].tokenBalances[token] = 0;

        IERC20 tokenContract = IERC20(token);
        require(tokenContract.transfer(msg.sender, amount), "Transfer failed");

        emit DonationWithdrawn(msg.sender, token, amount);
    }

    function getDonationsByPost(
        string memory streamId
    ) external view returns (Donation[] memory) {
        return postDonations[streamId];
    }

    function getUserETHBalance(address user) external view returns (uint256) {
        return userDonations[user].totalETH;
    }

    function getUserTokenBalance(
        address user,
        address token
    ) external view returns (uint256) {
        return userDonations[user].tokenBalances[token];
    }

    function getPostAuthor(
        string memory streamId
    ) external view returns (address) {
        return streamToAuthor[streamId];
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
