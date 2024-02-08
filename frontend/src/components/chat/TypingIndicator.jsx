import React from "react";

const TypingIndicator = ({ owner, isTyping }) => {
  let typersDisplay = "";
  let countTypers = 0;

  for (const key in isTyping) {
    if (key !== owner && isTyping[key]) {
      typersDisplay += ", " + key;
      countTypers++;
    }
  }

  typersDisplay = typersDisplay.substring(1);
  typersDisplay += countTypers > 1 ? " are " : " is ";

  return (
    <div className={"chatApp__convTyping"}>
      {countTypers > 0 ? (
        <>
          {typersDisplay} writing
          <span className={"chatApp__convTypingDot"}></span>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TypingIndicator;
