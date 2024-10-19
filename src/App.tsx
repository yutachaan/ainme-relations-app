import AnimeListNoStateRelations from './components/AnimeListNoStateRelations'
import './App.css'

function App() {
  return (
    <>
      <header>
        <h1>視聴済みアニメの関連作品のうち未視聴のアニメ</h1>
      </header>
      <main>
        <AnimeListNoStateRelations />
      </main>
    </>
  )
}

export default App
