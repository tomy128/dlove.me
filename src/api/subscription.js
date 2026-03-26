import api from './index'

export function getSubscriptionPlans() {
  return api.get('/v1/users/subscription/plans')
}

export function createSubscription(data) {
  return api.post('/v1/users/subscription', data)
}

export function getMySubscription() {
  return api.get('/v1/users/subscription/me')
}
