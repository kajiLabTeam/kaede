import { Hono } from 'hono'
import { uploadSensorData } from '../handlers/upload'

const api = new Hono()

api.post('/measurements/upload', uploadSensorData)

export default api
