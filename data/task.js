const {ObjectId} = require("mongodb");

const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;

getAllTask = async (skip, take) => {
    taskCollection = await task();
    return taskCollection.find({}).skip(skip).limit(take).toArray();
}

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
}

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
}

putTask = async (suppliedId, newData) => {
    taskCollection = await task();
    const data = await getTaskById(suppliedId);

    if (data === null) {
        return undefined;
    } else {
        const newValues = {
            "$set": {
                "title": newData.title,
                "description": newData.description,
                "hoursEstimated": newData.hoursEstimated,
                "completed": newData.completed,
            }
        };
        const taskCollection = await task();
        await taskCollection.updateOne({
            _id: ObjectId(suppliedId)
        }, newValues);
        const toReturn = await getTaskById(suppliedId);
        return toReturn;
    }
}

patchTask = async (suppliedId, newData) => {
    taskCollection = await task();
    const data = await getTaskById(suppliedId);

    if (data === null) {
        return undefined;
    } else {
        const newValues = {
            "$set": {
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
}

postTaskComments = async (suppliedId, newComment) => {
    taskCollection = await task();
    const data = await getTaskById(suppliedId);

    if (data === null) {
        return undefined;
    } else {
        const value = {
            "_id": new ObjectId(),
            "name": newComment.name,
            "comment": newComment.comment
        }
        data["comments"].push(value);
        const newValues = {
            "$set": {
                ...data
            }
        };

        await taskCollection.updateOne({
            _id: ObjectId(suppliedId)
        }, newValues);
        return await getTaskById(suppliedId);
    }
}

deleteTaskComments = async (taskId, commentId) => {
    taskCollection = await task();
    const data = await getTaskById(taskId);

    if (data === null) {
        return undefined;
    } else {
        [isPresent, newComments] = findCommentById(data["comments"], commentId);
        if (isPresent) {
            const newValues = {
                "$set": {
                    "comments": newComments
                }
            };
            await taskCollection.updateOne({
                _id: ObjectId(taskId)
            }, newValues);
            return await getTaskById(taskId);
        } else {
            return null;
        }
    }
}

findCommentById = (allData, commentId) => {
    newData = []
    isPresent = false;
    for (val of allData) {
        if (val["_id"] == commentId) {
            isPresent = true;
        } else {
            newData.push(val);
        }
    }
    return [isPresent, newData];
}

module.exports = {
    "getAllTask": getAllTask,
    "getTaskById": getTaskById,
    "postTask": postTask,
    "putTask": putTask,
    "patchTask": patchTask,
    "postTaskComments": postTaskComments,
    "deleteTaskComments": deleteTaskComments
};