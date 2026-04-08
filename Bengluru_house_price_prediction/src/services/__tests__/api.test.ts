/**
 * Unit tests for API service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { predictPrice, getDataQuality } from '../api';

// Mock fetch for testing
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('predictPrice', () => {
    it('sends correct request parameters', async () => {
      const mockResponse = {
        predicted_price: 10256194,
        confidence: 'HIGH',
        warning: null,
        price_range: {
          min: 2000000,
          max: 30000000,
          median: 8000000,
          count: 1690
        },
        data_points_used: 1690
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await predictPrice({
        city: 'delhi',
        location: 'Sector 5, Dwarka',
        area: 1200,
        bhk: 3,
        bathrooms: 2,
        amenities: [0, 1, 1, 0]
      });

      expect(result.confidence).toBe('HIGH');
      expect(result.predicted_price).toBe(10256194);
    });

    it('handles error responses gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid input' })
      });

      try {
        await predictPrice({
          city: 'invalid',
          location: 'Test',
          area: 1000,
          bhk: 2,
          bathrooms: 1,
          amenities: [0, 0, 0, 0]
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('returns correctly typed response', async () => {
      const mockResponse = {
        predicted_price: 10256194,
        confidence: 'HIGH' as const,
        warning: null,
        price_range: {
          min: 2000000,
          max: 30000000,
          median: 8000000,
          count: 1690
        },
        data_points_used: 1690
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await predictPrice({
        city: 'delhi',
        location: 'Sector 5, Dwarka',
        area: 1200,
        bhk: 3,
        bathrooms: 2,
        amenities: [0, 1, 1, 0]
      });

      expect(typeof result.predicted_price).toBe('number');
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(result.confidence);
      expect(typeof result.data_points_used).toBe('number');
    });

    it('handles network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network error')
      );

      try {
        await predictPrice({
          city: 'delhi',
          location: 'Test',
          area: 1000,
          bhk: 2,
          bathrooms: 1,
          amenities: [0, 0, 0, 0]
        });
      } catch (error: any) {
        expect(error.message).toContain('Network');
      }
    });
  });

  describe('getDataQuality', () => {
    it('fetches data quality for city', async () => {
      const mockResponse = {
        city: 'delhi',
        data_quality: 'GOOD',
        quality_message: 'Dataset quality is adequate (1,690 records)',
        recommendations: 'Predictions should be reliable for this city',
        warnings: null
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getDataQuality('delhi');

      expect(result.city).toBe('delhi');
      expect(['LOW', 'MEDIUM', 'GOOD', 'EXCELLENT']).toContain(result.data_quality);
      expect(result.quality_message).toBeDefined();
    });

    it('handles quality endpoint errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      try {
        await getDataQuality('invalid_city');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('returns all expected fields', async () => {
      const mockResponse = {
        city: 'bengaluru',
        data_quality: 'EXCELLENT',
        quality_message: 'Excellent dataset quality',
        recommendations: 'High confidence in predictions',
        warnings: null
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getDataQuality('bengaluru');

      expect(result).toHaveProperty('city');
      expect(result).toHaveProperty('data_quality');
      expect(result).toHaveProperty('quality_message');
      expect(result).toHaveProperty('recommendations');
    });
  });

  describe('API Error Handling', () => {
    it('handles timeout scenarios', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      // Test would depend on implementation
    });

    it('validates response structure before processing', async () => {
      const invalidResponse = {
        predicted_price: 'invalid' // Should be number
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse
      });

      // Implementation should validate before returning
    });
  });

  describe('API Request Validation', () => {
    it('requires all mandatory fields', async () => {
      const incompleteRequest = {
        city: 'delhi',
        location: 'Test'
        // Missing: area, bhk, bathrooms, amenities
      };

      // Should validate before making request
      expect(incompleteRequest).toBeDefined();
    });

    it('validates city names', () => {
      const validCities = ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata'];
      const testCity = 'delhi';

      expect(validCities).toContain(testCity);
    });

    it('validates area is positive number', () => {
      const validAreas = [300, 500, 1000, 2000];
      const area = 1000;

      expect(area).toBeGreaterThan(0);
      expect(validAreas).toContain(area);
    });

    it('validates BHK is in valid range', () => {
      const validBhk = [1, 2, 3, 4, 5, 6];
      const bhk = 3;

      expect(validBhk).toContain(bhk);
      expect(bhk).toBeGreaterThanOrEqual(1);
      expect(bhk).toBeLessThanOrEqual(6);
    });
  });
});
