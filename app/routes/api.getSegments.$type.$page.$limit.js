import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import segmentModel from "../MONGODB/models/segmentSchema";
import segmentDraftModel from "../MONGODB/models/segmentDraftSchema";

export const loader = async ({ params, request }) => {
    const { admin, session } = await authenticate.admin(request);

    // console.log("params getSegments", params)
    const limit = params.limit
    const page = params.page

    try {

        if (params.type === 'segmentDraft') {
            const totalItems = await segmentDraftModel.countDocuments({ storeURL: session.shop });
            // console.log('totalItems', totalItems);
            const totalPages = Math.ceil(totalItems / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const segmentData = await segmentDraftModel.aggregate([
                {
                    $match: {
                        storeURL: session.shop
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $skip: (Number(page) - 1) * Number(limit)
                },
                {
                    $limit: Number(limit)
                },
                {
                    $addFields: {
                        type: "draftSegment"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        storeURL: 1,
                        segmentDraft: 1,
                        createdAt: 1
                    }
                }
            ]);

            return json({
                segmentData, hasNextPage, hasPrevPage, totalItems, limit
            }, { status: 200 });

        } else if (params.type === 'all') {
            // console.log('hit all ');
            const segmentData = await segmentModel.find({ storeURL: session.shop })
                .sort({ _id: -1 })

            return json({
                segmentData
            }, { status: 200 });

        } else {
            const totalItems = await segmentModel.countDocuments({ storeURL: session.shop });
            // console.log('totalItems', totalItems);
            const totalPages = Math.ceil(totalItems / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            // const segmentData = await segmentModel.find()
            //     .sort({ _id: -1 })
            //     .skip((page - 1) * limit)
            //     .limit(limit)
            //     .lean();

            const segmentData = await segmentModel.aggregate([
                {
                    $match: {
                        storeURL: session.shop
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $skip: (Number(page) - 1) * Number(limit)
                },
                {
                    $limit: Number(limit)
                },
                {
                    $addFields: {
                        type: "segment"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        id: 1,
                        name: 1,
                        query: 1,
                        storeURL: 1,
                        createdAt: 1
                    }
                }
            ]);

            return json({
                segmentData, hasNextPage, hasPrevPage, totalItems, limit
            }, { status: 200 });

        }


    } catch (error) {
        console.log("error", error);
        return json({
            error: `Something went wrong..., ${error}`,
        }, { status: 200 });
    }
};



