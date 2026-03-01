import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableParagraph,
} from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import { useEffect, useCallback, useRef } from "react";

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
 * Animated frog hopping on a number line visualization.
 */
function JumpingFrogViz() {
    const step = useVar('introStep', 0) as number;
    const setVar = useSetVar();
    const animationRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);

    const sequence = computeRecaman(10);
    const currentPos = sequence[Math.min(step, sequence.length - 1)];
    const maxNum = Math.max(...sequence.slice(0, step + 1), 15);

    // Animation timing
    const animateFrog = useCallback(() => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        let currentStep = 0;
        const animate = () => {
            if (currentStep < 10) {
                currentStep++;
                setVar('introStep', currentStep);
                animationRef.current = window.setTimeout(animate, 1200);
            } else {
                isAnimatingRef.current = false;
            }
        };
        animationRef.current = window.setTimeout(animate, 800);
    }, [setVar]);

    const resetAnimation = useCallback(() => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }
        isAnimatingRef.current = false;
        setVar('introStep', 0);
    }, [setVar]);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    // SVG dimensions
    const width = 700;
    const height = 200;
    const padding = 40;
    const lineY = 140;
    const scale = (width - 2 * padding) / (maxNum + 2);

    const getX = (n: number) => padding + (n + 1) * scale;

    // Draw arcs for jumps
    const arcs: ReactElement[] = [];
    for (let i = 0; i < Math.min(step, sequence.length - 1); i++) {
        const from = sequence[i];
        const to = sequence[i + 1];
        const x1 = getX(from);
        const x2 = getX(to);
        const midX = (x1 + x2) / 2;
        const arcHeight = Math.abs(x2 - x1) * 0.5;
        const direction = to > from ? 1 : -1;

        // Alternate colors
        const colors = ['#22c55e', '#8b5cf6', '#3b82f6', '#f97316'];
        const color = colors[i % colors.length];

        arcs.push(
            <path
                key={`arc-${i}`}
                d={`M ${x1} ${lineY} Q ${midX} ${lineY - arcHeight} ${x2} ${lineY}`}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.7}
                style={{
                    animation: 'fadeIn 0.5s ease-out',
                }}
            />
        );
    }

    // Visited positions (dots)
    const visitedDots = sequence.slice(0, step + 1).map((pos, i) => (
        <circle
            key={`dot-${i}`}
            cx={getX(pos)}
            cy={lineY}
            r={6}
            fill={i === step ? '#22c55e' : '#e2e8f0'}
            stroke={i === step ? '#166534' : '#94a3b8'}
            strokeWidth={2}
            style={{
                transition: 'all 0.3s ease',
            }}
        />
    ));

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl" style={{ boxShadow: 'var(--shadow-card)' }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Background gradient */}
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                    <style>{`
                        @keyframes hop {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-15px); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 0.7; }
                        }
                    `}</style>
                </defs>

                {/* Number line */}
                <line
                    x1={padding}
                    y1={lineY}
                    x2={width - padding}
                    y2={lineY}
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    strokeLinecap="round"
                />

                {/* Tick marks and numbers */}
                {Array.from({ length: maxNum + 2 }, (_, i) => (
                    <g key={`tick-${i}`}>
                        <line
                            x1={getX(i)}
                            y1={lineY - 8}
                            x2={getX(i)}
                            y2={lineY + 8}
                            stroke="#94a3b8"
                            strokeWidth={1.5}
                        />
                        <text
                            x={getX(i)}
                            y={lineY + 25}
                            textAnchor="middle"
                            fontSize={12}
                            fill="#64748b"
                            fontFamily="system-ui"
                        >
                            {i}
                        </text>
                    </g>
                ))}

                {/* Jump arcs */}
                {arcs}

                {/* Visited dots */}
                {visitedDots}

                {/* Frog */}
                <g
                    transform={`translate(${getX(currentPos)}, ${lineY - 35})`}
                    style={{
                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    {/* Frog body */}
                    <ellipse cx={0} cy={0} rx={18} ry={14} fill="#22c55e" />
                    {/* Frog head */}
                    <ellipse cx={0} cy={-12} rx={12} ry={10} fill="#22c55e" />
                    {/* Eyes */}
                    <circle cx={-5} cy={-16} r={5} fill="white" />
                    <circle cx={5} cy={-16} r={5} fill="white" />
                    <circle cx={-5} cy={-16} r={2.5} fill="#1a1a1a" />
                    <circle cx={5} cy={-16} r={2.5} fill="#1a1a1a" />
                    {/* Smile */}
                    <path
                        d="M -6 -8 Q 0 -4 6 -8"
                        fill="none"
                        stroke="#166534"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    {/* Legs */}
                    <ellipse cx={-14} cy={8} rx={6} ry={4} fill="#16a34a" />
                    <ellipse cx={14} cy={8} rx={6} ry={4} fill="#16a34a" />
                </g>

                {/* Step indicator */}
                <text
                    x={width / 2}
                    y={30}
                    textAnchor="middle"
                    fontSize={16}
                    fill="#64748b"
                    fontFamily="system-ui"
                    fontWeight={500}
                >
                    {step === 0 ? "Starting at 0..." : `Jump ${step}: landed on ${currentPos}`}
                </text>
            </svg>

            {/* Controls */}
            <div className="flex gap-3">
                <button
                    onClick={animateFrog}
                    disabled={isAnimatingRef.current || step > 0}
                    className="px-5 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                        background: step === 0 ? 'hsl(152 76% 40%)' : 'hsl(215 16% 90%)',
                        color: step === 0 ? 'white' : 'hsl(215 16% 47%)',
                        cursor: step === 0 ? 'pointer' : 'not-allowed',
                    }}
                >
                    Watch the Frog Jump!
                </button>
                <button
                    onClick={resetAnimation}
                    className="px-5 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                        background: 'hsl(215 16% 95%)',
                        color: 'hsl(215 16% 35%)',
                    }}
                >
                    Reset
                </button>
            </div>

            {step > 0 && (
                <div className="text-sm text-muted-foreground text-center max-w-md">
                    The frog has visited: <strong className="text-foreground">{sequence.slice(0, step + 1).join(' → ')}</strong>
                </div>
            )}
        </div>
    );
}

