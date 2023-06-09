import type { NextApiRequest, NextApiResponse } from 'next'
import { getBaseUrl } from '../../../utils/api'

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  let data

  try {
    const fact = await (
      await fetch(`${getBaseUrl()}/api/trpc/auto.createFactSqueal`, {
        method: 'POST',
      })
    ).json()

    const joke = await (
      await fetch(`${getBaseUrl()}/api/trpc/auto.createJokeSqueal`, {
        method: 'POST',
      })
    ).json()

    await fetch(`${getBaseUrl()}/api/trpc/auto.fill`, {
      method: 'POST',
    })

    data = [fact, joke]
  } catch (error) {
    return response.status(500).json(error)
  }

  return response.status(200).json(data)
}
