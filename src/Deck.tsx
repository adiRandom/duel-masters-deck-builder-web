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
    Text
} from "@chakra-ui/react";
import Card from "./Card";
import {AppliedFilter, CardType, DeckType, Filter, newDeck} from "./api/types";
import FilterBar from "./FilterBar";
import {Link} from "react-router-dom";
import SortDropdown, {SORT_OPTIONS} from "./SortDrpdown";


function Deck() {

    const {cards, saveDeck, decks} = useCards({
        onError: (error) => {
            console.log(error)
        }
    })

    const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
    const [filteredCards, setFilteredCards] = useState<CardType[]>([])
    const [deck, setDeck] = useState<DeckType>(newDeck())
    const [isDeckUnsaved, setIsDeckUnsaved] = useState(false)
    const [showDeckCards, setShowDeckCards] = useState(false)
    const [sortBy, setSortBy] = useState<Filter>(SORT_OPTIONS[0])


    useEffect(() => {
        setFilteredCards(cards)
    }, [cards])

    useEffect(() => {
        // Prompt user to save deck if they navigate away without saving
        window.onbeforeunload = () => {
            if (isDeckUnsaved) {
                return true
            }
        }
    }, [isDeckUnsaved])


    const formatField = (s: string) => {
        return (s.charAt(0).toUpperCase() + s.slice(1))
    }

    const getSortByFn = (field: keyof CardType) => {
        return (a: CardType, b: CardType) => {
            if (a[field] < b[field]) {
                return -1
            }
            if (a[field] > b[field]) {
                return 1
            }
            return 0
        }
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

    const onSaveDeck = async () => {
        await saveDeck(deck)
        setIsDeckUnsaved(false)
    }

    const onLoadDeck = (deck: DeckType) => {
        if (isDeckUnsaved) {
            // eslint-disable-next-line no-restricted-globals
            const res = confirm("You have unsaved changes. Are you sure you want to load a new deck? (y/n)")
            if (res) {
                setDeck(deck)
                setIsDeckUnsaved(false)
            }
            return
        }

        setDeck(deck)
        setIsDeckUnsaved(false)
    }

    const updateDeckName = (value: string) => {
        setDeck(deck => ({...deck, name: value}))
        setIsDeckUnsaved(true)
    }
    const updateCardCountInDeck = (card: CardType, increment: number) => {
        const index = deck.cards.findIndex(deckCard => deckCard.name === card.name)

        if (increment == 1) {

            if (index > -1) {
                const newCard = {...card, count: deck.cards[index].count + 1}
                setDeck(deck => ({
                    ...deck,
                    cards: [...deck.cards.slice(0, index), newCard, ...deck.cards.slice(index + 1)]
                }))
            } else {
                const newCard = {...card, count: 1}
                setDeck(deck => ({...deck, cards: [...deck.cards, newCard]}))
            }

            setIsDeckUnsaved(true)

        } else if (increment == -1) {
            if (index > -1) {
                const updatedCard = {...card, count: deck.cards[index].count - 1}
                if (updatedCard.count > 0) {
                    setDeck(deck => ({
                        ...deck,
                        cards: [...deck.cards.slice(0, index), updatedCard, ...deck.cards.slice(index + 1)]
                    }))
                } else {
                    const newDeck = {...deck, cards: [...deck.cards.slice(0, index), ...deck.cards.slice(index + 1)]}
                    setDeck(newDeck)
                }
            }
            setIsDeckUnsaved(true)
        }
    }

    return (
        <Box width="100vw" height="100vh" py="24px" overflowY="auto">
            <Button pos="absolute" top="64px" right="64px"><Link to={"/"}>Go Home</Link></Button>

            <Flex width="100%" height="70%">
                <Box width="50%" height="100%" display="flex" justifyContent="center" alignItems="center"
                     borderRight="1px lightgrey solid">
                    <Input placeholder="Deck Name" width="50%" value={deck.name}
                           onChange={ev => updateDeckName(ev.target.value)}/>
                    <Button ml="16px" onClick={onSaveDeck}>Save</Button>
                </Box>
                <Flex justifyContent="center" alignItems="center" flexDir="column" width="50%" height="100%">
                    <Heading as={"h1"} size="xl" mb="22px">Saved Decks</Heading>
                    <Box width="100%" display="flex" gap="20px" justifyContent="center" alignItems="center"
                         overflowY="auto">
                        {decks.map(deck => (
                            <Button px="40px" py="20px" key={deck.name}
                                    onClick={() => onLoadDeck(deck)}>{deck.name}</Button>
                        ))}
                        <Button px="40px" py="20px" onClick={() => onLoadDeck(newDeck())}>New
                            Deck</Button>
                    </Box></Flex>
            </Flex>
            <Box px="32px">
                <Flex>
                    <Heading as={"h1"} size="xl"
                             mb="16px">{showDeckCards ? `Cards in ${deck.name}` : "All Cards"}</Heading>
                    <Button ml="16px" onClick={() => setShowDeckCards(!showDeckCards)}>
                        {showDeckCards ? "Show All Cards" : "Show Deck Cards"}
                    </Button>
                </Flex>
                <Box my="12px">
                    <FilterBar onApply={applyFilters}/>
                    <Box mt="8px">
                        <SortDropdown sortBy={sortBy} onSortByChange={setSortBy}/>
                    </Box>
                </Box>
                <Box display="flex" flexWrap="wrap" justifyContent="flex-start" gap="16px">
                    {(showDeckCards ? deck.cards : filteredCards).sort(getSortByFn(sortBy.field)).map(card =>
                        (<Card updateCardNumber={updateCardCountInDeck} key={card.name} card={card}
                               onPress={card => setSelectedCard(card)}/>))
                    }
                </Box>
            </Box>
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

export default Deck;
