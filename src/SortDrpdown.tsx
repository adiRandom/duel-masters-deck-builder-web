import React from "react";
import {Flex, Select, Text} from "@chakra-ui/react";
import {Filter} from "./api/types";


export const SORT_OPTIONS: Filter[] = [
    {
        field: "name",
        label: "Name",
        type: "string",
        permittedOperators: ["="],
    },
    {
        field: "count",
        label: "Count",
        type: "number",
        permittedOperators: ["=", ">", "<", "<=", ">="],
    },
    {
        field: "civilization",
        label: "Civilization",
        type: "string",
        permittedOperators: ["=", "!="],
        permittedValues: ["Light", "Darkness", "Fire", "Water", "Nature"]
    },
    {
        field: "manaCost",
        label: "Mana Cost",
        type: "number",
        permittedOperators: ["=", "!=", ">", "<", "<=", ">="],
    },
    {
        field: "power",
        label: "Power",
        type: "number",
        permittedOperators: ["=", "!=", ">", "<", "<=", ">="],
    },
]

type SortDropdownProps = {
    sortBy: Filter
    onSortByChange: (sortBy: Filter) => void
}

function SortDropdown({sortBy, onSortByChange}: SortDropdownProps) {

    return <Flex alignItems="center">
        <Text fontSize="24px" fontWeight="500px" mx="16px">Sort by:</Text>
        <Select maxW="150px" value={sortBy.field} placeholder="Select field" mr="16px"
                onChange={ev =>
                    onSortByChange(SORT_OPTIONS.find(filter =>
                        filter.field === ev.target.value
                    ) ?? SORT_OPTIONS[0])}>
            {SORT_OPTIONS.map((filter) =>
                <option key={filter.field} value={filter.field}>{filter.label}</option>
            )}
        </Select>
    </Flex>
}

export default SortDropdown