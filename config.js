const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '26dbc07f67038c430e72'

module.exports = {
  github: {
    client_id,
    client_secret: '627fadc84e8e96ba4819458311557b98c4d6ffe4',
    request_token_url: 'https://github.com/login/oauth/access_token'
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}