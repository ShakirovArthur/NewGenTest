import { useDispatch, useSelector } from "react-redux";
import { fetchText, setIndex } from "../../store/slice";
import './TextArea.css'
import { useCallback, useEffect, useMemo, useState } from "react";

export const TextArea = () => {
    const text = useSelector((state) => state.text);
    const index = useSelector((state) => state.index)
    const dispatch = useDispatch();
    const [startTime, setStartTime] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(false);
    const [letterError, setLetterError] = useState(0)
    useEffect(() => {
        dispatch(fetchText());

    }, [dispatch])


    const handleKeyDown = useCallback((e) => {
        if (!startTime) {
            setStartTime(performance.now());
        }
        console.log(e.key)
        if (e.key === text[index]) {
            setHighlightedIndex(false);
            dispatch(setIndex(index + 1))
            //dada
        } else if (e.key.length === 1) {
            setHighlightedIndex(true);
            setLetterError(letterError + 1)
        }

    }, [index, startTime])


    const symbolsPerMinute = useMemo(() => {
        if (!startTime) {
            return 0;
        }
        const timeInMinutes = (performance.now() - startTime) / 60000;
        return (index / timeInMinutes).toFixed(0);
    }, [startTime, index]);

    const accuracy = useMemo(() => {
        if (letterError === 0) {
            return 100;
        }
        // Объянить про проценты
        return (100 - (letterError / text.length) * 100).toFixed(1);
    }, [letterError]);

    return (
        <div className='text-area'>
            <div className='content'>
                <div className='text' tabIndex={0} onKeyDown={handleKeyDown}>
                    <span className='correct-text'>{text.substring(0, (index))}</span>
                    <span className={highlightedIndex ? 'incorrect-text' : ''}>{text.substring(index, index + 1)}</span>
                    <span>{text.substring(index + 1)}</span>
                </div>
            </div>
            <div>{symbolsPerMinute} символы в минуту</div>
            <div>Точность: {accuracy}%</div>
        </div>
    )
}