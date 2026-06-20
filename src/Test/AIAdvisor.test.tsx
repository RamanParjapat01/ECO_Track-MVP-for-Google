/ @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import AIAdvisor from '../components/AIAdvisor';

describe('AIAdvisor Component', () => {
    it('renders correctly', () => {
        render(<AIAdvisor commute={10} electricity={100} diet="vegetarian" />);
        const aiElements = screen.getAllByText(/AI/i); // Sabhi "AI" elements ki list le li
        expect(aiElements[0]).toBeTruthy(); // Pehle wale ko check kiya
    });
});