import {CardType} from "./types";
import {useEffect, useState} from "react";

// const API_URL = 'https://europe-west1-duel-masters-builder.cloudfunctions.net/api';
const API_URL = 'http://127.0.0.1:5001/duel-masters-builder/europe-west1/api';

type UseCardsParams = {
    onError: (error: string) => void;
}

export function useCards({onError}: UseCardsParams) {

    const [cards, setCards] = useState<CardType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getCards()
    }, [])

    const addCard = async (cardName: string) => {
        setIsLoading(true)
        const parsedCardName = cardName.replace(/ /g, '_')
        const result = await fetch(`${API_URL}/card/${parsedCardName}`, {
            method: 'POST',
        })

        if (result.ok) {
            getCards()
        } else {
            setIsLoading(false)
            onError(await result.text())
        }
    }

    const getCards = async () => {
        setIsLoading(true)
        const result = await fetch(`${API_URL}/card/list`)
        if (result.ok) {
            const cards = await result.json() as CardType[]
            setIsLoading(false)
            setCards(cards)
        } else {
            setIsLoading(false)
            onError('Failed to fetch cards')
        }
    }

    const updateCardNumber = async (card: CardType, increment: number) => {
        setIsLoading(true)
        const result = await fetch(`${API_URL}/card/${card.name}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({increment})
        })

        if (result.ok) {
            const updatedCards = cards.map(c => c.name === card.name ? {...c, count: c.count + increment} : c)
            setIsLoading(false)
            setCards(updatedCards)
        } else {
            setIsLoading(false)
            onError(await result.text())
        }
    }

    return {
        cards,
        addCard,
        updateCardNumber,
        isLoading
    }
}