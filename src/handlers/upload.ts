import type { Context } from 'hono'

export const uploadSensorData = async (c: Context) => {
  try {
    // リクエストボディから FormData をパース
    const body = await c.req.parseBody()
    const file = body.file

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'CSVファイルがアップロードされていません' }, 400)
    }

    if (!file.name.endsWith('.csv')) {
      return c.json({ error: 'CSV形式のファイルのみ許可されています' }, 400)
    }

    const text = await file.text()
    const rows = text
      .trim()
      .split('\n')
      .map((row) => row.split(','))

    return c.json({
      message: 'アップロード成功',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      data: rows,
    })
  } catch (error) {
    console.error('Upload Error:', error)
    return c.json({ error: '解析処理中にエラーが発生しました' }, 500)
  }
}
