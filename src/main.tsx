import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from './apolloClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ApolloProvider>
  </StrictMode>,
)
