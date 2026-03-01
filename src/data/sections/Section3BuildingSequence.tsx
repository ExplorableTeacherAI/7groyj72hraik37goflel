import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
} from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";

/**
 * Compute Recamán sequence with detailed step information.
 */
interface StepInfo {
    n: number;
    prevValue: number;
    backResult: number;
    isBackValid: boolean;
    reason: string;
    result: number;
    direction: 'back' | 'forward';
}

function computeRecamanWithSteps(maxSteps: number): StepInfo[] {
    const seq: number[] = [0];
    const seen = new Set<number>([0]);
    const steps: StepInfo[] = [];

    for (let n = 1; n <= maxSteps; n++) {
        const prev = seq[n - 1];
        const back = prev - n;
        let isBackValid = false;
        let reason = '';
        let result: number;
        let direction: 'back' | 'forward';

        if (back <= 0) {
            reason = `${back} is not positive`;
            result = prev + n;
            direction = 'forward';
        } else if (seen.has(back)) {
            reason = `${back} was already visited`;
            result = prev + n;
            direction = 'forward';
        } else {
            isBackValid = true;
            reason = `${back} is positive and new!`;
            result = back;
            direction = 'back';
        }

        steps.push({
            n,
            prevValue: prev,
            backResult: back,
            isBackValid,
            reason,
            result,
            direction,
        });

        seq.push(result);
        seen.add(result);
    }

    return steps;
}

/**
 * Interactive step-by-step table showing the Recamán sequence construction.
 */
function StepByStepBuilder() {
    const currentStep = useVar('currentStep', 0) as number;
    const setVar = useSetVar();

    const allSteps = computeRecamanWithSteps(15);
    const visibleSteps = allSteps.slice(0, currentStep);

    // Build the sequence so far
    const sequence = [0, ...visibleSteps.map(s => s.result)];

    const nextStep = () => {
        if (currentStep < 15) {
            setVar('currentStep', currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setVar('currentStep', currentStep - 1);
        }
    };

    const reset = () => {
        setVar('currentStep', 0);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Current sequence display */}
            <div className="p-4 rounded-xl bg-card" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                    Sequence so far:
                </div>
                <div className="flex flex-wrap gap-2">
                    {sequence.map((num, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg font-mono font-semibold text-sm"
                            style={{
                                background: i === sequence.length - 1 && currentStep > 0
                                    ? 'hsl(152 76% 40%)'
                                    : 'hsl(var(--muted))',
                                color: i === sequence.length - 1 && currentStep > 0
                                    ? 'white'
                                    : 'hsl(var(--foreground))',
                            }}
                        >
                            {num}
                        </span>
                    ))}
                    {currentStep === 0 && (
                        <span className="text-muted-foreground italic">
                            (Click "Next Step" to begin)
                        </span>
                    )}
                </div>
            </div>

            {/* Step table */}
            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left font-semibold">Step (n)</th>
                            <th className="px-4 py-3 text-left font-semibold">Previous a(n-1)</th>
                            <th className="px-4 py-3 text-left font-semibold">Try Back: a(n-1) - n</th>
                            <th className="px-4 py-3 text-left font-semibold">Valid?</th>
                            <th className="px-4 py-3 text-left font-semibold">Result a(n)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleSteps.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    Starting at a(0) = 0. Click "Next Step" to see each calculation!
                                </td>
                            </tr>
                        ) : (
                            visibleSteps.map((step, i) => (
                                <tr
                                    key={step.n}
                                    className={i === visibleSteps.length - 1 ? 'bg-primary/10' : ''}
                                    style={{
                                        animation: i === visibleSteps.length - 1 ? 'fadeIn 0.3s ease-out' : undefined,
                                    }}
                                >
                                    <td className="px-4 py-3 font-mono font-bold text-primary">
                                        {step.n}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                        {step.prevValue}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                        {step.prevValue} - {step.n} = {step.backResult}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
                                            style={{
                                                background: step.isBackValid
                                                    ? 'hsl(152 76% 90%)'
                                                    : 'hsl(0 84% 92%)',
                                                color: step.isBackValid
                                                    ? 'hsl(152 76% 25%)'
                                                    : 'hsl(0 84% 35%)',
                                            }}
                                        >
                                            {step.isBackValid ? '✓' : '✗'} {step.reason}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono font-bold" style={{
                                            color: step.direction === 'back'
                                                ? 'hsl(152 76% 35%)'
                                                : 'hsl(262 83% 50%)',
                                        }}>
                                            {step.result}
                                        </span>
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            ({step.direction === 'back' ? '← back' : '→ forward'})
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                        background: currentStep > 0 ? 'hsl(var(--muted))' : 'hsl(var(--muted) / 0.5)',
                        color: currentStep > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        cursor: currentStep > 0 ? 'pointer' : 'not-allowed',
                    }}
                >
                    ← Previous
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep >= 15}
                    className="px-5 py-2 rounded-lg font-medium transition-all"
                    style={{
                        background: currentStep < 15 ? 'hsl(152 76% 40%)' : 'hsl(var(--muted) / 0.5)',
                        color: currentStep < 15 ? 'white' : 'hsl(var(--muted-foreground))',
                        cursor: currentStep < 15 ? 'pointer' : 'not-allowed',
                    }}
                >
                    Next Step →
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                        background: 'hsl(var(--muted))',
                        color: 'hsl(var(--foreground))',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center">
                <span className="text-sm text-muted-foreground">
                    Step {currentStep} of 15
                </span>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; background: hsl(152 76% 80%); }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

/**
 * Section 3: Building the Sequence
 *
 * Interactive step-by-step walkthrough of constructing the Recamán sequence.
 */
export const section3Blocks: ReactElement[] = [
    // Section title
    <StackLayout key="layout-s3-title" maxWidth="xl">
        <Block id="block-s3-title" padding="md">
            <EditableH2 id="h2-s3-title" blockId="block-s3-title">
                Building the Sequence Step by Step
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-s3-intro" maxWidth="xl">
        <Block id="block-s3-intro" padding="sm">
            <EditableParagraph id="para-s3-intro" blockId="block-s3-intro">
                Now let's build the Recamán sequence together! Click through each step to see exactly how we decide whether to jump backward or forward. Watch the table fill in as we calculate each term.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive builder
    <StackLayout key="layout-s3-builder" maxWidth="2xl">
        <Block id="block-s3-builder" padding="md">
            <StepByStepBuilder />
        </Block>
    </StackLayout>,

    // Observation
    <StackLayout key="layout-s3-observation" maxWidth="xl">
        <Block id="block-s3-observation" padding="sm">
            <EditableParagraph id="para-s3-observation" blockId="block-s3-observation">
                Notice how the sequence bounces around unpredictably! Sometimes it goes back several times in a row, then suddenly leaps forward. The pattern seems chaotic, yet it follows a completely deterministic rule. This tension between simplicity and complexity is what makes the Recamán sequence so fascinating.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
