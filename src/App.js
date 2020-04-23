import React, { useState, Fragment } from 'react'
import { ApolloProvider, Query } from "react-apollo"
import { client } from './client'
import { SEARCH_REPOSITORIES } from "./graphql";

const VARIABLES = {
  after: null,
	before: null,
	first: 5,
	last: null,
	query: "フロントエンドエンジニア"
}

export const App = () => {
  const [variables, setVariables] = useState(VARIABLES)
  const { after, before, first, last, query } = variables
  console.log({query})

  return (
    <ApolloProvider client={client}>
      <form
        onSubmit={e => e.preventDefault()}
      >
        <input
          value={query}
          onChange={e => setVariables({
            ...variables,
            query: e.target.value
          })}
        />
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

          console.log({data})

          const repositoryUnit = data.search.repositoryCount <= 1 ? 'Repository' : 'Repositories'
          return (
            <Fragment>
              <h2>
                Github Repositories Search Results - {data.search.repositoryCount} {repositoryUnit}
              </h2>
              <ul>
                {data.search.edges.map(e => {
                  const n = e.node
                  return (
                    <li key={n.id}>
                      <a href={n.url}>{n.name}</a>
                    </li>
                  )
                })}
              </ul>
            </Fragment>
          )}}
      </Query>
    </ApolloProvider>
  )
}
