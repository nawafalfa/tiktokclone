import { ApolloClient, createHttpLink , InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import * as SecureStore from 'expo-secure-store'

// const client = new ApolloClient({
//     uri: 'http://34.142.135.130/',
//     cache: new InMemoryCache(),
//   });

const httpLink = createHttpLink({
    uri: 'https://deployfase3.nawafweb.cloud'
})

const authLink = setContext(async (_, { headers }) => {
    const token = await SecureStore.getItemAsync('accessToken');

    return  { 
        headers : {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

export default client;