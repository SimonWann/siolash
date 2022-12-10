import axios from 'axios'

export const baseUrl = new URL('/', 'http://127.0.0.1:9090')
export const requestor = axios.create({
  baseURL: 'http://127.0.0.1:9090'
})