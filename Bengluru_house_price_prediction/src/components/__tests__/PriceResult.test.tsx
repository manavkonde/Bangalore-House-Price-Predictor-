/**
 * Unit tests for PriceResult component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PriceResult from '../PriceResult';

describe('PriceResult Component', () => {
  const mockPredictionData = {
    predictedPrice: 10256194,
    confidence: 'HIGH' as const,
    warning: null,
    priceRange: {
      min: 2000000,
      max: 30000000,
      median: 8000000,
      count: 1690
    },
    dataPointsUsed: 1690
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders predicted price correctly', () => {
    render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence={mockPredictionData.confidence}
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={mockPredictionData.dataPointsUsed}
        warning={mockPredictionData.warning}
      />
    );

    // Price should be displayed
    const priceText = screen.getByText(/₹/);
    expect(priceText).toBeInTheDocument();
  });

  it('displays confidence indicator', () => {
    render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence={mockPredictionData.confidence}
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={mockPredictionData.dataPointsUsed}
        warning={mockPredictionData.warning}
      />
    );

    expect(screen.getByText(/High Confidence/i)).toBeInTheDocument();
  });

  it('shows price range information', () => {
    render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence={mockPredictionData.confidence}
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={mockPredictionData.dataPointsUsed}
        warning={mockPredictionData.warning}
      />
    );

    // Should display price range info
    expect(screen.getByText(/range|Range|min|max/i)).toBeInTheDocument();
  });

  it('displays warning when provided', () => {
    const warningMessage = 'Limited data available for this location';
    
    render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence="LOW"
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={20}
        warning={warningMessage}
      />
    );

    expect(screen.getByText(warningMessage)).toBeInTheDocument();
  });

  it('does not show warning when none provided', () => {
    const { container } = render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence={mockPredictionData.confidence}
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={mockPredictionData.dataPointsUsed}
        warning={null}
      />
    );

    // Should not have warning alert
    const warnings = screen.queryAllByText(/warning|alert/i);
    // Filtered to only actual warnings, not casual mentions
    const actualWarnings = warnings.filter(el => 
      el.parentElement?.className?.includes('alert') || 
      el.parentElement?.className?.includes('warning')
    );
    expect(actualWarnings.length).toBe(0);
  });

  it('formats price correctly for display', () => {
    const testPrice = 10256194;
    
    render(
      <PriceResult 
        predictedPrice={testPrice}
        confidence="HIGH"
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={1690}
        warning={null}
      />
    );

    // Price should be visible in readable format
    const priceElement = screen.getByText(/₹/);
    expect(priceElement).toBeInTheDocument();
  });

  it('displays data points count', () => {
    const dataPoints = 1690;
    
    render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence={mockPredictionData.confidence}
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={dataPoints}
        warning={null}
      />
    );

    expect(screen.getByText(new RegExp(dataPoints.toString()))).toBeInTheDocument();
  });

  it('handles LOW confidence appropriately', () => {
    render(
      <PriceResult 
        predictedPrice={mockPredictionData.predictedPrice}
        confidence="LOW"
        priceRange={mockPredictionData.priceRange}
        dataPointsUsed={20}
        warning="Limited data"
      />
    );

    expect(screen.getByText(/Low Confidence/i)).toBeInTheDocument();
  });

  it('handles extreme price ranges', () => {
    const extremeRange = {
      min: 1000000,
      max: 100000000,
      median: 15000000,
      count: 500
    };

    render(
      <PriceResult 
        predictedPrice={50000000}
        confidence="MEDIUM"
        priceRange={extremeRange}
        dataPointsUsed={500}
        warning="High price variance in area"
      />
    );

    const warning = screen.getByText(/High price variance/i);
    expect(warning).toBeInTheDocument();
  });
});
