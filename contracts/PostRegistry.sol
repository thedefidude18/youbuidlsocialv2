// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PostRegistry {
    struct Post {
        address author;
        string streamId; // Ceramic/OrbisDB stream ID
        uint256 timestamp;
        uint256 likes;
        uint256 comments;
        uint256 reposts;
        string transactionHash; // Store TX hash
    }

    mapping(uint256 => Post) public posts;
    mapping(string => string) public streamToTx;
    uint256 public postCount;

    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        string streamId,
        uint256 timestamp,
        string transactionHash
    );

    function createPost(string memory _streamId) external {
        postCount++;

        // The real transaction hash is captured off-chain via event logs
        string memory txHash = toHexString(uint256(uint160(msg.sender)));

        posts[postCount] = Post({
            author: msg.sender,
            streamId: _streamId,
            timestamp: block.timestamp,
            likes: 0,
            comments: 0,
            reposts: 0,
            transactionHash: txHash // Placeholder for event lookup
        });

        streamToTx[_streamId] = txHash;

        emit PostCreated(
            postCount,
            msg.sender,
            _streamId,
            block.timestamp,
            txHash
        );
    }

    function getTransactionHash(
        string memory _streamId
    ) external view returns (string memory) {
        return streamToTx[_streamId];
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }

    // Convert address/values to hex
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x0";
        }

        bytes memory buffer = new bytes(64);
        for (uint256 i = 63; i >= 0 && value > 0; i--) {
            uint8 digit = uint8(value & 0xF);
            buffer[i] = digit < 10
                ? bytes1(uint8(48 + digit))
                : bytes1(uint8(87 + digit));
            value >>= 4;
        }

        return string(abi.encodePacked("0x", buffer));
    }
}
