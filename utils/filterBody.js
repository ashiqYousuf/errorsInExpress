const filterBody = (allowedFields, body) => {
    const filteredFields = {}
    allowedFields.forEach((field) => {
        if (body[field] !== undefined) {
            filteredFields[field] = body[field]
        }
    });
    return filteredFields;
};

module.exports = filterBody;
