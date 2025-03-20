// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";

contract PointsContract is Ownable {
    struct UserPoints {
        uint256 totalPoints;
        mapping(string => uint256) postPoints;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    mapping(address => UserPoints) private userPoints;
    mapping(string => address) private streamToAuthor;

    uint256 public constant POINTS_PER_POST = 10;
    uint256 public constant POINTS_PER_COMMENT = 5;
    uint256 public constant POINTS_PER_LIKE = 2;
    uint256 public constant POINTS_PER_REPOST = 3;

    event PostCreated(address indexed user, string streamId, uint256 points);
    event CommentAdded(address indexed user, string streamId, uint256 points);
    event LikeAdded(address indexed user, string streamId, uint256 points);
    event RepostAdded(address indexed user, string streamId, uint256 points);
    event PointsAdded(address indexed user, uint256 amount, string reason);

    function createPost(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] == address(0), "Post already exists");

        streamToAuthor[streamId] = msg.sender;
        userPoints[msg.sender].postPoints[streamId] = POINTS_PER_POST;
        userPoints[msg.sender].totalPoints += POINTS_PER_POST;

        emit PostCreated(msg.sender, streamId, POINTS_PER_POST);
    }

    function addComment(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] != address(0), "Post does not exist");

        userPoints[msg.sender].totalPoints += POINTS_PER_COMMENT;
        emit CommentAdded(msg.sender, streamId, POINTS_PER_COMMENT);
    }

    function addLike(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] != address(0), "Post does not exist");

        userPoints[msg.sender].totalPoints += POINTS_PER_LIKE;
        emit LikeAdded(msg.sender, streamId, POINTS_PER_LIKE);
    }

    function addRepost(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] != address(0), "Post does not exist");

        userPoints[msg.sender].totalPoints += POINTS_PER_REPOST;
        emit RepostAdded(msg.sender, streamId, POINTS_PER_REPOST);
    }

    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user].totalPoints;
    }

    function getPostPoints(string memory streamId) external view returns (uint256) {
        address author = streamToAuthor[streamId];
        require(author != address(0), "Post does not exist");
        return userPoints[author].postPoints[streamId];
    }

    function addPoints(address user, uint256 amount, string memory reason) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");

        userPoints[user].totalPoints += amount;
        emit PointsAdded(user, amount, reason);
    }

    function getPostAuthor(string memory streamId) external view returns (address) {
        return streamToAuthor[streamId];
    }
}