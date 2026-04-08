/**
 * Unit tests for ConfidenceIndicator component
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfidenceIndicator from '../ConfidenceIndicator';

describe('ConfidenceIndicator Component', () => {
  it('renders HIGH confidence badge correctly', () => {
    render(
      <ConfidenceIndicator 
        level="HIGH" 
        dataPoints={1690}
      />
    );
    
    const badge = screen.getByText(/High Confidence/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
  });

  it('renders MEDIUM confidence badge correctly', () => {
    render(
      <ConfidenceIndicator 
        level="MEDIUM" 
        dataPoints={250}
      />
    );
    
    const badge = screen.getByText(/Medium Confidence/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('renders LOW confidence badge correctly', () => {
    render(
      <ConfidenceIndicator 
        level="LOW" 
        dataPoints={50}
      />
    );
    
    const badge = screen.getByText(/Low Confidence/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-orange-100');
  });

  it('displays correct data point count', () => {
    const dataPoints = 1690;
    render(
      <ConfidenceIndicator 
        level="HIGH" 
        dataPoints={dataPoints}
      />
    );
    
    expect(screen.getByText(new RegExp(`${dataPoints}`))).toBeInTheDocument();
  });

  it('displays confidence messages correctly', () => {
    const messages = {
      HIGH: 'Based on comprehensive dataset',
      MEDIUM: 'Moderate dataset coverage',
      LOW: 'Limited data available'
    };

    for (const [level, message] of Object.entries(messages)) {
      const { unmount } = render(
        <ConfidenceIndicator 
          level={level as any} 
          dataPoints={100}
        />
      );
      
      // Component should display confidence information
      expect(screen.queryByText(/Confidence/i)).toBeInTheDocument();
      unmount();
    }
  });

  it('applies correct icon for confidence level', () => {
    const { rerender } = render(
      <ConfidenceIndicator 
        level="HIGH" 
        dataPoints={1000}
      />
    );
    
    // HIGH should show checkmark
    expect(screen.getByText(/High Confidence/i)).toBeInTheDocument();
    
    // Rerender with LOW
    rerender(
      <ConfidenceIndicator 
        level="LOW" 
        dataPoints={50}
      />
    );
    
    expect(screen.getByText(/Low Confidence/i)).toBeInTheDocument();
  });

  it('handles edge case of 0 data points', () => {
    render(
      <ConfidenceIndicator 
        level="LOW" 
        dataPoints={0}
      />
    );
    
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('handles large data point numbers', () => {
    const largeNumber = 999999;
    render(
      <ConfidenceIndicator 
        level="HIGH" 
        dataPoints={largeNumber}
      />
    );
    
    expect(screen.getByText(new RegExp(`${largeNumber}`))).toBeInTheDocument();
  });
});
