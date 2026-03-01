import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import sections
import { section1Blocks } from "./sections/Section1Introduction";
import { section2Blocks } from "./sections/Section2TheRule";

/**
 * Recamán Sequence - An Explorable Explanation
 *
 * A lesson exploring the beautiful and mysterious Recamán sequence,
 * where a simple rule creates surprisingly complex patterns.
 */

export const blocks: ReactElement[] = [
    ...section1Blocks,
    ...section2Blocks,
];
