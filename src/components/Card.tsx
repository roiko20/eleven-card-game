import React from 'react';
import { Rank, Suit, CardType } from "../lib";
import { motion } from 'framer-motion';
import styled from 'styled-components';

export interface CardProps {
    card: CardType;
    showBack?: boolean;
    dropArea?: boolean;
    numImages?: number;
    index: number;
    selected?: boolean;
}

export const StyledCard = styled(motion.img)<{ $hidden?: boolean; $numImages?: number;}>`
  height: 100%;
  max-width: ${({ $numImages }) => ($numImages ? `calc(100% / ${$numImages})` : '100%')};
`;

const getCardAnimation = (index: number, selected: boolean) => {
    if (selected) {
      return {
        scale: 1,
        opacity: 1,
        x: 0,
        y: -15,
        transition: {
          duration: 0.5,
          delay: 0.5
        }
      }
    }
    return {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.2,
        duartion: 0.1
      }
    }
  }

export default function Card({card, showBack, dropArea, numImages, index, selected = false}: CardProps) {
    console.log(card);
    const src = showBack 
        ? CARD_BACK_SVG_PATH
        : dropArea
            ? DROP_AREA_SVG_PATH
            : createCardSVGPath(card);
    return (
        // <div
        // //   className="relative h-card-height w-card-width"
        // //   style={{ zIndex: props.z ?? "unset" }}
        // >
        //   {/* <AnimatePresence>
        //     {props.withSelector && (
        //       <Selector
        //         onClick={(n) => props.onClick?.(props.card, n)}
        //         selectorMax={props.selectorMax ?? 4}
        //       />
        //     )}
        //   </AnimatePresence> */}
    
        //   {/* <motion.img
        //     onClick={() => props.onClick?.(props.card)}
        //     layoutId={props.card?.toString()}
        //     animate={{
        //       filter: props.grayOut ? "contrast(0.55)" : "contrast(1)",
        //       transition: {
        //         duration: 1.5,
        //       },
        //     }}
        //     className={clsx(
        //       "select-none",
        //       !props.noShadow && "shadow-lg shadow-zinc-500/40 drop-shadow-xl",
        //       isFace && "rounded-lg border-white bg-white p-1",
        //       props.withSelector && "rounded-t-none rounded-b-lg bg-white"
        //     )}
        //     src={src}
        //   /> */}
        //   <img src={src} />
        // </div>
        <StyledCard
            src={src}
            $numImages={numImages}
            initial={{ opacity: 0, x: -100, scale: 1.2 }}
            animate={getCardAnimation(index, selected)}
            whileHover={!dropArea ? {y: -7, cursor: 'grab'} : {}}
        />
      );
}

function createCardSVGPath(card: CardType) {
    return (
      CARDS_PREFIX_PATH +
      card.suit +
      "-" +
      card.value +
      ".svg"
    );
  }

const CARDS_PREFIX_PATH = "/cards/";
const CARD_BACK_SVG_PATH = `${CARDS_PREFIX_PATH}BACK.svg`;
const DROP_AREA_SVG_PATH = `${CARDS_PREFIX_PATH}DROP-AREA.svg`;
