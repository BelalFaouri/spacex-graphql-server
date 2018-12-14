const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const fetch = require("node-fetch");

const RocketType = new GraphQLObjectType({
  name: "RocketType",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString }
  })
});
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLString },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    rocket: { type: RocketType }
  })
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return fetch(
          "https://api.spacexdata.com/v3/launches/" + args.flight_number
        ).then(response => response.json());
      }
    },
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parentValue) {
        return fetch("https://api.spacexdata.com/v3/launches/").then(response =>
          response.json()
        );
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
