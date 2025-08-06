import { api, API_BASE_URL } from '../api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Base', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('api helpers', () => {
    it('should make GET request', async () => {
      const mockResponse = { data: 'test' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await api.get('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should make POST request', async () => {
      const mockData = { name: 'test' }
      const mockResponse = { id: '1', ...mockData }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await api.post('/test', mockData)

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
          headers: { 'Content-Type': 'application/json' },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should make PUT request', async () => {
      const mockData = { name: 'updated' }
      const mockResponse = { id: '1', ...mockData }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await api.put('/test', mockData)

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockData),
          headers: { 'Content-Type': 'application/json' },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should make DELETE request', async () => {
      const mockResponse = { deleted: true }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await api.delete('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const errorResponse = { message: 'Not found' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(errorResponse),
      })

      await expect(api.get('/test')).rejects.toThrow('HTTP error! status: 404')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(api.get('/test')).rejects.toThrow('Network error')
    })
  })
}) 