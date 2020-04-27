import React from 'react'
import { ADD_STAR, REMOVE_STAR } from "./graphql"
import { Mutation } from 'react-apollo'

export const StarButton = ({node}) => {
  const total = node.stargazers.totalCount
  const starCount = total === 1 ? "1 star" : `${total} stars`
  const viewerHasStarred = node.viewerHasStarred
  const id = node.id

  return(
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}>
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