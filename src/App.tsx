import React, {useState} from 'react';
import {useCards} from "./api/hooks";
import {Box, Button, Heading, Input, Spinner} from "@chakra-ui/react";
import Card from "./Card";

function App() {

    const {addCard, cards, isLoading, updateCardNumber} = useCards({
        onError: (error) => {
            console.log(error)
        }
    })

    const [cardName, setCardName] = useState("")

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
                        (<Card updateCardNumber={updateCardNumber} key={card.name} card={card}/>))
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default App;
