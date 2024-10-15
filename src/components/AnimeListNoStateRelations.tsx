import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_NO_STATE_RELATIONS } from '../graphql/queries'
import { Text } from '@chakra-ui/react'

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

const seasonOrder = ['WINTER', 'SPRING', 'SUMMER', 'AUTUMN']; // リリース時期の順序

const AnimeListNoStateRelations = () => {
  const { loading, error, data } = useQuery<ViewerData>(GET_NO_STATE_RELATIONS)
  const [animeList, setAnimeList] = useState<Anime[]>([])

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

      // ステータスが「未選択」のアニメに限定
      const noStateWorks = allWorks.filter((work) => work.viewerStatusState === 'NO_STATE')

      // 重複を削除
      const uniqueNoStateWorks = Array.from(new Map(noStateWorks.map(work => [work.annictId, work])).values())

      // リリース時期でソート
      uniqueNoStateWorks.sort((a, b) => {
        // リリース年と季節がどちらも未確定の場合は最後に
        if (a.seasonYear === null && a.seasonName === null) return 1;
        if (b.seasonYear === null && b.seasonName === null) return -1;

        // リリース年が確定している場合
        if (a.seasonYear === b.seasonYear) {
          // 片方が季節が未確定の場合はその片方をこのリリース年の中で最後に
          if (a.seasonName === null) return 1;
          if (b.seasonName === null) return -1;

          // 両方とも季節も確定している場合はリリース年・季節順でソート
          return seasonOrder.indexOf(a.seasonName) - seasonOrder.indexOf(b.seasonName);
        }

        // 片方のリリース年が未確定の場合，その片方を最後に
        if (a.seasonYear === null) return 1;
        if (b.seasonYear === null) return -1;

        // 両方のリリース年のみ確定している場合はリリース年順でソート
        return a.seasonYear - b.seasonYear;
      })

      setAnimeList(uniqueNoStateWorks)
    }
  }, [data])

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return <></>
}

export default AnimeListNoStateRelations
