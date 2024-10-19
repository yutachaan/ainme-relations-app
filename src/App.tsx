import AnimeListNoStateRelations from './components/AnimeListNoStateRelations'
import './App.css'
import theme from './theme'
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <header>
          <h1>視聴済みアニメの関連作品のうち未視聴のアニメ</h1>
        </header>
        <main>
          <AnimeListNoStateRelations />
        </main>
      </ChakraProvider>
    </>
  )
}

export default App
