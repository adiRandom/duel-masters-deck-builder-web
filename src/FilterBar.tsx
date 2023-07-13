import React, {useState} from "react";
import {Button, Flex, Input, Select, Text} from "@chakra-ui/react";
import {AppliedFilter, Filter} from "./api/types";
import {SmallCloseIcon} from "@chakra-ui/icons";


const FILTERS: Filter[] = [
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
        field: "type",
        label: "Type",
        type: "string",
        permittedOperators: ["=", "!="],
        permittedValues: ["Creature", "Spell", "Evolution Creature"]
    },
    {
        field: "race",
        label: "Race",
        type: "string",
        permittedOperators: ["=", "!="],
    },
    {
        field: "text",
        label: "Text",
        type: "string",
        permittedOperators: ["contains", "not contains"],
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

type FilterBarProps = {
    onApply(filters: AppliedFilter[]): void
}

function FilterBar({onApply}: FilterBarProps) {
    const [selectedFilter, setSelectedFilter] = useState<Filter | undefined>(undefined)
    const [selectedOperator, setSelectedOperator] = useState<string | undefined>(undefined)
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)

    const [filters, setFilters] = useState<AppliedFilter[]>([])

    const onFilterSelected = (filterName: string) => {
        const filter = FILTERS.find(filter => filter.field == filterName)
        setSelectedFilter(filter)

        setSelectedOperator(undefined)
        setSelectedValue(undefined)
    }

    const onApplyFilter = () => {
        if (selectedFilter && selectedOperator && selectedValue) {
            const parsedValue = selectedFilter.type === "number" ? parseInt(selectedValue) : selectedValue

            if(!Number.isNaN(parsedValue)){
                const filter: AppliedFilter = {
                    field: selectedFilter.field,
                    operator: selectedOperator as any,
                    value: parsedValue,
                    label: selectedFilter.label
                }

                setFilters([...filters, filter])
                onApply([...filters, filter])
            }

            setSelectedValue(undefined)
            setSelectedOperator(undefined)
            setSelectedFilter(undefined)
        }
    }

    const getFilterChip = (filter: AppliedFilter) => {
        return <Flex key={filter.field + filter.operator + filter.value} bg="blue.400" borderRadius="8px" py="4px"
                     px="8px"
                     alignItems="center" justifyContent="center">
            <Text fontSize="14px" color="white" fontWeight="500px"
                  mr="4px">{`${filter.label} ${filter.operator} ${filter.value}`}</Text>
            <SmallCloseIcon _hover={{cursor:"pointer"}} onClick={() => onRemoveFilter(filter)} color="white"/>
        </Flex>
    }

    const onRemoveFilter = (filter: AppliedFilter) => {
        const newFilters = filters.filter(f => f !== filter)
        setFilters(newFilters)
        onApply(newFilters)
    }

    return <Flex flexDir="column">
        <Flex alignItems="center">
            <Text fontSize="24px" fontWeight="500px" mx="16px">Filters:</Text>
            <Select maxW="150px" value={selectedFilter?.field??""} placeholder="Select field" mr="16px"
                    onChange={ev => onFilterSelected(ev.target.value)}>
                {FILTERS.map((filter) =>
                    <option key={filter.field} value={filter.field}>{filter.label}</option>
                )}
            </Select>
            {selectedFilter &&
                <Select maxW="200px" mr="16px" value={selectedOperator} placeholder="Select operator"
                        onChange={ev => setSelectedOperator(ev.target.value)}>
                    {selectedFilter.permittedOperators.map((operator) =>
                        <option key={operator} value={operator}>{operator}</option>
                    )}
                </Select>}
            {selectedFilter && selectedFilter.type === "string" && selectedFilter.permittedValues &&
                <Select maxW="200px" mr="16px" value={selectedValue} placeholder="Select value"
                        onChange={ev => setSelectedValue(ev.target.value)}>
                    {selectedFilter.permittedValues.map((value) =>
                        <option key={value} value={value}>{value}</option>
                    )}
                </Select>}
            {selectedFilter && (selectedFilter.type === "number" || !selectedFilter.permittedValues) &&
                <Input maxW="300px" mr="16px" placeholder="Filter value" value={selectedValue ?? ""}
                       onChange={ev => setSelectedValue(ev.target.value)}>
                </Input>
            }
            {selectedFilter && selectedOperator && selectedValue && <Button onClick={onApplyFilter}>Apply</Button>}
        </Flex>
        <Flex my="12px" flexWrap="wrap" gap="16px">
            {filters.map(filter => getFilterChip(filter))}
        </Flex>
    </Flex>
}

export default FilterBar