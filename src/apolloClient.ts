import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

const httpLink = new HttpLink({
  uri: 'https://api.annict.com/graphql',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_ANNICT_API_TOKEN}`
  }
})

const cache = new InMemoryCache()

const client = new ApolloClient({
  link: httpLink,
  cache
})

export default client
