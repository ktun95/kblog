/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jsdom } from 'jsdom'
import { render, screen } from '@testing-library/react';
import { Main, Map } from '../client/components'

describe('Main', () => {
    it('renders Main component', ()=> {
        render(<Main />)
        screen.debug()
    })
});

// describe('Map', () => {
//     it('renders a map', () => {
//         const map = render(<Map />)
        
//         expect(screen.getByTestId('map').toBeInTheDocument)
//     })
// })