/** @vitest-environment jsdom */
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DoomsdayChart from '../components/DoomsdayChart';

describe('DoomsdayChart Component', () => {
    it('renders without crashing', () => {
        // Mock data pass kar rahe hain agar chart ko chahiye
        render(<DoomsdayChart dailyTotal={10} />);
        expect(true).toBe(true);
    });
});