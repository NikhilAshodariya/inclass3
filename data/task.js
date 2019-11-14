const {ObjectId} = require("mongodb");

const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;

getAllTask = async () => {
    taskCollection = await task();
    return taskCollection.find({}).skip(skip).limit(take).toArray();
};

removeTask = async (id) => {
    if(id === "") {
        return {};
    } else {
        taskCollection = await task();
        returnval = await getTaskById(id);
        await taskCollection.remove({
            id:id
        });
        return returnval;
    }
};

getTaskById = async (id) => {
    // we need to search for that id;

    taskCollection = await task();
    const data = await taskCollection.findOne({
        id: id
    });

    if (data === null) {
        return undefined;
    }

    return data;
};

postTask = async (userData) => {
    taskCollection = await task();
    const insertInfo = await taskCollection.insertOne({
        "id": userData.id,
        "title": userData.title,
        "description": userData.description,
        "hoursEstimated": userData.hoursEstimated,
        "completed": userData.completed
    });

    const {
        ops
    } = insertInfo;
    return ops[0];

    // return the creadted object
};

patchTask = async (suppliedId, newData) => {
    taskCollection = await task();
    const data = await getTaskById(suppliedId);

    if (data === null) {
        return undefined;
    } else {
        const newValues = {
            "$set": {
                "id": newData.id? newData.id: data.id,
                "title": newData.title ? newData.title : data.title,
                "description": newData.description ? newData.description : data.description,
                "hoursEstimated": newData.hoursEstimated ? newData.hoursEstimated : data.hoursEstimated,
                "completed": newData.completed ? newData.completed : data.completed,
            }
        };
        const taskCollection = await task();
        await taskCollection.updateOne({
            _id: ObjectId(suppliedId)
        }, newValues);
        return await getTaskById(suppliedId);
    }
};


module.exports = {
    "getAllTask": getAllTask,
    "getTaskById": getTaskById,
    "postTask": postTask,
    "patchTask": patchTask,
    "removeTask": removeTask
};