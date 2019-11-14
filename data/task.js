const {ObjectId} = require("mongodb");

const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;

getAllTask = async () => {
    taskCollection = await task();
    return taskCollection.find({}).skip(skip).limit(take).toArray();
};

getTaskById = async (id) => {
    // we need to search for that id;

    taskCollection = await task();
    const data = await taskCollection.findOne({
        _id: ObjectId.createFromHexString(id)
    });

    if (data === null) {
        return undefined;
    }

    return data;
};

postTask = async (userData) => {
    taskCollection = await task();
    const insertInfo = await taskCollection.insertOne({
        "title": userData.title,
        "description": userData.description,
        "hoursEstimated": userData.hoursEstimated,
        "completed": userData.completed,
        "comments": userData.comments
    });

    const {
        ops
    } = insertInfo;
    return ops[0];

    // return the creadted object
};


module.exports = {
    "getAllTask": getAllTask,
    "getTaskById": getTaskById,
    "postTask": postTask
};