/**
 * Section 1: Introduction - The Mysterious Jumping Frog
 *
 * Uses stackLayout to create engaging narrative flow with animated visualization.
 */
export const section1Blocks: ReactElement[] = [
    // Hero title
    <StackLayout key="layout-s1-title" maxWidth="xl">
        <Block id="block-s1-title" padding="lg">
            <EditableH1 id="h1-s1-title" blockId="block-s1-title">
                The Mysterious Jumping Frog
            </EditableH1>
        </Block>
    </StackLayout>,

    // Engaging hook
    <StackLayout key="layout-s1-hook" maxWidth="xl">
        <Block id="block-s1-hook" padding="sm">
            <EditableParagraph id="para-s1-hook" blockId="block-s1-hook">
                Imagine a frog sitting on the number 0. This frog has a peculiar rule: on its first jump, it must hop exactly 1 space. On its second jump, exactly 2 spaces. On its third jump, exactly 3 spaces. And so on. But here's the twist — the frog always tries to jump backward first. It will only jump forward if jumping backward would land it on a negative number or a spot it has already visited.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Question to engage curiosity
    <StackLayout key="layout-s1-question" maxWidth="xl">
        <Block id="block-s1-question" padding="sm">
            <EditableParagraph id="para-s1-question" blockId="block-s1-question">
                Where does this strange frog end up? The answer is a beautiful mathematical pattern discovered by Colombian mathematician Bernardo Recamán Santos in 1991. Watch the frog and see if you can predict where it will land next!
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Frog visualization
    <StackLayout key="layout-s1-viz" maxWidth="2xl">
        <Block id="block-s1-viz" padding="md">
            <JumpingFrogViz />
        </Block>
    </StackLayout>,

    // Observation prompt
    <StackLayout key="layout-s1-observation" maxWidth="xl">
        <Block id="block-s1-observation" padding="sm">
            <EditableParagraph id="para-s1-observation" blockId="block-s1-observation">
                Notice how the frog's path creates beautiful arcs — some curving backward (when it can), others stretching forward (when it must). This unpredictable yet deterministic pattern is the Recamán sequence, and mathematicians still don't know all its secrets!
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
