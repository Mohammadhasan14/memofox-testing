function convertSegmentQuery(data) {
    return data?.map(item => {
        const { attribute, operator, value, duration, addOperator } = item;
        let formattedValue = '';

        if (value !== '') {
            if (duration !== '') {
                formattedValue = `${attribute} ${operator} `;

            } else {
                if (attribute === 'customer_tags') {
                    formattedValue = `${attribute} ${operator} '${value}'`;

                } else if (attribute.includes('products_purchased(')) {
                    if (attribute === 'products_purchased(id)') {
                        const filterIds = value?.map(d => d.product.id.split('/').pop())
                        const productIds = filterIds?.join(', ')
                        if (operator === 'true') {
                            formattedValue = `products_purchased(id: (${productIds})) = true`;
                        } else {
                            formattedValue = `products_purchased(id: (8238418722967, 8238419411095)) = false`;
                        }
                    } else if (attribute === 'products_purchased(tag)') {

                        if (operator === 'true') {
                            formattedValue = `products_purchased(tag: '${value}') = true`;
                        } else {
                            formattedValue = `products_purchased(tag: '${value}') = false`;
                        }
                    } else {

                        if (operator === 'true') {
                            formattedValue = `products_purchased(sum_quantity: ${value}) = true`;
                        } else {
                            formattedValue = `products_purchased(sum_quantity: ${value}) = false`;
                        }
                    }
                    // console.log('hit inside products_purchased(', attribute, '      ', value);
                }
                else {
                    formattedValue = `${attribute} ${operator} ${value}`;

                }

            }
        } else {
            formattedValue = `${attribute} ${operator}`;
        }

        let segmentQuery = formattedValue;

        if (duration !== '') {
            if (value.charAt(0) === '-') {
                segmentQuery += `${value}${duration}`;
            } else {
                segmentQuery += `+${value}${duration}`;
            }
        }

        if (addOperator !== '') {
            segmentQuery += ` ${addOperator}`;
        }
        // console.log('segmentQuery', segmentQuery);
        return segmentQuery;
    }).join(' ');
}

export default convertSegmentQuery;