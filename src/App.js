import React, { useState, useRef, Fragment } from 'react'
import { ApolloProvider, Query } from "react-apollo"
import { client } from './client'
import { SEARCH_REPOSITORIES } from "./graphql"
import { StarButton } from "./StarButton"

const PER_PAGE = 5
const VARIABLES = {
  after: null,
	before: null,
	first: PER_PAGE,
	last: null,
	query: ""
}

export const App = () => {
  const [variables, setVariables] = useState(VARIABLES)
  const { after, before, first, last, query } = variables
  const inputEl = useRef("フロント");

  console.log("inputEl", inputEl)

  return (
    <ApolloProvider client={client}>
      <form
        onSubmit={e => (
          e.preventDefault(),
          setVariables({
            ...variables,
            query: inputEl.current.value
          }),
          console.log("setVariables", inputEl.current.value)
        )}
      >
        <input ref={inputEl} defaultValue={inputEl.current} />
        <input type="submit" value="SUBMIT" />
      </form>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ after, before, first, last, query }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return 'Loading...'
          }
          if (error) {
            return `Error! ${error.message}`
          }

          const repositoryUnit = data.search.repositoryCount <= 1 ? 'Repository' : 'Repositories'
          return (
            <Fragment>
              <h2>
                Github Repositories Search Results - {data.search.repositoryCount} {repositoryUnit}
              </h2>

              <ul>
                {data.search.edges.map(e => {
                  const node = e.node
                  return (
                    <li key={node.id}>
                      <a href={node.url}>{node.name}</a>
                      &nbsp;
                      &nbsp;
                      <StarButton
                        node={node}
                        {...{ after, before, first, last, query }}
                      />
                    </li>
                  )
                })}
              </ul>

              {/* 前の5件を表示 */}
              {data.search.pageInfo.hasPreviousPage && (
                <button
                  onClick={() =>
                    setVariables({
                      ...variables,
                      after: null,
                      before: data.search.pageInfo.startCursor,
                      first: null,
                      last: PER_PAGE,
                    })
                  }
                >
                  Previous
                </button>
              )}

              {/* 次の5件を表示 */}
              {data.search.pageInfo.hasNextPage && (
                <button
                  onClick={() =>
                    setVariables({
                      ...variables,
                      after: data.search.pageInfo.endCursor,
                      before: null,
                      first: PER_PAGE,
                      last: null,
                    })
                  }
                >
                  Next
                </button>
              )}
            </Fragment>
          )}}
      </Query>
    </ApolloProvider>
  )
}
