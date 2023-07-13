import React, {useState} from 'react'
import {CardType} from "./api/types";
import {Box, Button, Image, Text} from "@chakra-ui/react";

type CardProps = {
    card: CardType,
    updateCardNumber(card: CardType, increment: number): void,
    onPress(card: CardType): void
}

function Card({card, updateCardNumber, onPress}: CardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const onMouseEnter = () => {
        setIsHovered(true)
    }

    const onMouseLeave = () => {
        setIsHovered(false)
    }

    const onIncrement = () => {
        updateCardNumber(card, 1)
    }

    const onDecrement = () => {
        updateCardNumber(card, -1)
    }
    return (
        <Box width="240px" height="320px" _hover={{
            transform: "scale(1.1) translateY(-16px)",
            cursor: "pointer"
        }}
             pos="relative"
             transition="0.2s ease-out all"
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
             onClick={() => onPress(card)}
        >
            <Image width="240px" height="320px" src={card.image} alt={card.name}/>
            {isHovered && <Box
                pos="absolute"
                display="flex"
                gap="12px"
                top={0}
                left={0}
                width="240px"
                height="320px"
                justifyContent="center"
                alignItems="center">
                <Button backgroundColor="rgba(255,255,255,0.5)" _hover={{
                    backgroundColor: "rgba(255,255,255,0.9)"
                }} onClick={onDecrement}>-</Button>
                <Text backgroundColor="rgba(255,255,255,0.7)" py="8px" px="24px" fontSize="16px"
                      fontWeight="500" borderRadius="8px">{card.count}</Text>
                <Button backgroundColor="rgba(255,255,255,0.5)" _hover={{
                    backgroundColor: "rgba(255,255,255,0.9)"
                }} onClick={onIncrement}>+</Button>
            </Box>}
        </Box>
    )
}

export default Card