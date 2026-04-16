module.exports = generateUniqueId = async (prefix, Model) => {
    let generatedId = "";
    let isUnique = false;
    while (!isUnique) {
        generatedId = prefix + Math.floor(10000 + Math.random() * 90000);
        const checkId = await Model.findOne({ id: generatedId });

        if (!checkId) {
            isUnique = true;
        }
    }

    return generatedId;
};

