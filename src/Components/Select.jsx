import { ChevronDown } from "lucide-react";
import "../index.css";
import "./Select.css";

export default function Select({
  selected = "",
  setSelected,
  dropDown = false,
  setDropDown,
  array = [],
  label,
  disabled = -1,
  dropDownList,
}) {
  return (
    <div className="container">
      <span className="label">{label}</span>

      <div className="select">
        <button
          type="button"
          className="button input"
          aria-expanded={dropDown}
          onClick={() => {
            dropDownList.forEach((drop) => drop(false));
            setDropDown(!dropDown);
          }}
        >
          <span>{selected}</span>
          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className={`select-arrow ${dropDown ? "rotate" : ""}`}
          />
        </button>

        <div className={`options ${dropDown ? "show-options" : ""}`}>
          {array.map((choice) => {
            const disable = array.indexOf(choice) < disabled - 1;

            return (
              <button
                type="button"
                className={`option button input ${disable ? "disabled" : ""}`}
                disabled={disable}
                onClick={() => {
                  if (disable) return;
                  setSelected(choice);
                  setDropDown(false);
                }}
                key={choice}
              >
                <span>{choice}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}