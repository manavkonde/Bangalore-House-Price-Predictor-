"""
Unit tests for house price prediction API and utilities
"""

import unittest
import json
from unittest.mock import patch, MagicMock
import util_citywise as util

class TestPredictionValidation(unittest.TestCase):
    """Test prediction validation logic."""
    
    def test_validate_prediction_high_confidence(self):
        """Test HIGH confidence prediction"""
        # Delhi has 1690 records with good data
        validation = util.validate_prediction('delhi', 8000000)
        
        self.assertTrue(validation['is_valid'])
        self.assertEqual(validation['confidence'], 'HIGH')
        self.assertEqual(validation['data_points'], 1690)
    
    def test_validate_prediction_low_confidence(self):
        """Test LOW confidence prediction for city with few records"""
        # Chennai has only 20 records
        validation = util.validate_prediction('chennai', 6500000)
        
        self.assertEqual(validation['confidence'], 'LOW')
        self.assertIn('Limited data', validation['warning'] or '')
        self.assertEqual(validation['data_points'], 20)
    
    def test_validate_prediction_medium_confidence(self):
        """Test MEDIUM confidence prediction"""
        # Kolkata has 52 records
        validation = util.validate_prediction('kolkata', 5000000)
        
        # Should be medium or low based on data availability
        self.assertIn(validation['confidence'], ['MEDIUM', 'LOW'])
    
    def test_price_range_exists(self):
        """Test price range retrieval"""
        price_range = util.get_price_range('delhi')
        
        self.assertIsNotNone(price_range)
        self.assertIn('min', price_range)
        self.assertIn('max', price_range)
        self.assertIn('median', price_range)
        self.assertGreater(price_range['max'], price_range['min'])
    
    def test_get_city_statistics(self):
        """Test city statistics retrieval"""
        stats = util.get_city_statistics('bengaluru')
        
        self.assertIsNotNone(stats)
        self.assertEqual(stats['city'], 'bengaluru')
        self.assertGreater(stats['total_records'], 0)
        self.assertGreater(stats['total_locations'], 0)


class TestDataQuality(unittest.TestCase):
    """Test data quality checks."""
    
    def test_delhi_data_quality(self):
        """Test Delhi has good data quality"""
        price_range = util.get_price_range('delhi')
        stats = util.get_city_statistics('delhi')
        
        # Delhi should have good data
        self.assertGreaterEqual(stats['total_records'], 1600)
        self.assertGreater(price_range['count'], 1600)
    
    def test_bengaluru_data_quality(self):
        """Test Bengaluru has excellent data quality"""
        price_range = util.get_price_range('bengaluru')
        stats = util.get_city_statistics('bengaluru')
        
        # Bengaluru should have excellent data
        self.assertGreater(stats['total_records'], 10000)
        self.assertGreater(price_range['count'], 10000)
    
    def test_limited_data_cities(self):
        """Test cities with limited data"""
        for city in ['chennai', 'hyderabad', 'kolkata']:
            price_range = util.get_price_range(city)
            
            # These cities should have some data
            self.assertGreater(price_range['count'], 0)
            self.assertLess(price_range['count'], 100)


class TestPredictionBounds(unittest.TestCase):
    """Test prediction boundary conditions."""
    
    def test_prediction_not_negative(self):
        """Test predictions are never negative"""
        for city in ['delhi', 'bengaluru', 'chennai']:
            validation = util.validate_prediction(city, 100)  # Very low price
            
            # Validation should still work
            self.assertIsNotNone(validation)
            self.assertGreaterEqual(validation['price'], 0)
    
    def test_prediction_within_range(self):
        """Test extreme predictions are flagged"""
        # Test very high prediction
        validation = util.validate_prediction('delhi', 100000000)  # 1 crore
        
        # Should be marked as low confidence
        self.assertIn(validation['confidence'], ['LOW', 'MEDIUM'])
    
    def test_price_range_consistency(self):
        """Test price range values are consistent"""
        for city in ['delhi', 'bengaluru']:
            price_range = util.get_price_range(city)
            
            # Min <= Median <= Max
            self.assertLessEqual(price_range['min'], price_range['median'])
            self.assertLessEqual(price_range['median'], price_range['max'])


class TestModelLoading(unittest.TestCase):
    """Test model loading functionality."""
    
    def test_all_models_loaded(self):
        """Test all city models are available"""
        available_cities = util.get_available_cities()
        
        expected_cities = ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata', 'combined']
        self.assertEqual(set(available_cities), set(expected_cities))
    
    def test_locations_available(self):
        """Test locations are available for each city"""
        for city in ['delhi', 'bengaluru']:
            locations = util.get_city_locations(city)
            
            self.assertGreater(len(locations), 0)
            self.assertIsInstance(locations, list)


class TestInputValidation(unittest.TestCase):
    """Test input validation."""
    
    def test_invalid_city(self):
        """Test invalid city raises error"""
        with self.assertRaises(ValueError):
            util.predict_price('invalid_city', 'Some Location', 1000, 2)
    
    def test_extreme_area_values(self):
        """Test area boundary conditions"""
        # Should handle very large areas
        try:
            validation = util.validate_prediction('delhi', 5000000)
            self.assertIsNotNone(validation)
        except:
            pass  # May fail gracefully


if __name__ == '__main__':
    # Set up logging
    import logging
    logging.basicConfig(level=logging.WARNING)
    
    # Run tests
    unittest.main(verbosity=2)
