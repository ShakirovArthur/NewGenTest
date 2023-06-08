import { useDispatch, useSelector } from "react-redux";
import { fetchText, setIndex } from "../../store/slice";
import "./TextArea.css";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import { initialState, reducer } from "../hooksReducer";

export const TextArea = () => {
    const text = useSelector((state) => state.text);
    const index = useSelector((state) => state.indexLetter);
    const dispatchRedux = useDispatch();
    const [state, dispatchReact] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatchRedux(fetchText());
    }, [dispatchRedux]);


    const handleKeyDown = useCallback((e) => {
        if (!state.startTime) {
            dispatchReact({type: "SET_START_TIME", payload: performance.now()});
        }
        if (e.key === text[index]) {
            dispatchReact({type: "SET_HAS_INCORRECT_LETTER", payload: false});
            dispatchRedux(setIndex(index + 1));
            // Данным условием я игнорирую регистрацию нажатий вспомогательных клавиш
        } else if (e.key.length === 1) {
            dispatchReact({type: "SET_HAS_INCORRECT_LETTER", payload: true});
            dispatchReact({type: "SET_LETTER_ERROR", payload: initialState.letterError + 1});
        }

    }, [dispatchRedux, index, state.startTime, text]);


    const symbolsPerMinute = useMemo(() => {
        if (!state.startTime) {
            return 0;
        }
        const timeInMinutes = (performance.now() - state.startTime) / 60000;
        return (index / timeInMinutes).toFixed(0);
    }, [state.startTime, index]);

    const accuracy = useMemo(() => {
        if (state.letterError === 0) {
            return 100;
        }
        // На данной строке вычисляется проценты точности вводимой информации
        return (100 - (state.letterError / text.length) * 100).toFixed(1);
    }, [state.letterError, text.length]);

    const restart = useCallback(() => {
        dispatchRedux(setIndex(0));
        dispatchReact({type: "SET_LETTER_ERROR", payload: 0});
        dispatchReact({type: "SET_START_TIME", payload: null});
        dispatchReact({type: "SET_HAS_INCORRECT_LETTER", payload: false});
    }, [dispatchRedux]);

    return (
        <div className="text-area">
            <div className="content">
                <div className="text" tabIndex={0} onKeyDown={handleKeyDown}>
                    <span className="correct-text">{text.substring(0, (index))}</span>
                    <span
                        className={state.hasIncorrectLetter ? "incorrect-letter" : ""}>{text.substring(index, index + 1)}</span>
                    <span>{text.substring(index + 1)}</span>
                </div>
            </div>
            <Row>
                <Col md={6}>
                    <InputGroup className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>Символов в минуту: {symbolsPerMinute}</InputGroup.Text>
                            <InputGroup.Text>Точность:{`${accuracy}%`}</InputGroup.Text>
                        </InputGroup>
                    </InputGroup>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" onClick={restart}>Начать заново</Button>
                </Col>
            </Row>
        </div>
    );
};