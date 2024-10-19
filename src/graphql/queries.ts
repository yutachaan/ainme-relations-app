import { gql } from "@apollo/client";

export const GET_ANIME_LIST = gql`
  query getAnimeList($username: String!) {
    user(username: $username) {
      works(state: WATCHED) {
        nodes {
          seriesList {
            nodes {
              name
              works {
                edges {
                  summary
                  item {
                    annictId
                    seasonName
                    seasonYear
                    title
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
