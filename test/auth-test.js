'use strict'

import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import fixtures from './fixtures'
import auth from '../auth'
import conf from '../config'
import utils from '../lib/utils'

test.beforeEach(async t => {
  let srv = micro(auth)
  t.context.url = await listen(srv)
})

test('success POSt /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    body: {
      username: user.username,
      password: user.password
    },
    json: true
  }

  let token = await request(options)
  let decoded = await utils.verifyToken(token, conf.secret)

  t.is(decoded.username, user.username)
})
