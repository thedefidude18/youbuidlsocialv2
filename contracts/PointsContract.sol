// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC2771Context.sol";

contract PointsContract is Ownable, ERC2771Context {
    struct UserPoints {
        uint256 totalPoints;
        mapping(string => uint256) postPoints;
    }

    constructor(
        address initialOwner,
        address trustedForwarder
    ) Ownable(initialOwner) ERC2771Context(trustedForwarder) {}

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

        streamToAuthor[streamId] = _msgSender();
        userPoints[_msgSender()].postPoints[streamId] = POINTS_PER_POST;
        userPoints[_msgSender()].totalPoints += POINTS_PER_POST;

        emit PostCreated(_msgSender(), streamId, POINTS_PER_POST);
    }

    function addComment(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] != address(0), "Post does not exist");

        userPoints[_msgSender()].totalPoints += POINTS_PER_COMMENT;
        emit CommentAdded(_msgSender(), streamId, POINTS_PER_COMMENT);
    }

    function addLike(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] != address(0), "Post does not exist");

        userPoints[_msgSender()].totalPoints += POINTS_PER_LIKE;
        emit LikeAdded(_msgSender(), streamId, POINTS_PER_LIKE);
    }

    function addRepost(string memory streamId) external {
        require(bytes(streamId).length > 0, "Invalid stream ID");
        require(streamToAuthor[streamId] != address(0), "Post does not exist");

        userPoints[_msgSender()].totalPoints += POINTS_PER_REPOST;
        emit RepostAdded(_msgSender(), streamId, POINTS_PER_REPOST);
    }

    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user].totalPoints;
    }

    function getPostPoints(
        string memory streamId
    ) external view returns (uint256) {
        address author = streamToAuthor[streamId];
        require(author != address(0), "Post does not exist");
        return userPoints[author].postPoints[streamId];
    }

    function addPoints(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");

        userPoints[user].totalPoints += amount;
        emit PointsAdded(user, amount, reason);
    }

    function getPostAuthor(
        string memory streamId
    ) external view returns (address) {
        return streamToAuthor[streamId];
    }

    /**
     * @dev Override of the _msgSender() function to support meta-transactions
     */
    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev Override of the _msgData() function to support meta-transactions
     */
    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
