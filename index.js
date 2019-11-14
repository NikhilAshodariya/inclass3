const { ApolloServer, gql } = require("apollo-server");

const data = require("./data");

const typeDefs = gql`
    type Query {
        tasks: [Task]
        task(id: String): Task
    }

    type Task {
        id: String
        title: String
        description: String
        hoursEstimated: Int,
        completed: Boolean
    }
    
    type Mutation {
        addTask(
            id: String!
            title: String!
            description: String!
            hoursEstimated: Int!
            completed: Boolean!
        ): Task
        removeTask(id: String!): Task
        editTask(
            id: String!
            title: String
            description: String
            hoursEstimated: Int
            completed: Boolean
        ): Task
    }
`;

const resolvers = {
    Query: {
        tasks: (_, args) => data.task.getAllTask(),
        task: (_, args) => data.task.getTaskById(args.id),
    },
    Mutation: {
        addTask: async (_, args) => {
            const newTask = {
                id: args.id,
                title: args.title,
                description: args.description,
                hoursEstimated: args.hoursEstimated,
                completed: args.completed
            };
            returnval = await data.task.postTask(newTask);

            return returnval;
        },
        removeTask: async (_, args) => {
            return await data.task.removeTask(args.id);
        },
        editTask: (_, args) => {
            return data.task.patchTask(args.id, args);
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});