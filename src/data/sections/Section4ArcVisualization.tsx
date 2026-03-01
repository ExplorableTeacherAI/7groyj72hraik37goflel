import { type ReactElement, useState, useEffect, useRef, useCallback } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
} from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import { getVariableInfo, numberPropsFromDefinition } from "../variables";

/**
 * Compute the first N terms of the Recamán sequence.
 */
function computeRecaman(n: number): number[] {
    const seq: number[] = [0];
    const seen = new Set<number>([0]);
    for (let i = 1; i <= n; i++) {
        const prev = seq[i - 1];
        const back = prev - i;
        if (back > 0 && !seen.has(back)) {
            seq.push(back);
            seen.add(back);
        } else {
            const forward = prev + i;
            seq.push(forward);
            seen.add(forward);
        }
    }
    return seq;
}

/**
 * Animated Arc Visualization - arcs draw themselves one by one.
 */
function AnimatedArcViz() {
    const numTerms = useVar('numTerms', 10) as number;
    const setVar = useSetVar();
    const [animatedArcs, setAnimatedArcs] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number | null>(null);

    const sequence = computeRecaman(numTerms);
    const maxNum = Math.max(...sequence, 20);

    // SVG dimensions
    const width = 800;
    const height = 350;
    const padding = 50;
    const lineY = height - 60;
    const scale = (width - 2 * padding) / (maxNum + 2);

    const getX = (n: number) => padding + (n + 1) * scale;

    // Start animation
    const startAnimation = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setAnimatedArcs(0);

        let currentArc = 0;
        const animate = () => {
            if (currentArc < sequence.length - 1) {
                currentArc++;
                setAnimatedArcs(currentArc);
                animationRef.current = window.setTimeout(animate, 400);
            } else {
                setIsAnimating(false);
            }
        };
        animationRef.current = window.setTimeout(animate, 300);
    }, [isAnimating, sequence.length]);

    // Reset
    const reset = useCallback(() => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }
        setIsAnimating(false);
        setAnimatedArcs(0);
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    // Reset animation when numTerms changes
    useEffect(() => {
        reset();
    }, [numTerms, reset]);

    // Generate arc colors - gradient from green to purple
    const getArcColor = (index: number, total: number) => {
        const hueStart = 152; // green
        const hueEnd = 262;   // purple
        const hue = hueStart + (hueEnd - hueStart) * (index / Math.max(total - 1, 1));
        return `hsl(${hue} 70% 50%)`;
    };

    // Create arcs
    const arcs: ReactElement[] = [];
    for (let i = 0; i < Math.min(animatedArcs, sequence.length - 1); i++) {
        const from = sequence[i];
        const to = sequence[i + 1];
        const x1 = getX(from);
        const x2 = getX(to);
        const midX = (x1 + x2) / 2;
        const radius = Math.abs(x2 - x1) / 2;
        const arcHeight = Math.min(radius * 1.2, 150);

        const color = getArcColor(i, sequence.length - 1);
        const isNewest = i === animatedArcs - 1;

        // Use quadratic bezier for smooth arcs
        const path = `M ${x1} ${lineY} Q ${midX} ${lineY - arcHeight} ${x2} ${lineY}`;

        arcs.push(
            <g key={`arc-${i}`}>
                <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={isNewest ? 3 : 2}
                    strokeLinecap="round"
                    opacity={isNewest ? 1 : 0.6}
                    style={{
                        animation: isNewest ? 'drawArc 0.4s ease-out forwards' : undefined,
                    }}
                />
                {/* Arc number label */}
                <text
                    x={midX}
                    y={lineY - arcHeight - 8}
                    textAnchor="middle"
                    fontSize={10}
                    fill={color}
                    fontWeight={600}
                    opacity={isNewest ? 1 : 0.5}
                >
                    {i + 1}
                </text>
            </g>
        );
    }

    // Position markers
    const visitedPositions = sequence.slice(0, animatedArcs + 1);
    const positionDots = visitedPositions.map((pos, i) => (
        <circle
            key={`dot-${i}-${pos}`}
            cx={getX(pos)}
            cy={lineY}
            r={i === animatedArcs ? 6 : 4}
            fill={i === animatedArcs ? 'hsl(152 76% 40%)' : 'hsl(var(--muted))'}
            stroke={i === animatedArcs ? 'hsl(152 76% 30%)' : 'hsl(var(--border))'}
            strokeWidth={1.5}
            style={{
                transition: 'all 0.3s ease',
            }}
        />
    ));

    return (
        <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-card" style={{ boxShadow: 'var(--shadow-card)' }}>
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <style>{`
                            @keyframes drawArc {
                                from {
                                    stroke-dasharray: 1000;
                                    stroke-dashoffset: 1000;
                                }
                                to {
                                    stroke-dasharray: 1000;
                                    stroke-dashoffset: 0;
                                }
                            }
                        `}</style>
                        <linearGradient id="lineGradientArc" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--border))" />
                            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.5} />
                        </linearGradient>
                    </defs>

                    {/* Number line */}
                    <line
                        x1={padding}
                        y1={lineY}
                        x2={width - padding}
                        y2={lineY}
                        stroke="url(#lineGradientArc)"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />

                    {/* Tick marks - only show some to avoid clutter */}
                    {Array.from({ length: Math.min(maxNum + 2, 30) }, (_, i) => {
                        const showLabel = i % 5 === 0 || i <= 10;
                        return (
                            <g key={`tick-${i}`}>
                                <line
                                    x1={getX(i)}
                                    y1={lineY - 5}
                                    x2={getX(i)}
                                    y2={lineY + 5}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeWidth={1}
                                    opacity={0.5}
                                />
                                {showLabel && (
                                    <text
                                        x={getX(i)}
                                        y={lineY + 20}
                                        textAnchor="middle"
                                        fontSize={11}
                                        fill="hsl(var(--muted-foreground))"
                                        fontFamily="system-ui"
                                    >
                                        {i}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Arcs */}
                    {arcs}

                    {/* Position dots */}
                    {positionDots}

                    {/* Title */}
                    <text
                        x={width / 2}
                        y={30}
                        textAnchor="middle"
                        fontSize={16}
                        fill="hsl(var(--foreground))"
                        fontWeight={500}
                        fontFamily="system-ui"
                    >
                        {animatedArcs === 0
                            ? "Click 'Draw Arcs' to begin"
                            : `${animatedArcs} arc${animatedArcs === 1 ? '' : 's'} drawn`}
                    </text>
                </svg>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                    onClick={startAnimation}
                    disabled={isAnimating || animatedArcs >= sequence.length - 1}
                    className="px-5 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                        background: !isAnimating && animatedArcs < sequence.length - 1
                            ? 'hsl(152 76% 40%)'
                            : 'hsl(var(--muted))',
                        color: !isAnimating && animatedArcs < sequence.length - 1
                            ? 'white'
                            : 'hsl(var(--muted-foreground))',
                        cursor: !isAnimating && animatedArcs < sequence.length - 1
                            ? 'pointer'
                            : 'not-allowed',
                    }}
                >
                    {isAnimating ? 'Drawing...' : animatedArcs >= sequence.length - 1 ? 'Complete!' : 'Draw Arcs'}
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                        background: 'hsl(var(--muted))',
                        color: 'hsl(var(--foreground))',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Sequence display */}
            {animatedArcs > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                    Sequence: <span className="font-mono font-medium text-foreground">
                        {sequence.slice(0, animatedArcs + 1).join(' → ')}
                    </span>
                </div>
            )}
        </div>
    );
}

