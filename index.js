const { ApolloServer, gql } = require("apollo-server");

const data = require("./data");

//Create the type definitions for the query and our data
const typeDefs = gql`
    type Query {
        tasks: [Task]
#        employers: [Employer]
#        employees: [Employee]
        task(id: String): Task
#        employee(id: String): Employee
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
        removeTask(id: String!): [Task]
        editTask(
            id: String!
            title: String
            description: String
            hoursEstimated: Int
            completed: Boolean
        ): Task
    }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee

*/

const resolvers = {
    Query: {
        tasks: (_, args) => data.task.getAllTask(),
        task: (_, args) => data.task.getTaskById(args.id),
    },
    // Employer: {
    //     numOfTasks: parentValue => {
    //         console.log(`parentValue in Employer`, parentValue);
    //         return employees.filter(e => e.employerId === parentValue.id).length;
    //     },
    //     employees: parentValue => {
    //         return employees.filter(e => e.employerId === parentValue.id);
    //     }
    // },
    // Task: {
    //     task: parentValue => {
    //         return employers.filter(e => e.id === parentValue.employerId)[0];
    //     }
    // },

    Mutation: {
        addTask: async (_, args) => {
            const newTask = {
                id: args.id,
                title: args.title,
                description: args.description,
                hoursEstimated: args.hoursEstimated,
                completed: args.completed
            };
            returnval = await data.task.postTask(newEmployee);

            return returnval;
        },
        removeTask: (_, args) => {
            return data.task.removeTask(args.id)
        }
        // editEmployee: (_, args) => {
        //     // let newEmployee;
        //     //
        //     // employees = employees.map(e => {
        //     //     if (e.id === args.id) {
        //     //         if (args.firstName) {
        //     //             e.firstName = args.firstName;
        //     //         }
        //     //         if (args.lastName) {
        //     //             e.lastName = args.lastName;
        //     //         }
        //     //         if (args.employerId) {
        //     //             e.employerId = args.employerId;
        //     //         }
        //     //         newEmployee = e;
        //     //         return e;
        //     //     }
        //     //     return e;
        //     // });
        //     return {};
        // }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});