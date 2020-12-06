const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { mongoDB } = require("./config.js");
const resolvers = require("./Graphql/resolvers");
const User = require("./models/User.js");
const typeDefs = require("./Graphql/typeDefs.js");

const port = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(mongoDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
    return server.listen({ port });
  })
  .then((res) => {
    console.log(`Server connection established at ${res.url}`);
  });
