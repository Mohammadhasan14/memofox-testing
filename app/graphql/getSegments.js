import axios from "axios";

export const getSegments = async (shopData, endcursor) => {
  try {

    const customerSegmentResponse = await axios({
      url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopData.accessToken,
      },
      data: {
        query: `query {
          segments(first: 10, after: ${endcursor} ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              node {
                id
              }
            }
          }
        }
        `,
      },
    });

    console.log('Full response from Shopify API getSegments:', customerSegmentResponse.data.data.segments);

    return customerSegmentResponse?.data?.data?.segments;
  } catch (error) {
    console.error("Error creating new segment:", error);
    throw error;
  }
};
