import { gql } from '@apollo/client'

export const GET_NO_STATE_RELATIONS = gql`
  query {
    viewer {
      works(state: WATCHED) {
        nodes {
          title,
          seriesList {
            nodes {
              name,
              works {
                edges {
                  summary,
                  item {
                    annictId,
                    seasonName,
                    seasonYear,
                    title,
                    viewerStatusState
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
