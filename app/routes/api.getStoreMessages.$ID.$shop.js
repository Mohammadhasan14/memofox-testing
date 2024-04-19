import { json } from "@remix-run/node";
import { getSegments } from "../graphql/getSegments";
import { getCustomerSegmentMembership } from "../graphql/getCustomerSegmentMembership";
import { shopModel } from "../db.server";
import messageModel from "../MONGODB/models/messageSchema";

export const loader = async ({ params }) => {
    try {

        // console.log('params........', params.ID);
        // console.log('params........', params.shop);

        const shopData = await shopModel.findOne({ shop: params.shop });

        // console.log('shopData from getstoremessages', shopData);
        let customerSegments = [];
        let hasNextPage = true;
        let endcursor = null
        let count = 0
        while (hasNextPage) {
            // console.log('hasNextPage', hasNextPage);
            // console.log('endcursor', JSON.stringify(endcursor));
            const dataGetSegments = await getSegments(shopData, JSON.stringify(endcursor));
            customerSegments.push(...dataGetSegments?.edges);
            hasNextPage = dataGetSegments.pageInfo.hasNextPage;
            endcursor = dataGetSegments.pageInfo.endCursor;
            // console.log('endcursor after', JSON.stringify(endcursor));

            // console.log('after dataGetSegments.pageInfo.hasNextPage', dataGetSegments.pageInfo.hasNextPage);
            count++
        }

        // console.log('customerSegments', customerSegments);
        // console.log('count.......', count);

        // return

        const filterSegmentsIDS = customerSegments.map(data => data.node.id)

        // console.log('filterSegmentsIDS', JSON.stringify(filterSegmentsIDS));


        const customerMemberShipSegments = await getCustomerSegmentMembership({
            shopData,
            customerID: `gid://shopify/Customer/${params.ID}`,
            segmentsIDS: filterSegmentsIDS
        })

        // console.log('customerMemberShipSegments..........', customerMemberShipSegments);

        if (customerMemberShipSegments.data.customerSegmentMembership.memberships) {
            const filteredSegmentIDs = customerMemberShipSegments.data.customerSegmentMembership.memberships
                ?.filter(data => data.isMember === true)
                .map(member => member.segmentId);

            // console.log('filteredSegmentIDs..............', filteredSegmentIDs);


            const currentDate = new Date();
            // const nowDate = new Date()
            // nowDate.setUTCHours(0, 0, 0, 0);
            // console.log('currentDate...................', nowDate.toISOString());
            // console.log('time.....................', `${currentDate.getHours()}:${currentDate.getMinutes()}`);


            // const messageData = await messageModel.aggregate([
            //     {
            //         $match: {
            //             assignedSegments: { $in: filteredSegmentIDs },
            //             storeURL: params.shop,
            //             $or: [
            //                 {
            //                     $and: [        // Case 1: Both startDate and endDate are null
            //                         { startDate: null },
            //                         { endDate: null }
            //                     ]
            //                 },
            //                 {
            //                     $and: [ // Case 2: startDate is not null
            //                         { startDate: { $lte: currentDate } },
            //                         { startTime: { $lt: currentDate.getHours() + ':' + currentDate.getMinutes() } },
            //                         { endDate: { $gte: nowDate.toISOString() } },
            //                         { endTime: { $gt: currentDate.getHours() + ':' + currentDate.getMinutes() } },
            //                     ]
            //                 },
            //                 {
            //                     $and: [ // Case 3: endDate is null
            //                         { endDate: null },
            //                         { startDate: { $lte: currentDate } },
            //                         { startTime: { $lt: `${currentDate.getHours()}:${currentDate.getMinutes()}` } },

            //                     ]
            //                 }
            //             ]
            //         }
            //     },
            //     { $sort: { _id: -1 } }
            // ]);






            const messageData = await messageModel.aggregate([
                {
                    $match: {
                        assignedSegments: { $in: filteredSegmentIDs },
                        storeURL: params.shop,
                    }
                },
                { $sort: { _id: -1 } }
            ]);

            // const filterMessageData = messageData.filter((data, i) => {
            //     console.log('data.startDate', data.startDate);
            //     console.log('data.startDate typeof', typeof data.startDate);

            //     console.log('data.startTime', data.startTime);
            //     console.log('data.startTime typeof', typeof data.startTime);

            //     console.log('data.endTime', data.endTime);
            //     console.log('data.endTime typeof', typeof data.endTime);

            //     console.log('data.endDate', data.endDate);
            //     console.log('data.endDate typeof', typeof data.endDate);

            //     console.log('`${currentDate.getHours()}:${currentDate.getMinutes()}`', `${currentDate.getHours()}:${currentDate.getMinutes()}`);
            //     console.log('nowDate.toISOString()', nowDate.toISOString());
            //     console.log(' typeof nowDate.toISOString()', typeof nowDate.toISOString());
            //     console.log("data.startDate.toISOString().split('T')[0]", data?.startDate && data?.startDate.toISOString()?.split('T')?.[0]);
            //     console.log("currentDate.toISOString().split('T')[0]",currentDate.toISOString().split('T')[0]);

            //     if (data.startDate === null && data.endDate === null) {
            //         return data
            //     } else if (data.startDate <= nowDate.toISOString() && data.endDate >= nowDate.toISOString()
            //         && data.startTime < `${currentDate.getHours()}:${currentDate.getMinutes()}` && data.endTime > `${currentDate.getHours()}:${currentDate.getMinutes()}`) {
            //         return data
            //     } else if ( data.startDate <= nowDate.toISOString() && data.endDate === null) {
            //         return data
            //     } else if (data?.startDate && data?.endDate &&
            //         (data?.startDate.toISOString()?.split('T')?.[0] === currentDate.toISOString().split('T')[0] && data?.endDate.toISOString()?.split('T')?.[0] === currentDate.toISOString().split('T')[0] && data.startTime < `${currentDate.getHours()}:${currentDate.getMinutes()}` && data.endTime > `${currentDate.getHours()}:${currentDate.getMinutes()}`)) {
            //         return data
            //     } 
            //     // else if (data?.startDate && data?.endDate && (data?.startDate.toISOString()?.split('T')?.[0] === currentDate.toISOString().split('T')[0]) ){
            //     //     console.log('hit equal to =================================================',data);
            //     //     return data
            //     // }
            // })


            // filtering messages accorging to the shedule time and date
            const filterMessageData = messageData.filter(data => {
                const currentDateOnly = currentDate.toISOString().split('T')[0];
                const currentMinutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
                const currentTime = `${currentDate.getHours()}:${currentMinutes}`;
                // console.log('currentTime', currentTime);
                // console.log('currentDateOnly', currentDateOnly);
                // if both the startDate and endDate null or not set (this occured when admin did "Post now")
                if (data.startDate === null && data.endDate === null) {
                    return true;
                }
                // if startDate and endDate is different with startTime and endTime
                else if ((data.startDate && data.startDate.toISOString().split('T')[0] <= currentDateOnly)
                    && (data.endDate && data.endDate.toISOString().split('T')[0] >= currentDateOnly)) {
                    if (data.startTime <= currentTime && (data.endDate.toISOString().split('T')[0] === currentDateOnly ? data.endTime > currentTime : true)) {
                        return true
                    }
                }
                // if both startDate and endDate is same date
                else if (data.startDate && data.endDate
                    && (data.startDate.toISOString().split('T')[0] === currentDateOnly && data.endDate.toISOString().split('T')[0] === currentDateOnly
                        && data.startTime <= currentTime && data.endTime > currentTime)) {
                    return true;
                }
                // if startDate is set but endDate is null or not set
                else if (data.startDate && (!(data.startDate.toISOString().split('T')[0] > currentDateOnly)
                    || (data.startDate.toISOString().split('T')[0] === currentDateOnly && data.startTime <= currentTime)
                    || data.startDate.toISOString().split('T')[0] < currentDateOnly) && data.endDate === null) {
                    return true;
                }

                return false;
            });





            // const currentDate = new Date();
            // const currentMinutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
            // const nowDate = new Date()
            // nowDate.setUTCHours(0, 0, 0, 0);
            // console.log('currentDate...................', currentDate);
            // console.log('now.................', nowDate.toISOString());
            // const currentDateISOString = currentDate.toISOString().split('T')[0]; 
            // console.log('currentDateISOString......',`${currentDateISOString}T00:00:00.000Z`);
            // console.log('time.....................', `${currentDate.getHours()}:${currentMinutes}`);
            // console.log('currentMinutes', currentMinutes);

            // const messageData = await messageModel.aggregate([
            //     {
            //         $match: {
            //             assignedSegments: { $in: filteredSegmentIDs },
            //             storeURL: params.shop,
            //             $or: [
            //                 {
            //                     $and: [        // Case 1: Both startDate and endDate are null
            //                         { startDate: null },
            //                         { endDate: null }
            //                     ]
            //                 },
            //                 {
            //                     $and: [ // Case 2: startDate is not null
            //                         { startDate: { $lte: currentDate } },
            //                         { startTime: { $lt: currentDate.getHours() + ':' + currentDate.getMinutes() } },
            //                         { endDate: { $gte: currentDate } },
            //                         { endTime: { $gt: currentDate.getHours() + ':' + currentDate.getMinutes() } },
            //                     ]
            //                 },
            //                 {
            //                     $and: [ // Case 3: endDate is null
            //                         { endDate: null },
            //                         { startDate: { $lte: currentDate } },
            //                         { startTime: { $lt: `${currentDate.getHours()}:${currentDate.getMinutes()}` } },

            //                     ]
            //                 },
            //                 {
            //                     $and: [ // Case 4: startDate and endDate is currentDate
            //                         { startDate: { $eq: nowDate.toISOString() } },
            //                         { startTime: { $lt: `${currentDate.getHours()}:${currentMinutes}` } },
            //                         { endDate: { $eq: nowDate.toISOString() } },
            //                         { endTime: { $gt: `${currentDate.getHours()}:${currentMinutes}` } },
            //                     ]
            //                 },
            //             ]
            //         }
            //     },
            //     { $sort: { _id: -1 } }
            // ]);


            // console.log('filterMessageData:', filterMessageData.length, ' ', filterMessageData);
            // console.log('filterMessageData', filterMessageData);
            // console.log('messageData:', messageData.length, ' ', messageData);

            if (messageData.length >= 1) {
                return json({
                    message: 'Data found successfully!',
                    data: filterMessageData
                }, { status: 200 });
            } else {
                return json({
                    message: 'No data found',
                    data: false
                }, { status: 200 });
            }

        }

        return json({
            message: 'No data found',
            data: false
        }, { status: 200 });

    } catch (error) {
        console.log("error", error);
        return json({
            error: `Something went wrong..., ${error}`,
        }, { status: 200 });
    }
};



