/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import idx from 'idx.macro'

const styles = {
  error: css`
    color: darkred;
    padding: 1rem;
    margin-bottom: 0.5rem;

    p {
      margin: 0;
    }
  `,
}

function ErrorHandler(props) {
  const { error } = props

  if (!error || !error.message) return null

  const graphQLErrors = idx(error, _ => _.networkError.result.errors)

  if (graphQLErrors) {
    return graphQLErrors.map(error => (
      <div css={styles.error} key={error.message}>
        <p>
          <strong>Error:</strong> {error.message.replace('GraphQL error: ', '')}
        </p>
      </div>
    ))
  }

  return (
    <div css={styles.error}>
      <p>
        <strong>Error:</strong> {error.message.replace('GraphQL error: ', '')}
      </p>
    </div>
  )
}

export default ErrorHandler
