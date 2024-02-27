import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  // built a healthcheck response that simply returns the OK status as json with a message
  const channelStats = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "likedBy",
              as: "likes",
              pipeline: [
                {
                  $addFields: {
                    Videolikes: {
                      $size: "$likes",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$videos.views",
        },
        totalLikes: {
          $sum: "$videos.VideoLikes",
        },
        totalVideos: {
          $size: "$videos",
        },
      },
    },
  ]);

  if (!channelStats) throw new ApiError(500, "No data available");

  res.status(200).json(new ApiResponse(200, channelStats, "Success"));
});

export { healthcheck };
