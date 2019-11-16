const server = require('server')
const fetch = require('node-fetch')
const Chatkit = require('pusher-chatkit-server')

const { get, post } = server.router
const { json, header, status, redirect } = server.reply

const credentials = require('./credentials.json')
const chatkit = new Chatkit.default(credentials)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
}

const GithubAccessTokenFromCode = code =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: 46953,
      client_secret: '4f7d91eacbd2496a4c141457bb7b117a0cf25d2a',
      code,
    }),
  })
    .then(res => res.json())
    .then(data => data.access_token)
    .catch(console.log)

const GithubUserFromAccessToken = token =>
  fetch(`https://api.github.com/user?access_token=${token}`)
    .then(res => res.json())
    .catch(console.log)

const ChatkitCredentialsFromGithubToken = token =>
  GithubUserFromAccessToken(token)
    .then(user =>
      chatkit.authenticate({ grant_type: 'client_credentials' }, user.login)
    )
    .catch(console.log)

const CreateChatkitUserFromGithubUser = user =>
  chatkit
    .createUser(user.login, user.name || user.login, user.avatar_url)
    .catch(console.log)

server({ port: process.env.PORT || 4000, security: { csrf: false } }, [
  ctx => header(cors),
  post('/auth', async ctx => {
    try {
      const { code } = JSON.parse(ctx.data)
      const token = await GithubAccessTokenFromCode(code)
      const user = await GithubUserFromAccessToken(token)
      const create = await CreateChatkitUserFromGithubUser(user)
      return json({ id: user.login, token })
    } catch (e) {
      console.log(e)
    }
  }),
  post('/token', async ctx => {
    try {
      const { token } = ctx.query
      const creds = await ChatkitCredentialsFromGithubToken(token)
      return json(creds)
    } catch (e) {
      console.log(e)
    }
  }),
  get('/success', async ctx => {
    const prod = 'https://pusher.github.io/chatkit-demo'
    const { code, state, url } = ctx.query
    return redirect(302, `${url || prod}?code=${code}&state=${state}`)
  }),
  get(ctx => status(404)),
])