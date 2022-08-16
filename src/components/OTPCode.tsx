import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import './styles.css';

interface IOtpCodeProps {
    items?: number;
    classNames?: string;
    onChange: (v: string) => void;
}

interface IUpdateArrayProps {
    index: number;
    value: string | HTMLInputElement;
    array: string[] | HTMLInputElement[];
}

function updateArray({ index, value, array }: IUpdateArrayProps) {
    return [...array.slice(0, index), value ?? '', ...array.slice(index + 1)];
}

export const OtpCode = ({ items = 6, classNames, onChange }: IOtpCodeProps) => {
    /**
     * variables
     */
    const inputs = new Array(items).fill('');

    const [codes, setCodes] = useState(inputs);
    const inputRefs = useRef<HTMLInputElement[]>(inputs);

    /**
     * handlers
     */
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const target = e.target as HTMLInputElement;
        const inputValue = target.value.trim().split('');
        let _inputValue = inputValue[1] ?? inputValue[0] ?? '';

        //Solves the issue with changing the input values when the cursor is on the left side of the letter
        if (inputValue[1] === codes[index]) {
            _inputValue = inputValue[0];
        }

        const newArray = updateArray({ index, value: _inputValue, array: codes });
        setCodes(newArray);
        onChange(newArray.join(''));

        if (Number(target.id) === items - 1) {
            return null;
        }

        if (_inputValue !== '') {
            inputRefs.current[Number(target.id) + 1].focus();
        }
    }

    function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const { key } = e;
        const target = e.target as HTMLInputElement;

        switch (key) {
            case 'Backspace':
                {
                    if (inputRefs.current[Number(target.id)].value === '') {
                        inputRefs.current[Number(target.id) - 1].focus();
                    }
                }
                break;

            case 'ArrowRight':
            case 'ArrowUp':
                {
                    if (Number(target.id) !== items - 1) {
                        inputRefs.current[Number(target.id) + 1].focus();
                    }
                }
                break;

            case 'ArrowLeft':
            case 'ArrowDown':
                {
                    if (Number(target.id) !== 0) inputRefs.current[Number(target.id) - 1].focus();
                }
                break;

            default:
                break;
        }
    }

    function handleRef(ref: HTMLInputElement, index: number) {
        const newArray = updateArray({
            index,
            value: ref as HTMLInputElement,
            array: inputRefs.current as HTMLInputElement[]
        });
        inputRefs.current = newArray as HTMLInputElement[];
    }

    function handleOnPaste(e: React.ClipboardEvent, index: number) {
        // ***
        e.preventDefault();

        const clipboardData = e.clipboardData.getData('text').split('').slice(0, items);
        const clipboardLength = e.clipboardData.getData('text').length;

        let _inputs = [...codes];
        let clipboardInputInitialIndex = 0;

        for (let i = index; i <= items - 1; i++) {
            _inputs = [..._inputs.slice(0, i), clipboardData[clipboardInputInitialIndex] ?? _inputs[i] ?? '', ..._inputs.slice(i + 1)];
            setCodes(_inputs);
            clipboardInputInitialIndex++;
        }

        // focus on the last "empty" input
        const spacesLeft = items - index;

        if (spacesLeft > clipboardLength) {
            const lastString = index + clipboardLength;
            inputRefs.current[Number(lastString)].focus();
        } else {
            inputRefs.current[items - 1].focus();
        }
    }

    /**
     * effects
     */

    // override ArrowLeft key default functionality - to be able to focus on the right side of the input field
    useEffect(() => {
        const arrowLeft = (e: KeyboardEvent) => e.key === 'ArrowLeft';
        const arrowUp = (e: KeyboardEvent) => e.key === 'ArrowUp';

        const ignore = (e: KeyboardEvent) => {
            if (arrowLeft(e) || arrowUp(e)) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', ignore);

        return () => {
            window.removeEventListener('keydown', ignore);
        };
    }, []);

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    return (
        <div className={classnames('otp-code', classNames)}>
            {codes.map((value, index) => {
                return (
                    <input
                        key={index}
                        id={`${index}`}
                        value={codes[index]}
                        maxLength={2}
                        ref={(ref) => handleRef(ref as HTMLInputElement, index)}
                        onChange={(e) => handleOnChange(e, index)}
                        onKeyDown={handleOnKeyDown}
                        onPaste={(e) => handleOnPaste(e, index)}
                    />
                );
            })}
        </div>
    );
};
