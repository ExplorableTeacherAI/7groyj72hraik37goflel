import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineTooltip,
    InlineFormula,
} from "@/components/atoms";

/**
 * Section 2: The Rule
 *
 * Defines how the Recamán sequence is constructed, step by step.
 * Uses stackLayout for clear, sequential explanation.
 */
export const section2Blocks: ReactElement[] = [
    // Section title
    <StackLayout key="layout-s2-title" maxWidth="xl">
        <Block id="block-s2-title" padding="md">
            <EditableH2 id="h2-s2-title" blockId="block-s2-title">
                The Rule Behind the Jumps
            </EditableH2>
        </Block>
    </StackLayout>,

    // Rule explanation intro
    <StackLayout key="layout-s2-intro" maxWidth="xl">
        <Block id="block-s2-intro" padding="sm">
            <EditableParagraph id="para-s2-intro" blockId="block-s2-intro">
                The Recamán sequence follows a simple rule that creates surprising complexity. Let's call each number in the sequence{" "}
                <InlineTooltip
                    id="tooltip-a-n"
                    tooltip="The n-th term of the Recamán sequence, where n starts at 0"
                    color="#8b5cf6"
                >
                    a(n)
                </InlineTooltip>
                , where n is the step number starting from 0.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Starting point
    <StackLayout key="layout-s2-start" maxWidth="xl">
        <Block id="block-s2-start" padding="sm">
            <EditableParagraph id="para-s2-start" blockId="block-s2-start">
                <strong>Start:</strong> The sequence begins at zero. So{" "}
                <InlineFormula
                    id="formula-a0"
                    latex="a(0) = 0"
                    colorMap={{}}
                />.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Rule card
    <StackLayout key="layout-s2-rule-card" maxWidth="xl">
        <Block id="block-s2-rule-card" padding="md">
            <div className="p-6 rounded-xl border-2 border-primary/20" style={{ background: 'var(--gradient-hero)' }}>
                <p className="text-lg font-semibold text-foreground mb-4">
                    For each step n (starting from 1):
                </p>
                <ol className="space-y-3 text-foreground">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                        <span>
                            <strong>Try to go backward:</strong> Calculate{" "}
                            <InlineFormula
                                id="formula-back"
                                latex="a(n-1) - n"
                                colorMap={{}}
                            />
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                        <span>
                            <strong>Check if it's valid:</strong> Is the result positive AND not already in the sequence?
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">✓</span>
                        <span>
                            <strong>If YES:</strong> Use{" "}
                            <InlineFormula
                                id="formula-use-back"
                                latex="a(n) = a(n-1) - n"
                                colorMap={{}}
                            />{" "}
                            (jump backward)
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">✗</span>
                        <span>
                            <strong>If NO:</strong> Use{" "}
                            <InlineFormula
                                id="formula-use-forward"
                                latex="a(n) = a(n-1) + n"
                                colorMap={{}}
                            />{" "}
                            (jump forward)
                        </span>
                    </li>
                </ol>
            </div>
        </Block>
    </StackLayout>,

    // Why backward first?
    <StackLayout key="layout-s2-why" maxWidth="xl">
        <Block id="block-s2-why" padding="sm">
            <EditableParagraph id="para-s2-why" blockId="block-s2-why">
                Why does the frog prefer backward? This preference is what makes the sequence so interesting! If it always jumped forward, the sequence would just be 0, 1, 3, 6, 10, 15... — the{" "}
                <InlineTooltip
                    id="tooltip-triangular"
                    tooltip="Numbers that form equilateral triangles: 1, 3, 6, 10, 15, 21..."
                    color="#3b82f6"
                >
                    triangular numbers
                </InlineTooltip>
                . Predictable and boring! By trying backward first, the sequence weaves back and forth, creating a much richer pattern.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Summary
    <StackLayout key="layout-s2-summary" maxWidth="xl">
        <Block id="block-s2-summary" padding="sm">
            <EditableParagraph id="para-s2-summary" blockId="block-s2-summary">
                In short: <strong>subtract if you can, add if you must</strong>. This simple rule generates the sequence: 0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10... Let's build it step by step in the next section!
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
