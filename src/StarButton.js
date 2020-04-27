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
      refetchQueries={ mutationResult => {
        console.log(mutationResult)
        return [
            {
              query: SEARCH_REPOSITORIES,
              variables: { after, before, first, last, query }
            }
        ]
      }}
    >
      {addOrRemoveStar =>
        <StarStatus
          addOrRemoveStar={addOrRemoveStar}
          starCount={starCount}
          viewerHasStarred={viewerHasStarred}
          id={id}
        />
      }
    </Mutation>
  )
}

const StarStatus = ({
    addOrRemoveStar,
    starCount,
    viewerHasStarred,
    id
}) => {
  return (
    <button
      onClick={
        () => addOrRemoveStar({
          variables: {
            input: {
              starrableId: id
            }
          }
        })
      }
    >
      {starCount} | {viewerHasStarred ? "Starred" : "-"}
    </button>
  )
}