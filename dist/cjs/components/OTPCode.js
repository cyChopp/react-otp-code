"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpCode = void 0;
const react_1 = __importStar(require("react"));
function updateArray({ index, value, array }) {
    return [...array.slice(0, index), value !== null && value !== void 0 ? value : '', ...array.slice(index + 1)];
}
const OtpCode = ({ items = 6, classNames, onChange }) => {
    /**
     * variables
     */
    const inputs = new Array(items).fill('');
    const [codes, setCodes] = (0, react_1.useState)(inputs);
    const inputRefs = (0, react_1.useRef)(inputs);
    /**
     * handlers
     */
    function handleOnChange(e, index) {
        var _a, _b;
        const target = e.target;
        const inputValue = target.value.trim().split('');
        let _inputValue = (_b = (_a = inputValue[1]) !== null && _a !== void 0 ? _a : inputValue[0]) !== null && _b !== void 0 ? _b : '';
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
    function handleOnKeyDown(e) {
        const { key } = e;
        const target = e.target;
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
                    if (Number(target.id) !== 0)
                        inputRefs.current[Number(target.id) - 1].focus();
                }
                break;
            default:
                break;
        }
    }
    function handleRef(ref, index) {
        const newArray = updateArray({
            index,
            value: ref,
            array: inputRefs.current
        });
        inputRefs.current = newArray;
    }
    function handleOnPaste(e, index) {
        var _a, _b;
        // ***
        e.preventDefault();
        const clipboardData = e.clipboardData.getData('text').split('').slice(0, items);
        const clipboardLength = e.clipboardData.getData('text').length;
        let _inputs = [...codes];
        let clipboardInputInitialIndex = 0;
        for (let i = index; i <= items - 1; i++) {
            _inputs = [..._inputs.slice(0, i), (_b = (_a = clipboardData[clipboardInputInitialIndex]) !== null && _a !== void 0 ? _a : _inputs[i]) !== null && _b !== void 0 ? _b : '', ..._inputs.slice(i + 1)];
            setCodes(_inputs);
            clipboardInputInitialIndex++;
        }
        // focus on the last "empty" input
        const spacesLeft = items - index;
        if (spacesLeft > clipboardLength) {
            const lastString = index + clipboardLength;
            inputRefs.current[Number(lastString)].focus();
        }
        else {
            inputRefs.current[items - 1].focus();
        }
    }
    /**
     * effects
     */
    // override ArrowLeft key default functionality - to be able to focus on the right side of the input field
    (0, react_1.useEffect)(() => {
        const arrowLeft = (e) => e.key === 'ArrowLeft';
        const arrowUp = (e) => e.key === 'ArrowUp';
        const ignore = (e) => {
            if (arrowLeft(e) || arrowUp(e)) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', ignore);
        return () => {
            window.removeEventListener('keydown', ignore);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        inputRefs.current[0].focus();
    }, []);
    return (react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'row', gap: '20px', marginLeft: 'auto', marginRight: 'auto' }, className: classNames }, codes.map((value, index) => {
        return (react_1.default.createElement("input", { style: { height: '57px', width: '40px', textAlign: 'center' }, key: index, id: `${index}`, value: codes[index], maxLength: 2, ref: (ref) => handleRef(ref, index), onChange: (e) => handleOnChange(e, index), onKeyDown: handleOnKeyDown, onPaste: (e) => handleOnPaste(e, index) }));
    })));
};
exports.OtpCode = OtpCode;
//# sourceMappingURL=OtpCode.js.map