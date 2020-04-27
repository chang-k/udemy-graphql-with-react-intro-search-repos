import React from 'react'
import { SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from "./graphql"
import { Mutation } from 'react-apollo'

export const StarButton = props => {
  const { node, after, before, first, last, query } = props
  const total = node.stargazers.totalCount
  const starCount = total === 1 ? "1 star" : `${total} stars`
  const viewerHasStarred = node.viewerHasStarred
  const id = node.id

  return(
    <Mutation
      mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}
    //   refetchQueries={ mutationResult => {
    //     console.log(mutationResult)
    //     return [
    //         {
    //           query: SEARCH_REPOSITORIES,
    //           variables: { after, before, first, last, query }
    //         }
    //     ]
    //   }}
    >
      {addOrRemoveStar =>
        <StarStatus
          addOrRemoveStar={addOrRemoveStar}
          starCount={starCount}
          viewerHasStarred={viewerHasStarred}
          id={id}
          {...{ after, before, first, last, query }}
        />
      }
    </Mutation>
  )
}

const StarStatus = props => {
  const {
    addOrRemoveStar,
    starCount,
    viewerHasStarred,
    id,
    after,
    before,
    first,
    last,
    query
  } = props

  return (
    <button
      onClick={
        () => addOrRemoveStar({
          variables: {
            input: {
              starrableId: id
            }
          },
          update: (store, {data: {addStar, removeStar}}) => {
            const { starrable } = addStar || removeStar
            console.log(starrable)

            const data = store.readQuery({
              query: SEARCH_REPOSITORIES,
              variables: { after, before, first, last, query }
            })
            const newEdges = data.search.edges.map(e => {
              if (e.node.id === id) {
                const totalCount = e.node.stargazers.totalCount
                const diff = starrable.viewerHasStarred ? 1 : -1
                const newTotalCount = totalCount + diff
                e.node.stargazers.totalCount = newTotalCount
              }
              return e
            })
            data.search.edges = newEdges
            store.writeQuery({ query: SEARCH_REPOSITORIES, data })
          }
        })
      }
    >
      {starCount} | {viewerHasStarred ? "Starred" : "-"}
    </button>
  )
}