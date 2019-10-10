import withRepoBasic from '../../components/with-repo-basic'

const Issues = ({ text }) => {
  return <span>Issues page, {text} </span>
}

Issues.getInitialProps = async () => {
  return {
    text: 'issues 456'
  }
}

export default withRepoBasic(Issues, 'issues')