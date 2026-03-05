import type { Context } from 'hono'
import Papa from 'papaparse'

export const uploadSensorData = async (c: Context) => {
  try {
    // リクエストボディから FormData をパース
    const body = await c.req.parseBody({ all: true })

    // bodyから値取得(モバイル)
    const floorMapId = body.floorMapId
    const initialPosition = body.initialPosition
    const initialAngle = body.initialAngle
    let files = body.file

    if (!files) {
      return c.json({ error: 'CSVファイルがアップロードされていません' }, 400)
    }

    console.log({
      floorMapId,
      initialPosition,
      initialAngle,
      files,
    })

    if (!Array.isArray(files)) {
      files = [files]
    }

    // csvをparse
    const processedFiles = []
    for (const file of files) {
      if (typeof file === 'string') continue

      const text = await file.text()

      const parseResult = Papa.parse(text, {
        skipEmptyLines: true,
        header: true,
      })

      if (parseResult.errors.length > 0) {
        console.warn('parse error:', parseResult.errors)
      }

      processedFiles.push({
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        data: parseResult,
      })
    }

    return c.json({
      message: 'アップロード成功',
      files: processedFiles,
    })
  } catch (error) {
    console.error('Upload Error:', error)
    return c.json({ error: '解析処理中にエラーが発生しました' }, 500)
  }
}
