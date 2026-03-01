import { type ReactElement, useState, useMemo } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineTooltip,
} from "@/components/atoms";

/**
 * Compute the first N terms of the Recamán sequence and track positions.
 */
function computeRecamanWithPositions(n: number): Map<number, number> {
    const positions = new Map<number, number>();
    positions.set(0, 0);

    const seq: number[] = [0];
    const seen = new Set<number>([0]);

    for (let i = 1; i <= n; i++) {
        const prev = seq[i - 1];
        const back = prev - i;
        let next: number;

        if (back > 0 && !seen.has(back)) {
            next = back;
        } else {
            next = prev + i;
        }

        seq.push(next);
        seen.add(next);
        if (!positions.has(next)) {
            positions.set(next, i);
        }
    }

    return positions;
}

/**
 * Interactive Number Explorer
 */
function NumberExplorer() {
    const [inputValue, setInputValue] = useState('');
    const [searchedNumber, setSearchedNumber] = useState<number | null>(null);

    // Pre-compute sequence up to 10000 terms
    const positions = useMemo(() => computeRecamanWithPositions(10000), []);

    const handleSearch = () => {
        const num = parseInt(inputValue, 10);
        if (!isNaN(num) && num >= 0) {
            setSearchedNumber(num);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Check if the searched number is in the sequence
    const position = searchedNumber !== null ? positions.get(searchedNumber) : undefined;
    const isFound = position !== undefined;

    // Find some interesting missing numbers (up to our computed limit)
    const missingNumbers = useMemo(() => {
        const missing: number[] = [];
        for (let i = 1; i <= 100 && missing.length < 10; i++) {
            if (!positions.has(i)) {
                missing.push(i);
            }
        }
        return missing;
    }, [positions]);

    // Find late appearances (numbers that appear very late)
    const lateAppearances = useMemo(() => {
        const late: Array<{ num: number; pos: number }> = [];
        for (const [num, pos] of positions.entries()) {
            if (num <= 50 && pos > 100) {
                late.push({ num, pos });
            }
        }
        return late.sort((a, b) => b.pos - a.pos).slice(0, 5);
    }, [positions]);

    return (
        <div className="flex flex-col gap-6">
            {/* Search box */}
            <div className="p-6 rounded-xl bg-card" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="text-lg font-semibold text-foreground mb-4">
                    Does your number appear in the sequence?
                </div>

                <div className="flex gap-3 items-center flex-wrap">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a number..."
                        min="0"
                        max="10000"
                        className="px-4 py-3 rounded-xl border border-border bg-background text-foreground w-48 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 rounded-xl font-medium transition-all"
                        style={{
                            background: 'hsl(152 76% 40%)',
                            color: 'white',
                        }}
                    >
                        Check!
                    </button>
                </div>

                {/* Result */}
                {searchedNumber !== null && (
                    <div
                        className="mt-6 p-4 rounded-xl transition-all"
                        style={{
                            background: isFound ? 'hsl(152 76% 92%)' : 'hsl(38 92% 92%)',
                            border: `2px solid ${isFound ? 'hsl(152 76% 40%)' : 'hsl(38 92% 50%)'}`,
                        }}
                    >
                        {isFound ? (
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✓</span>
                                <div>
                                    <div className="font-semibold text-lg" style={{ color: 'hsl(152 76% 30%)' }}>
                                        Yes! {searchedNumber} appears in the sequence
                                    </div>
                                    <div className="text-sm" style={{ color: 'hsl(152 76% 25%)' }}>
                                        It's the <strong>{position === 0 ? 'starting value' : `${position}${getOrdinalSuffix(position)} term`}</strong>
                                        {position !== undefined && position > 100 && (
                                            <span> — quite late! It took {position} steps to reach it.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">?</span>
                                <div>
                                    <div className="font-semibold text-lg" style={{ color: 'hsl(38 92% 35%)' }}>
                                        Not found in the first 10,000 terms!
                                    </div>
                                    <div className="text-sm" style={{ color: 'hsl(38 92% 30%)' }}>
                                        {searchedNumber} hasn't appeared yet. It might appear later... or it might be one of the mysteries!
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Interesting discoveries */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Missing numbers */}
                <div className="p-5 rounded-xl border border-border bg-muted/30">
                    <div className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-lg">🔍</span>
                        Missing Numbers (1-100)
                    </div>
                    {missingNumbers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {missingNumbers.map((num) => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        setInputValue(num.toString());
                                        setSearchedNumber(num);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all hover:scale-105"
                                    style={{
                                        background: 'hsl(38 92% 90%)',
                                        color: 'hsl(38 92% 30%)',
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            All numbers 1-100 appear in the first 10,000 terms!
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-3">
                        Click a number to see if it appears later
                    </div>
                </div>

                {/* Late appearances */}
                <div className="p-5 rounded-xl border border-border bg-muted/30">
                    <div className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-lg">🐢</span>
                        Slow Arrivals (small numbers that appear late)
                    </div>
                    {lateAppearances.length > 0 ? (
                        <div className="space-y-2">
                            {lateAppearances.map(({ num, pos }) => (
                                <div
                                    key={num}
                                    className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 rounded-lg px-2 py-1 transition-all"
                                    onClick={() => {
                                        setInputValue(num.toString());
                                        setSearchedNumber(num);
                                    }}
                                >
                                    <span className="font-mono font-medium">{num}</span>
                                    <span className="text-muted-foreground">
                                        appears at position <strong className="text-foreground">{pos}</strong>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Computing late arrivals...
                        </div>
                    )}
                </div>
            </div>

            {/* Fun fact */}
            <div className="p-4 rounded-xl border-l-4" style={{ background: 'hsl(262 83% 95%)', borderColor: 'hsl(262 83% 58%)' }}>
                <div className="text-sm" style={{ color: 'hsl(262 83% 35%)' }}>
                    <strong>Fun fact:</strong> The number <strong>19</strong> is famously stubborn — it doesn't appear until the <strong>99,734th</strong> term! Try searching for small numbers and see which ones take the longest to appear.
                </div>
            </div>
        </div>
    );
}

/**
 * Get ordinal suffix (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Section 6: The Big Unsolved Question
 *
 * Explores whether every positive integer eventually appears in the sequence.
 */
export const section6Blocks: ReactElement[] = [
    // Section title
    <StackLayout key="layout-s6-title" maxWidth="xl">
        <Block id="block-s6-title" padding="md">
            <EditableH2 id="h2-s6-title" blockId="block-s6-title">
                The Big Unsolved Question
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-s6-intro" maxWidth="xl">
        <Block id="block-s6-intro" padding="sm">
            <EditableParagraph id="para-s6-intro" blockId="block-s6-intro">
                Here's a question that mathematicians still can't answer:{" "}
                <InlineTooltip
                    id="tooltip-conjecture"
                    tooltip="A mathematical statement that seems true based on evidence, but hasn't been proven"
                    color="#8b5cf6"
                >
                    Does every positive integer eventually appear in the Recamán sequence?
                </InlineTooltip>
                {" "}We know the sequence visits infinitely many numbers, bouncing back and forth across the number line. But does it visit all of them?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // The mystery
    <StackLayout key="layout-s6-mystery" maxWidth="xl">
        <Block id="block-s6-mystery" padding="sm">
            <EditableParagraph id="para-s6-mystery" blockId="block-s6-mystery">
                Computers have calculated millions of terms, and so far every number they've checked eventually appears. But "eventually" can mean very different things! Some small numbers like 5 appear quickly. Others, like 19, take nearly 100,000 steps to show up. Try exploring which numbers are the "stubborn" ones!
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Number explorer
    <StackLayout key="layout-s6-explorer" maxWidth="2xl">
        <Block id="block-s6-explorer" padding="md">
            <NumberExplorer />
        </Block>
    </StackLayout>,

    // Closing thought
    <StackLayout key="layout-s6-closing" maxWidth="xl">
        <Block id="block-s6-closing" padding="sm">
            <EditableParagraph id="para-s6-closing" blockId="block-s6-closing">
                The Recamán sequence is a perfect example of how simple rules can create deep mysteries. A child can understand the rule — try to go back, go forward if you can't. Yet the greatest mathematicians can't prove whether every number eventually appears. This is the beauty of mathematics: simple questions can lead to profound mysteries.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
