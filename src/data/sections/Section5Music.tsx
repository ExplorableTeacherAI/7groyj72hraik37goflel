import { type ReactElement, useState, useEffect, useRef, useCallback } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
} from "@/components/atoms";

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
 * Piano key frequencies (C4 to C6 - two octaves)
 */
const NOTE_FREQUENCIES: Record<number, number> = {
    0: 261.63,  // C4
    1: 277.18,  // C#4
    2: 293.66,  // D4
    3: 311.13,  // D#4
    4: 329.63,  // E4
    5: 349.23,  // F4
    6: 369.99,  // F#4
    7: 392.00,  // G4
    8: 415.30,  // G#4
    9: 440.00,  // A4
    10: 466.16, // A#4
    11: 493.88, // B4
    12: 523.25, // C5
    13: 554.37, // C#5
    14: 587.33, // D5
    15: 622.25, // D#5
    16: 659.25, // E5
    17: 698.46, // F5
    18: 739.99, // F#5
    19: 783.99, // G5
    20: 830.61, // G#5
    21: 880.00, // A5
    22: 932.33, // A#5
    23: 987.77, // B5
    24: 1046.50, // C6
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Check if a key is black (sharp/flat)
 */
function isBlackKey(keyIndex: number): boolean {
    const noteInOctave = keyIndex % 12;
    return [1, 3, 6, 8, 10].includes(noteInOctave);
}

/**
 * Interactive Piano Visualization for Recamán Sequence
 */
function PianoVisualization() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
    const [activeKey, setActiveKey] = useState<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationRef = useRef<number | null>(null);

    const sequence = computeRecaman(30);
    const numKeys = 25; // Two octaves + 1

    // Initialize audio context
    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    // Play a single note
    const playNote = useCallback((noteIndex: number) => {
        const ctx = getAudioContext();
        const keyIndex = noteIndex % numKeys;
        const frequency = NOTE_FREQUENCIES[keyIndex];

        if (!frequency) return;

        // Create oscillator
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Use sine wave for mellow piano-like sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        // Add harmonics for richer sound
        const oscillator2 = ctx.createOscillator();
        const gainNode2 = ctx.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(ctx.destination);
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);
        gainNode2.gain.setValueAtTime(0.15, ctx.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        oscillator.start(ctx.currentTime);
        oscillator2.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        oscillator2.stop(ctx.currentTime + 0.4);

        setActiveKey(keyIndex);
        setTimeout(() => setActiveKey(null), 300);
    }, [getAudioContext, numKeys]);

    // Play sequence
    const playSequence = useCallback(() => {
        if (isPlaying) return;
        setIsPlaying(true);
        setCurrentNoteIndex(0);

        let noteIndex = 0;
        const playNext = () => {
            if (noteIndex < Math.min(sequence.length, 25)) {
                playNote(sequence[noteIndex]);
                setCurrentNoteIndex(noteIndex);
                noteIndex++;
                animationRef.current = window.setTimeout(playNext, 350);
            } else {
                setIsPlaying(false);
                setCurrentNoteIndex(-1);
            }
        };
        playNext();
    }, [isPlaying, sequence, playNote]);

    // Stop sequence
    const stopSequence = useCallback(() => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }
        setIsPlaying(false);
        setCurrentNoteIndex(-1);
        setActiveKey(null);
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    // Calculate white keys and their positions
    const whiteKeyIndices = Array.from({ length: numKeys }, (_, i) => i).filter(i => !isBlackKey(i));
    const whiteKeyWidth = 100 / whiteKeyIndices.length;

    // Get the position of a white key
    const getWhiteKeyPosition = (keyIndex: number): number => {
        const position = whiteKeyIndices.indexOf(keyIndex);
        return position * whiteKeyWidth;
    };

    // Get black key position (between white keys)
    const getBlackKeyPosition = (keyIndex: number): number => {
        // Find the white key to the left
        let whiteKeysBefore = 0;
        for (let i = 0; i < keyIndex; i++) {
            if (!isBlackKey(i)) whiteKeysBefore++;
        }
        return (whiteKeysBefore - 0.35) * whiteKeyWidth;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Piano keyboard */}
            <div className="p-6 rounded-xl bg-card" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="relative h-48 mx-auto" style={{ maxWidth: '700px' }}>
                    {/* White keys */}
                    <div className="absolute inset-0 flex">
                        {whiteKeyIndices.map((keyIndex) => {
                            const isActive = activeKey === keyIndex;
                            const isInSequence = sequence.slice(0, currentNoteIndex + 1).some(n => n % numKeys === keyIndex);

                            return (
                                <div
                                    key={`white-${keyIndex}`}
                                    className="relative flex-1 border border-gray-300 rounded-b-lg cursor-pointer transition-all duration-100"
                                    style={{
                                        background: isActive
                                            ? 'hsl(152 76% 60%)'
                                            : isInSequence
                                                ? 'hsl(152 76% 85%)'
                                                : 'white',
                                        boxShadow: isActive
                                            ? 'inset 0 0 10px rgba(0,0,0,0.3)'
                                            : '0 2px 5px rgba(0,0,0,0.1)',
                                        transform: isActive ? 'translateY(2px)' : 'none',
                                    }}
                                    onClick={() => playNote(keyIndex)}
                                >
                                    {/* Key label */}
                                    <span
                                        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium"
                                        style={{
                                            color: isActive ? 'white' : 'hsl(var(--muted-foreground))',
                                        }}
                                    >
                                        {NOTE_NAMES[keyIndex % 12]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Black keys */}
                    {Array.from({ length: numKeys }, (_, i) => i)
                        .filter(isBlackKey)
                        .map((keyIndex) => {
                            const isActive = activeKey === keyIndex;
                            const isInSequence = sequence.slice(0, currentNoteIndex + 1).some(n => n % numKeys === keyIndex);
                            const leftPos = getBlackKeyPosition(keyIndex);

                            return (
                                <div
                                    key={`black-${keyIndex}`}
                                    className="absolute top-0 h-28 cursor-pointer transition-all duration-100 rounded-b-md"
                                    style={{
                                        left: `${leftPos}%`,
                                        width: `${whiteKeyWidth * 0.6}%`,
                                        background: isActive
                                            ? 'hsl(262 83% 50%)'
                                            : isInSequence
                                                ? 'hsl(262 83% 35%)'
                                                : '#1a1a1a',
                                        boxShadow: isActive
                                            ? 'inset 0 0 8px rgba(0,0,0,0.5)'
                                            : '0 3px 6px rgba(0,0,0,0.4)',
                                        transform: isActive ? 'translateY(2px)' : 'none',
                                        zIndex: 10,
                                    }}
                                    onClick={() => playNote(keyIndex)}
                                />
                            );
                        })}
                </div>

                {/* Current note indicator */}
                <div className="text-center mt-4 text-sm text-muted-foreground">
                    {isPlaying && currentNoteIndex >= 0 ? (
                        <span>
                            Playing note {currentNoteIndex + 1}: <strong className="text-foreground font-mono">{sequence[currentNoteIndex]}</strong>
                            {' → '}
                            <strong style={{ color: 'hsl(152 76% 40%)' }}>
                                {NOTE_NAMES[sequence[currentNoteIndex] % 12]}
                                {Math.floor(sequence[currentNoteIndex] / 12) + 4}
                            </strong>
                        </span>
                    ) : (
                        <span>Click a key to play, or press "Play Sequence" to hear the Recamán melody</span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={isPlaying ? stopSequence : playSequence}
                    className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                    style={{
                        background: isPlaying ? 'hsl(0 84% 60%)' : 'hsl(152 76% 40%)',
                        color: 'white',
                    }}
                >
                    {isPlaying ? (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                            Stop
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                            Play Sequence
                        </>
                    )}
                </button>
            </div>

            {/* Sequence visualization */}
            <div className="p-4 rounded-xl bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2 font-medium">
                    Sequence (first 25 terms) → mapped to piano keys:
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {sequence.slice(0, 25).map((num, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 rounded text-xs font-mono transition-all"
                            style={{
                                background: i === currentNoteIndex
                                    ? 'hsl(152 76% 40%)'
                                    : i < currentNoteIndex
                                        ? 'hsl(152 76% 85%)'
                                        : 'hsl(var(--muted))',
                                color: i === currentNoteIndex
                                    ? 'white'
                                    : 'hsl(var(--foreground))',
                                transform: i === currentNoteIndex ? 'scale(1.1)' : 'scale(1)',
                            }}
                        >
                            {num}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Section 5: Listening to Recamán
 *
 * The sequence turned into music with an interactive piano visualization.
 */
export const section5Blocks: ReactElement[] = [
    // Section title
    <StackLayout key="layout-s5-title" maxWidth="xl">
        <Block id="block-s5-title" padding="md">
            <EditableH2 id="h2-s5-title" blockId="block-s5-title">
                Listening to Recamán
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-s5-intro" maxWidth="xl">
        <Block id="block-s5-intro" padding="sm">
            <EditableParagraph id="para-s5-intro" blockId="block-s5-intro">
                Mathematics and music share a deep connection. What if we could hear the Recamán sequence? By mapping each number to a musical note — where each number corresponds to a key on the piano, wrapping around every two octaves — we can turn this mathematical pattern into a melody!
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Piano visualization
    <StackLayout key="layout-s5-piano" maxWidth="2xl">
        <Block id="block-s5-piano" padding="md">
            <PianoVisualization />
        </Block>
    </StackLayout>,

    // Observation
    <StackLayout key="layout-s5-observation" maxWidth="xl">
        <Block id="block-s5-observation" padding="sm">
            <EditableParagraph id="para-s5-observation" blockId="block-s5-observation">
                The melody has an organic, almost haunting quality — not random, yet not predictable. The backward jumps create moments where the melody seems to circle back on itself, while the forward leaps push it into new territory. Musicians and composers have created full compositions based on this sequence, finding beauty in its mathematical origins.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
