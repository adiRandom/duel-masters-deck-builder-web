import React, {useEffect, useState} from 'react';
import {useCards} from "./api/hooks";
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text
} from "@chakra-ui/react";
import Card from "./Card";
import {AppliedFilter, CardType} from "./api/types";
import FilterBar from "./FilterBar";
import {Link} from "react-router-dom";

function App() {

    const {addCard, cards, isLoading, updateCardNumber} = useCards({
        onError: (error) => {
            console.log(error)
        }
    })

    const [cardName, setCardName] = useState("")
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
    const [filteredCards, setFilteredCards] = useState<CardType[]>([])

    useEffect(() => {
        setFilteredCards(cards)
    }, [cards])

    const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            onAddCard()
        }
    }

    const onAddCard = () => {
        const name = cardName
        setCardName("")
        addCard(name)
    }

    const formatField = (s: string) => {
        return (s.charAt(0).toUpperCase() + s.slice(1))
    }

    const getFilterFunction = (filter: AppliedFilter) => {
        return (card: CardType) => {
            switch (filter.operator) {
                case "=":
                    return card[filter.field] === filter.value
                case "!=":
                    return card[filter.field] !== filter.value
                case ">":
                    return card[filter.field] > filter.value
                case "<":
                    return card[filter.field] < filter.value
                case "<=":
                    return card[filter.field] <= filter.value
                case ">=":
                    return card[filter.field] >= filter.value
                case "contains":
                    return (typeof card[filter.field] === "string") &&
                        (card[filter.field] as string).includes(filter.value as string)
                case "not contains":
                    return (typeof card[filter.field] === "string") &&
                        !(card[filter.field] as string).includes(filter.value as string)
            }
        }
    }

    const applyFilters = (appliedFilters: AppliedFilter[]) => {
        const filterFunctions = appliedFilters.map(filter => getFilterFunction(filter))

        let newCards = cards.filter(card =>
            filterFunctions.reduce((acc, filter) =>
                acc || filter(card), false)
        )


        setFilteredCards(newCards)
    }

    return (
        <Box width="100vw" height="100vh" py="24px" overflowY="auto" pos="relative">
            <Button pos="absolute" top="64px" right="64px"><Link to={"/deck"}>Go to decks</Link></Button>
            <Box width="100%" height="70%" display="flex" justifyContent="center" alignItems="center">
                <Input placeholder="Card Name" width="50%" value={cardName}
                       onKeyDown={onKeyDown}
                       onChange={ev => setCardName(ev.target.value)}/>
                <Button ml="16px" onClick={onAddCard}>Add</Button>
                {isLoading && <Spinner ml="12px" color='red.500'/>}
            </Box>
            <Box px="32px">
                <Heading as={"h1"} size="xl" mb="16px">Cards</Heading>
                <Box my="12px">
                    <FilterBar onApply={applyFilters}/>
                </Box>
                <Box display="flex" flexWrap="wrap" justifyContent="flex-start" gap="16px">
                    {filteredCards.map(card =>
                        (<Card updateCardNumber={updateCardNumber} key={card.name} card={card}
                               onPress={card => setSelectedCard(card)}/>))
                    }
                </Box>
            </Box>w
            <Modal isOpen={selectedCard !== null} onClose={() => setSelectedCard(null)}>
                <ModalOverlay/>
                <ModalContent maxW="80vw" width="80vw">
                    <ModalHeader>{selectedCard?.name.replace(/_/g, " ")}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody maxW="80vw" width="80vw" px="24px" py="12px">
                        <Flex width="80vw" py="36px" justifyContent="space-evenly">
                            <Image width="300px" height="400px" src={selectedCard?.image} alt={selectedCard?.name}/>
                            <Flex flexDir="column" justifyContent="center"
                                  backgroundColor="#e3e3e3" borderRadius="12px" px="16px"
                                  maxW="50%" py="8px">
                                {Object.entries(selectedCard ?? {}).map(([key, value]) =>
                                    (key !== "flavorText" && key !== "image" &&
                                        <Flex className="card-info" mx="4px" borderBottom="1px solid #acacac" my="4px"
                                              alignItems="center">
                                            <Text
                                                fontSize="20px"
                                                fontWeight="500"
                                                mr="8px"> {formatField(key)}
                                            </Text>
                                            <Text fontSize="16px">{value}</Text>
                                        </Flex>
                                    )
                                )}
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default App;
