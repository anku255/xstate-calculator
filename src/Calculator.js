import React from "react";
import { useMachine } from "@xstate/react";

import calculatorMachine from "./caculatorMachine";
import Button from "./components/Button";

const isDisabled = (state, text) => {
  const events = calculatorMachine.states[state.value].events;

  if (Number.isInteger(+text)) {
    return !events.includes("NUM_PRESSED");
  } else if (isOperator(text)) {
    return !events.includes("OP_PRESSED");
  } else if (text === "CE") {
    return !events.includes("CE_PRESSED");
  } else if (text === ".") {
    return !events.includes("DOT_PRESSED");
  } else if (text === "=") {
    return !events.includes("EQ_PRESSED");
  } else if (text === "±") {
    return !events.includes("SIGN_PRESSED");
  } else if (text === "DEL") {
    return !events.includes("DEL_PRESSED");
  } else if (text === "AC") {
    return !events.includes("AC_PRESSED");
  }
};

const isOperator = text => ["+", "-", "÷", "*"].includes(text);

const ROWS = [
  [
    { text: "AC" },
    { text: "CE" },
    { text: "DEL" },
    { text: "÷", classnames: "op_key" }
  ],
  [
    { text: "7" },
    { text: "8" },
    { text: "9" },
    { text: "*", classnames: "op_key" }
  ],
  [
    { text: "4" },
    { text: "5" },
    { text: "6" },
    { text: "-", classnames: "op_key" }
  ],
  [
    { text: "1" },
    { text: "2" },
    { text: "3" },
    { text: "+", classnames: "op_key" }
  ],
  [
    { text: "±" },
    { text: "0" },
    { text: "." },
    { text: "=", classnames: "eq_key" }
  ]
];

const Calculator = () => {
  const [state, sendMachine] = useMachine(calculatorMachine, {});

  const {
    context: { first_num, second_num, result }
  } = state;

  const display = result ? result : second_num ? second_num : first_num;

  const handleButtonClick = text => () => {
    if (Number.isInteger(+text)) {
      sendMachine("NUM_PRESSED", { key: text });
    } else if (isOperator(text)) {
      sendMachine("OP_PRESSED", { key: text });
    } else if (text === "CE") {
      sendMachine("CE_PRESSED", {});
    } else if (text === ".") {
      sendMachine("DOT_PRESSED", { key: "." });
    } else if (text === "=") {
      sendMachine("EQ_PRESSED", {});
    } else if (text === "±") {
      sendMachine("SIGN_PRESSED", {});
    } else if (text === "DEL") {
      sendMachine("DEL_PRESSED", {});
    } else if (text === "AC") {
      sendMachine("AC_PRESSED", {});
    }
  };

  return (
    <div className="container">
      <div id="display_1">{display || 0}</div>

      {ROWS.map((row, i) => {
        return (
          <div key={i} classnames="row">
            {row.map(button => (
              <Button
                key={button.text}
                text={button.text}
                isDisabled={isDisabled(state, button.text)}
                isSelected={button.text === state.context.op}
                onClick={handleButtonClick(button.text)}
                classnames={button.classnames}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Calculator;
