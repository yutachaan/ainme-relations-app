import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_NO_STATE_RELATIONS } from '../graphql/queries'
import { Box, Text, Flex, Button, CircularProgress } from '@chakra-ui/react'
import IgnoreListDrawer from './IgnoreListDrawer'

type Anime = {
  annictId: number
  seasonName: string | null
  seasonYear: number | null
  seriesName: string
  summary: string
  title: string
  viewerStatusState: string
}

type SeriesWorksEdge = {
  summary: string
  item: {
    annictId: number
    seasonName: string | null
    seasonYear: number | null
    title: string
    viewerStatusState: string
  }
}

type SeriesNode = {
  name: string
  works: {
    edges: SeriesWorksEdge[]
  }
}

type WorksNode = {
  seriesList: {
    nodes: SeriesNode[]
  }
}

type ViewerData = {
  viewer: {
    works: {
      nodes: WorksNode[]
    }
  }
}

const seasonNameMap: Record<string, string> = {
  WINTER: '冬',
  SPRING: '春',
  SUMMER: '夏',
  AUTUMN: '秋'
}

const ITEMS_PER_PAGE = 50

const AnimeListNoStateRelations = () => {
  const { loading, error, data } = useQuery<ViewerData>(GET_NO_STATE_RELATIONS)
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [ignoreList, setIgnoreList] = useState<string[]>(() => {
    // ローカルストレージから除外リストを取得
    const storedIgnoreList = localStorage.getItem('ignoreList')
    return storedIgnoreList ? JSON.parse(storedIgnoreList) : []
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (data) {
      // すべての視聴済みアニメの関連作品を取得し，フラット化
      const allWorks: Anime[] = data.viewer.works.nodes.flatMap((worksNode: WorksNode) =>
        worksNode.seriesList.nodes.flatMap((seriesNode: SeriesNode) =>
          seriesNode.works.edges.map((seriesWorksEdge: SeriesWorksEdge) => ({
            annictId: seriesWorksEdge.item.annictId,
            seasonName: seriesWorksEdge.item.seasonName,
            seasonYear: seriesWorksEdge.item.seasonYear,
            seriesName: seriesNode.name,
            summary: seriesWorksEdge.summary,
            title: seriesWorksEdge.item.title,
            viewerStatusState: seriesWorksEdge.item.viewerStatusState
          }))
        )
      )

      // 重複を削除
      const uniqueWorks = Array.from(new Map(allWorks.map(work => [work.annictId, work])).values())

      // ステータスが「未選択」のアニメに限定
      const noStateWorks = uniqueWorks.filter((work) => work.viewerStatusState === 'NO_STATE')

      // リリース時期でソート
      noStateWorks.sort((a, b) => {
        // リリース年と季節がどちらも未確定の場合は最後に
        if (a.seasonYear === null && a.seasonName === null) return 1
        if (b.seasonYear === null && b.seasonName === null) return -1

        // リリース年が確定している場合
        if (a.seasonYear === b.seasonYear) {
          // 片方が季節が未確定の場合はその片方をこのリリース年の中で最後に
          if (a.seasonName === null) return 1
          if (b.seasonName === null) return -1

          // 両方とも季節も確定している場合はリリース年・季節順でソート
          return seasonNameMap[a.seasonName as keyof typeof seasonNameMap]
            .localeCompare(seasonNameMap[b.seasonName as keyof typeof seasonNameMap])
        }

        // 片方のリリース年が未確定の場合，その片方を最後に
        if (a.seasonYear === null) return 1
        if (b.seasonYear === null) return -1

        // 両方のリリース年のみ確定している場合はリリース年順でソート
        return a.seasonYear - b.seasonYear
      })

      setAnimeList(noStateWorks)
    }
  }, [data])

  useEffect(() => {
    // 除外リストをローカルストレージに保存
    localStorage.setItem('ignoreList', JSON.stringify(ignoreList))
  }, [ignoreList])

  // 除外リストに含まれるアニメを除外
  const filteredAnimeList = animeList.filter(anime =>
    !ignoreList.some(keyword => (anime.title.includes(keyword) || anime.seriesName.includes(keyword)))
  )

  // 現在のページに表示するアニメのリストを取得
  const totalItems = filteredAnimeList.length
  const indexOfLastAnime = currentPage * ITEMS_PER_PAGE
  const indexOfFirstAnime = indexOfLastAnime - ITEMS_PER_PAGE
  const currentAnimeList = filteredAnimeList.slice(indexOfFirstAnime, indexOfLastAnime)

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" p="20px">
        <CircularProgress isIndeterminate color='gray.400' size="80px"/>
      </Flex>
    )
  }
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <Flex direction="column" align="center" p="20px">
      <IgnoreListDrawer ignoreList={ignoreList} setIgnoreList={setIgnoreList} />
      <Text fontSize="xl" fontWeight="bold">
        全 {totalItems} 件
      </Text>
      <Flex wrap="wrap" justify="center" p="20px">
        {currentAnimeList.map((anime) => (
          <Box
            key={anime.annictId}
            as="a"
            href={`https://annict.com/works/${anime.annictId}`}
            target="_blank"
            m="10px"
            p="4"
            w="300px"
            h="200px"
            borderWidth="1.5px"
            borderRadius="lg"
            overflow="hidden"
            textAlign="left"
            _hover={{ backgroundColor: 'cyan.50', transform: 'scale(1.05)', transition: 'all 0.2s' }}
          >
            <Text fontWeight="bold" fontSize="lg" mb="10px">{anime.title}</Text>
            <Text mb="10px">{anime.seriesName} {anime.summary ? '(' + anime.summary + ')' : ''}</Text>
            <Text mb="10px">
              リリース：{anime.seasonYear || '年未定'} {anime.seasonName ? seasonNameMap[anime.seasonName] : '時期未定'}
            </Text>
          </Box>
        ))}
      </Flex>
      <Flex mt="4">
        <Button onClick={handlePrevPage} isDisabled={currentPage === 1} mr="4">
          前へ
        </Button>
        <Text fontSize="lg" align="center" mt="2">
          {currentPage} / {totalPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={currentPage === totalPages} ml="4">
          次へ
        </Button>
      </Flex>
    </Flex>
  )
}

export default AnimeListNoStateRelations

// TODO
// ignore list (Drawer)
// 再取得ボタン
// ignore listをDBに保存
// font変更
