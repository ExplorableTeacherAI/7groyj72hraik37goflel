import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import sections
import { section1Blocks } from "./sections/Section1Introduction";
import { section2Blocks } from "./sections/Section2TheRule";
import { section3Blocks } from "./sections/Section3BuildingSequence";
import { section4Blocks } from "./sections/Section4ArcVisualization";
import { section5Blocks } from "./sections/Section5Music";
import { section6Blocks } from "./sections/Section6UnsolvedQuestion";
import { section7Blocks } from "./sections/Section7Practice";

/**
 * Recamán Sequence - An Explorable Explanation
 *
 * A lesson exploring the beautiful and mysterious Recamán sequence,
 * where a simple rule creates surprisingly complex patterns.
 */

export const blocks: ReactElement[] = [
    ...section1Blocks,
    ...section2Blocks,
    ...section3Blocks,
    ...section4Blocks,
    ...section5Blocks,
    ...section6Blocks,
    ...section7Blocks,
];
