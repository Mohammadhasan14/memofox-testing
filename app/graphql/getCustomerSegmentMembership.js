import axios from "axios";

export const getCustomerSegmentMembership = async ({ shopData, customerID, segmentsIDS }) => {
    try {

        console.log('getCustomerSegmentMembership shopData', shopData);
        console.log('getCustomerSegmentMembership customerID', `"${customerID}"`);
        console.log('getCustomerSegmentMembership segmentsIDS', JSON.stringify(segmentsIDS));


        const CustomerSegmentMembershipResponse = await axios({
            url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": shopData.accessToken,
            },
            data: {
                query: `
                query {
                    customerSegmentMembership(customerId: "${customerID}", segmentIds: ${JSON.stringify(segmentsIDS)}) {
                        memberships {
                          segmentId
                          isMember
                        }
                    }
                }
                    `,
            },
        });

        console.log('Full response from Shopify API getCustomerSegmentMembership:', CustomerSegmentMembershipResponse.data.data.customerSegmentMembership.memberships);

        return CustomerSegmentMembershipResponse.data;
    } catch (error) {
        console.error("Error while getCustomerSegmentMembership:", error);
        throw error;
    }
};
