import type { NextApiRequest, NextApiResponse } from 'next'
import { getBaseUrl } from '../../../utils/api'

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  let data

  try {
    data = await (
      await fetch(`${getBaseUrl()}/api/trpc/auto.createFactSqueal`, {
        method: 'POST',
      })
    ).json()
  } catch (error) {
    return response.status(500).json(error)
  }

  return response.status(200).json(data)
}
