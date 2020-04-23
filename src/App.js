import React, { useState } from 'react'
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

  return (
    <ApolloProvider client={client}>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ after, before, first, last, query }}
      >
        {
          ({ loading, error, data }) => {
            if (loading) {
              return 'Loading...'
            }
            if (error) {
              return `Error! ${error.message}`
            }
            console.log({data})
            return <div></div>
          }
        }
      </Query>
    </ApolloProvider>
  )
}
