// src/GlowingImage.js
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.98);
  }
`;

const src = 'https://images.unsplash.com/photo-1612838320303-3e3e3e3e3e3e';

const GlowingImageRoot = styled.div`
    position: relative;
    border-radius: 0.6rem;
    &:before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${src};
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: -1;
        border-radius: inherit;
        /* You can change these values until it looks fine to you */
        filter: blur(0.6rem) saturate(2);
    }
    &:hover {
        &:before {
            animation: ${glow} 500ms ease-in-out alternate infinite;
        }
    }
    > img {
        width: 100%;
        object-fit: cover;
        border-radius: inherit;
        transform: scale(0.98);
    }
`;

export const GlowingImage = () => {
    return (
        <GlowingImageRoot>
            <img src={src} />
        </GlowingImageRoot>
    );
};
export default GlowingImage;
