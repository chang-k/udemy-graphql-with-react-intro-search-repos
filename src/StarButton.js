import React from 'react'
import { ADD_STAR } from "./graphql"
import { Mutation } from 'react-apollo'

export const StarButton = ({node}) => {
  return(
    <Mutation mutation={ADD_STAR}>
      {addStar => <StarStatus addStar={addStar} node={node} />}
    </Mutation>
  )
}

const StarStatus = ({addStar, node}) => {
  const total = node.stargazers.totalCount
  const starCount = total === 1 ? "1 star" : `${total} stars`
  const viewerHasStarred = node.viewerHasStarred

  return (
    <button
      onClick={
        () => addStar({
          variables: {
            input: {
              starrableId: node.id
            }
          }
        })
      }
    >
      {starCount} | {viewerHasStarred ? "Starred" : "-"}
    </button>
  )
}