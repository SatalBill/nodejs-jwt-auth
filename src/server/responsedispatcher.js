let transformPayload = (payload) => {

    let transformedPayload = {};

    payload.forEach(element => {

        transformedPayload = {
            ...transformedPayload,
            [element.key]: element.data
        };
    });

    return transformedPayload;
};

const successDispatcher = (errorMessage, ...payload) => {

    return {

        success: true,
        data: {

            ...transformPayload(payload)
        },
        error: errorMessage
    };
};

const errorDispatcher = (errorMessage, ...payload) => {

    return {

        success: false,
        data: {

            ...transformPayload(payload) 
        },
        error: errorMessage
    };
};

module.exports = {

    errorDispatcher,
    successDispatcher
};
