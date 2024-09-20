import React, { useContext } from 'react';
import { CardType } from "../lib";
import { motion } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';

export interface DropAreaProps {
}

const StyledDropAreaContainer = styled('div')`
    border: 3px dashed #e6ffe6;
    border-radius: 16px;
`;

// const StyledDropAreaTextContainer = styled('div')`
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// `;

const StyledDropAreaText = styled('span')`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(16px, 4vh, 32px);
    line-height: 3.5rem;
    color: #e6ffe6;
`;

export default function DropArea({}: DropAreaProps) {
    return (
        <StyledDropAreaContainer>
            {/* <StyledDropAreaTextContainer> */}
                <StyledDropAreaText>
                    DROP<br />AREA
                </StyledDropAreaText>
            {/* </StyledDropAreaTextContainer> */}
        </StyledDropAreaContainer>
      );
}
