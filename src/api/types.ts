export type CardType = {
    name: string
    civilization: string
    type: string
    text: string
    manaCost: number
    race: string
    power: number
    manaNumber: number
    flavorText: string
    image: string,
    count: number
}

export type Filter = {
    field: keyof CardType
    label: string,
    type: "string"
    permittedOperators: ("=" | "!=" | "contains" | "not contains" )[],
    permittedValues?: string[]
} | {
    field: keyof CardType
    label: string,
    type: "number"
    permittedOperators: ("=" | "!=" | ">" | "<" | ">=" | "<=")[]
}

export type AppliedFilter =  {
    field: keyof CardType,
    label: string,
    operator: ("=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not contains"),
    value: string | number
}

export type DeckType = {
    name: string
    cards: CardType[]
    id: string
}

function randomInt() {
    return Math.floor(Math.random() * 1000000)
}

export function newDeck(){
    return {
        name: "",
        cards: [],
        id: randomInt().toString()
    }
}