import React, {useState} from 'react';
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
import {CardType} from "./api/types";

function App() {

    const {addCard, cards, isLoading, updateCardNumber} = useCards({
        onError: (error) => {
            console.log(error)
        }
    })

    const [cardName, setCardName] = useState("")
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null)

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

    const capitalize = (s: string) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    return (
        <Box width="100vw" height="100vh" py="24px" overflowY="auto">
            <Box width="100%" height="70%" display="flex" justifyContent="center" alignItems="center">
                <Input placeholder="Card Name" width="50%" value={cardName}
                       onKeyDown={onKeyDown}
                       onChange={ev => setCardName(ev.target.value)}/>
                <Button ml="16px" onClick={onAddCard}>Add</Button>
                {isLoading && <Spinner ml="12px" color='red.500'/>}
            </Box>
            <Box px="24px">
                <Heading as={"h1"} size="xl" mb="16px">Cards</Heading>
                <Box display="flex" flexWrap="wrap" justifyContent="flex-start" gap="16px">
                    {cards.map(card =>
                        (<Card updateCardNumber={updateCardNumber} key={card.name} card={card}
                               onPress={card => setSelectedCard(card)}/>))
                    }
                </Box>
            </Box>
            <Modal isOpen={selectedCard !== null} onClose={() => setSelectedCard(null)}>
                <ModalOverlay/>
                <ModalContent maxW="80vw" width="80vw">
                    <ModalHeader>{selectedCard?.name}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody maxW="80vw" width="80vw" px="24px" py="12px">
                        <Flex width="80vw" py="36px" justifyContent="space-evenly">
                            <Image width="300px" height="400px" src={selectedCard?.image} alt={selectedCard?.name}/>
                            <Flex flexDir="column" justifyContent="center"
                                  backgroundColor="#e3e3e3" borderRadius="12px" px="16px"
                                  maxW="50%" py="8px">
                                {Object.entries(selectedCard ?? {}).map(([key, value]) =>
                                    (key !== "flavorText" && key !== "image" &&
                                        <Flex className="card-info" mx="4px" borderBottom="1px solid #acacac" my="4px" alignItems="center">
                                            <Text
                                                fontSize="20px"
                                                fontWeight="500"
                                                mr="8px"> {capitalize(key)}
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
