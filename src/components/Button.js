import React from "react";
import cx from "classnames";

export default function Button({
  text,
  classnames,
  onClick,
  isSelected,
  isDisabled
}) {
  return (
    <div
      onClick={onClick}
      className={cx(`btn btn-default col-xs-3 ${classnames || ""}`, {
        selected: isSelected,
        "disabled-btn": isDisabled
      })}
    >
      {text}
    </div>
  );
}
