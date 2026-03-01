import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { StepLayout, Step } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFormula,
} from "@/components/atoms";
import { getVariableInfo, clozePropsFromDefinition } from "../variables";

/**
 * Section 7: Practice Questions
 *
 * Questions to test understanding of the Recamán sequence rule.
 * Uses StepLayout to reveal questions one at a time.
 */
export const section7Blocks: ReactElement[] = [
    // Section title
    <StackLayout key="layout-s7-title" maxWidth="xl">
        <Block id="block-s7-title" padding="md">
            <EditableH2 id="h2-s7-title" blockId="block-s7-title">
                Test Your Understanding
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-s7-intro" maxWidth="xl">
        <Block id="block-s7-intro" padding="sm">
            <EditableParagraph id="para-s7-intro" blockId="block-s7-intro">
                Let's see if you've got the Recamán rule down! Answer each question to reveal the next one. Remember: try to go backward first, and only go forward if you can't.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Questions using StepLayout
    <StackLayout key="layout-s7-questions" maxWidth="xl">
        <Block id="block-s7-questions" padding="md">
            <StepLayout varName="practiceProgress" showProgress={true} allowBack={true}>
                {/* Question 1 */}
                <Step completionVarName="practiceAnswer1" autoAdvance>
                    <div className="p-5 rounded-xl border-2 border-primary/30" style={{ background: 'var(--gradient-hero)' }}>
                        <div className="font-semibold text-primary mb-3">Question 1</div>
                        <EditableParagraph id="para-q1" blockId="block-s7-questions">
                            The sequence starts at{" "}
                            <InlineFormula id="formula-q1-start" latex="a(0) = 0" colorMap={{}} />
                            . At step 1, we try to go backward: 0 - 1 = -1. Since -1 is negative, we must go forward instead: 0 + 1 = 1.
                        </EditableParagraph>
                        <div className="mt-4 text-lg">
                            What is{" "}
                            <InlineFormula id="formula-q1" latex="a(1)" colorMap={{}} />
                            ?{" "}
                            <InlineClozeInput
                                varName="practiceAnswer1"
                                correctAnswer="1"
                                {...clozePropsFromDefinition(getVariableInfo('practiceAnswer1'))}
                            />
                        </div>
                    </div>
                </Step>

                {/* Feedback 1 + Question 2 */}
                <Step completionVarName="practiceAnswer2" autoAdvance>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl" style={{ background: 'hsl(152 76% 92%)', border: '2px solid hsl(152 76% 40%)' }}>
                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'hsl(152 76% 30%)' }}>
                                <span>✓</span> Correct! a(1) = 1
                            </div>
                        </div>

                        <div className="p-5 rounded-xl border-2 border-primary/30" style={{ background: 'var(--gradient-hero)' }}>
                            <div className="font-semibold text-primary mb-3">Question 2</div>
                            <EditableParagraph id="para-q2" blockId="block-s7-questions">
                                Now at step 2, we're at position 1. We try backward: 1 - 2 = -1. Again negative! So we go forward: 1 + 2 = 3.
                            </EditableParagraph>
                            <div className="mt-4 text-lg">
                                What is{" "}
                                <InlineFormula id="formula-q2" latex="a(2)" colorMap={{}} />
                                ?{" "}
                                <InlineClozeInput
                                    varName="practiceAnswer2"
                                    correctAnswer="3"
                                    {...clozePropsFromDefinition(getVariableInfo('practiceAnswer2'))}
                                />
                            </div>
                        </div>
                    </div>
                </Step>

                {/* Feedback 2 + Question 3 */}
                <Step completionVarName="practiceAnswer3" autoAdvance>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl" style={{ background: 'hsl(152 76% 92%)', border: '2px solid hsl(152 76% 40%)' }}>
                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'hsl(152 76% 30%)' }}>
                                <span>✓</span> Correct! a(2) = 3
                            </div>
                        </div>

                        <div className="p-5 rounded-xl border-2 border-primary/30" style={{ background: 'var(--gradient-hero)' }}>
                            <div className="font-semibold text-primary mb-3">Question 3</div>
                            <EditableParagraph id="para-q3" blockId="block-s7-questions">
                                At step 3, we're at position 3. Try backward: 3 - 3 = 0. Is 0 positive? No! (It's neither positive nor negative.) So we go forward: 3 + 3 = 6.
                            </EditableParagraph>
                            <div className="mt-4 text-lg">
                                What is{" "}
                                <InlineFormula id="formula-q3" latex="a(3)" colorMap={{}} />
                                ?{" "}
                                <InlineClozeInput
                                    varName="practiceAnswer3"
                                    correctAnswer="6"
                                    {...clozePropsFromDefinition(getVariableInfo('practiceAnswer3'))}
                                />
                            </div>
                        </div>
                    </div>
                </Step>

                {/* Final feedback */}
                <Step>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl" style={{ background: 'hsl(152 76% 92%)', border: '2px solid hsl(152 76% 40%)' }}>
                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'hsl(152 76% 30%)' }}>
                                <span>✓</span> Correct! a(3) = 6
                            </div>
                        </div>

                        <div className="p-6 rounded-xl text-center" style={{ background: 'var(--gradient-primary)' }}>
                            <div className="text-2xl mb-2">🎉</div>
                            <div className="text-xl font-bold text-white mb-2">
                                Excellent work!
                            </div>
                            <div className="text-white/90">
                                You've mastered the Recamán sequence rule. You now know how this beautiful mathematical pattern is built — one jump at a time!
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/50">
                            <div className="text-sm text-muted-foreground">
                                <strong>Summary:</strong> The first few terms are 0, 1, 3, 6, 2, 7, 13, 20, 12, 21...
                                Notice that at step 4, we finally get to go <em>backward</em> for the first time (6 - 4 = 2, which is positive and new!).
                            </div>
                        </div>
                    </div>
                </Step>
            </StepLayout>
        </Block>
    </StackLayout>,

    // Closing
    <StackLayout key="layout-s7-closing" maxWidth="xl">
        <Block id="block-s7-closing" padding="md">
            <EditableParagraph id="para-s7-closing" blockId="block-s7-closing">
                Congratulations on completing this exploration of the Recamán sequence! You've learned the rule, built the sequence step by step, seen its beautiful arc visualization, heard it as music, and discovered the unsolved mystery at its heart. Mathematics is full of such surprises — simple rules creating infinite complexity.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