/**
 * Section 4: The Arc Visualization
 *
 * The famous visual representation of the Recamán sequence.
 */
export const section4Blocks: ReactElement[] = [
    // Section title
    <StackLayout key="layout-s4-title" maxWidth="xl">
        <Block id="block-s4-title" padding="md">
            <EditableH2 id="h2-s4-title" blockId="block-s4-title">
                The Beautiful Arc Pattern
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-s4-intro" maxWidth="xl">
        <Block id="block-s4-intro" padding="sm">
            <EditableParagraph id="para-s4-intro" blockId="block-s4-intro">
                When we connect consecutive terms of the Recamán sequence with arcs above a number line, something magical happens. The arcs create a beautiful nested pattern — some small and tight, others sweeping wide. Watch the pattern emerge as the arcs draw themselves one by one!
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Controls for number of terms
    <StackLayout key="layout-s4-control" maxWidth="xl">
        <Block id="block-s4-control" padding="sm">
            <EditableParagraph id="para-s4-control" blockId="block-s4-control">
                Number of terms to visualize:{" "}
                <InlineScrubbleNumber
                    varName="numTerms"
                    {...numberPropsFromDefinition(getVariableInfo('numTerms'))}
                />
                {" "}(drag to change, then click "Draw Arcs")
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Visualization
    <StackLayout key="layout-s4-viz" maxWidth="2xl">
        <Block id="block-s4-viz" padding="md">
            <AnimatedArcViz />
        </Block>
    </StackLayout>,

    // Observation
    <StackLayout key="layout-s4-observation" maxWidth="xl">
        <Block id="block-s4-observation" padding="sm">
            <EditableParagraph id="para-s4-observation" blockId="block-s4-observation">
                Notice how the arcs create a kind of visual music — rhythmic, yet unpredictable. The backward jumps create the nested inner arcs, while forward jumps create the sweeping outer curves. This interplay between order and chaos is what makes the Recamán sequence so captivating to mathematicians and artists alike.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
