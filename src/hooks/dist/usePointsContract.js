"use strict";
exports.__esModule = true;
exports.usePointsContract = void 0;
var wagmi_1 = require("wagmi");
var PointsContract_json_1 = require("../contracts/contracts/PointsContract.sol/PointsContract.json");
function usePointsContract() {
    var address = wagmi_1.useAccount().address;
    var contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
    "0x" + string;
    // Read user points
    var _a = wagmi_1.useContractRead({
        address: contractAddress,
        abi: PointsContract_json_1["default"].abi,
        functionName: 'getUserPoints',
        args: [address],
        enabled: !!address
    }), points = _a.data, pointsLoading = _a.isLoading;
    // Create post and earn points
    var _b = wagmi_1.useContractWrite({
        address: contractAddress,
        abi: PointsContract_json_1["default"].abi,
        functionName: 'createPost'
    }), createPost = _b.write, createPostData = _b.data;
    // Add like and earn points
    var _c = wagmi_1.useContractWrite({
        address: contractAddress,
        abi: PointsContract_json_1["default"].abi,
        functionName: 'addLike'
    }), addLike = _c.write, addLikeData = _c.data;
    // Add comment and earn points
    var _d = wagmi_1.useContractWrite({
        address: contractAddress,
        abi: PointsContract_json_1["default"].abi,
        functionName: 'addComment'
    }), addComment = _d.write, addCommentData = _d.data;
    return {
        points: points,
        pointsLoading: pointsLoading,
        createPost: createPost,
        addLike: addLike,
        addComment: addComment
    };
}
exports.usePointsContract = usePointsContract;
