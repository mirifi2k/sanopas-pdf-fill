import { useCallback, useId, useRef } from 'react';

type SegmentedInputProps = {
    id?: string;
    label: string;
    length: number;
    value: string;
    onChange: (value: string) => void;
    inputMode?: 'numeric' | 'text';
    pattern?: RegExp;
    hint?: string;
    autoUppercase?: boolean;
};

export function SegmentedInput({
    id: idProp,
    label,
    length,
    value,
    onChange,
    inputMode = 'text',
    pattern,
    hint,
    autoUppercase = false,
}: SegmentedInputProps) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const chars = Array.from({ length }, (_, i) => value[i] ?? '');

    const commit = useCallback(
        (nextChars: string[]) => {
            const joined = nextChars.join('').slice(0, length);
            onChange(joined);
        },
        [length, onChange],
    );

    const handleChange = (index: number, raw: string) => {
        let segment = raw.slice(-1);
        if (!segment) {
            const next = [...chars];
            next[index] = '';
            commit(next);
            return;
        }
        if (pattern && !pattern.test(segment)) return;
        if (autoUppercase) segment = segment.toUpperCase();

        const next = [...chars];
        next[index] = segment;
        commit(next);

        if (index < length - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, key: string) => {
        if (key === 'Backspace' && !chars[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
        if (key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
        if (key === 'ArrowRight' && index < length - 1)
            refs.current[index + 1]?.focus();
    };

    const handlePaste = (index: number, text: string) => {
        let pasted = text.replace(/\s/g, '');
        if (pattern)
            pasted = pasted
                .split('')
                .filter((c) => pattern.test(c))
                .join('');
        if (autoUppercase) pasted = pasted.toUpperCase();
        const next = [...chars];
        for (let i = 0; i < pasted.length && index + i < length; i += 1) {
            next[index + i] = pasted[i];
        }
        commit(next);
        const focusAt = Math.min(index + pasted.length, length - 1);
        refs.current[focusAt]?.focus();
    };

    return (
        <div className='field'>
            <label className='field-label' htmlFor={`${id}-0`}>
                {label}
            </label>
            {hint ? <p className='field-hint'>{hint}</p> : null}
            <div className='segment-row' role='group' aria-label={label}>
                {chars.map((char, index) => (
                    <input
                        key={index}
                        id={index === 0 ? `${id}-0` : undefined}
                        ref={(el) => {
                            refs.current[index] = el;
                        }}
                        className='segment-input'
                        type='text'
                        inputMode={inputMode}
                        maxLength={1}
                        value={char}
                        autoComplete='off'
                        aria-label={`${label}, caracter ${index + 1}`}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e.key)}
                        onPaste={(e) => {
                            e.preventDefault();
                            handlePaste(index, e.clipboardData.getData('text'));
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
