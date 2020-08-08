import { assign, Machine } from "xstate";

const toggleSign = num => (num[0] === "-" ? num.slice(1) : `-${num}`);

const deleteOneDigit = num =>
  num.length > 0 ? num.slice(0, num.length - 1) : "";

const getResult = ({ first_num, second_num, op }) => {
  switch (op) {
    case "+":
      return +first_num + +second_num;
    case "-":
      return +first_num - +second_num;
    case "*":
      return +first_num * +second_num;
    case "÷":
      return +first_num / +second_num;
    default:
      throw new Error("Invalid Operator");
  }
};

const initialContext = {
  first_num: "",
  second_num: "",
  op: "",
  result: ""
};

const calculatorMachine = Machine(
  {
    id: "calculator",
    initial: "START",
    context: initialContext,
    states: {
      START: {
        on: {
          NUM_PRESSED: {
            target: "FIRST_NUM",
            actions: ["updateFirstNum"]
          },
          DOT_PRESSED: {
            target: "FIRST_NUM_FLOAT",
            actions: ["updateFirstNum"]
          }
        }
      },
      FIRST_NUM: {
        on: {
          NUM_PRESSED: {
            actions: ["updateFirstNum"]
          },
          DOT_PRESSED: {
            target: "FIRST_NUM_FLOAT",
            actions: ["updateFirstNum"]
          },
          SIGN_PRESSED: {
            actions: ["toggleSignFirstNum"]
          },
          OP_PRESSED: {
            target: "OPERATOR",
            actions: ["assignOperator"]
          },
          DEL_PRESSED: {
            actions: ["deleteFirstNum"]
          },
          AC_PRESSED: {
            target: "START",
            actions: ["resetContext"]
          },
          CE_PRESSED: {
            actions: ["resetFirstNum"]
          }
        }
      },
      FIRST_NUM_FLOAT: {
        on: {
          NUM_PRESSED: {
            actions: ["updateFirstNum"]
          },
          SIGN_PRESSED: {
            actions: ["toggleSignFirstNum"]
          },
          OP_PRESSED: {
            target: "OPERATOR",
            actions: ["assignOperator"]
          },
          DEL_PRESSED: {
            actions: ["deleteFirstNum"]
          },
          AC_PRESSED: {
            target: "START",
            actions: ["resetContext"]
          },
          CE_PRESSED: {
            actions: ["resetFirstNum"]
          }
        }
      },
      OPERATOR: {
        on: {
          OP_PRESSED: {
            actions: ["assignOperator"]
          },
          NUM_PRESSED: {
            target: "SECOND_NUM",
            actions: ["updateSecondNum"]
          },
          DOT_PRESSED: {
            target: "SECOND_NUM_FLOAT",
            actions: ["updateSecondNum"]
          },
          AC_PRESSED: {
            target: "START",
            actions: ["resetContext"]
          }
        }
      },
      SECOND_NUM: {
        on: {
          NUM_PRESSED: {
            actions: ["updateSecondNum"]
          },
          DOT_PRESSED: {
            target: "SECOND_NUM_FLOAT",
            actions: ["updateSecondNum"]
          },
          SIGN_PRESSED: {
            actions: ["toggleSignSecondNum"]
          },
          EQ_PRESSED: {
            target: "EQ",
            actions: ["calculateResult"]
          },
          DEL_PRESSED: {
            actions: ["deleteSecondNum"]
          },
          AC_PRESSED: {
            target: "START",
            actions: ["resetContext"]
          },
          CE_PRESSED: {
            actions: ["resetSecondNum"]
          }
        }
      },
      SECOND_NUM_FLOAT: {
        on: {
          NUM_PRESSED: {
            actions: ["updateSecondNum"]
          },
          SIGN_PRESSED: {
            actions: ["toggleSignSecondNum"]
          },
          DEL_PRESSED: {
            actions: ["deleteSecondNum"]
          },
          AC_PRESSED: {
            target: "START",
            actions: ["resetContext"]
          },
          CE_PRESSED: {
            actions: ["resetSecondNum"]
          }
        }
      },
      EQ: {
        on: {
          NUM_PRESSED: {
            target: "FIRST_NUM",
            actions: ["resetContext", "updateFirstNum"]
          },
          DOT_PRESSED: {
            target: "FIRST_NUM_FLOAT",
            actions: ["resetContext", "updateFirstNum"]
          },
          AC_PRESSED: {
            target: "START",
            actions: ["resetContext"]
          },
          OP_PRESSED: {
            target: "OPERATOR",
            actions: assign({
              first_num: ({ result }) => result,
              op: (_, event) => event.key,
              result: ""
            })
          }
        }
      }
    }
  },
  {
    guards: {
      doesFirstNumExist: ({ first_num }) => first_num
    },
    actions: {
      updateFirstNum: assign({
        first_num: (context, event) => context.first_num + event.key
      }),
      toggleSignFirstNum: assign({
        first_num: context => toggleSign(context.first_num)
      }),
      deleteFirstNum: assign({
        first_num: context => deleteOneDigit(context.first_num)
      }),
      assignOperator: assign({
        op: (_, event) => event.key
      }),
      updateSecondNum: assign({
        second_num: (context, event) => context.second_num + event.key
      }),
      toggleSignSecondNum: assign({
        second_num: context => toggleSign(context.second_num)
      }),
      deleteSecondNum: assign({
        second_num: context => deleteOneDigit(context.second_num)
      }),
      calculateResult: assign({
        first_num: "",
        second_num: "",
        op: "",
        result: ({ first_num, second_num, op }) =>
          getResult({ first_num, second_num, op })
      }),
      resetFirstNum: assign({ first_num: "" }),
      resetSecondNum: assign({ second_num: "" }),
      resetContext: assign(initialContext)
    }
  }
);

export default calculatorMachine;
