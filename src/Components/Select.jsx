
import { ChevronDown, Check } from "lucide-react";
import { useId } from "react";
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
  dropDownList = [],
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-options`;

  return (
    <div className="container">
      <span className="label" id={labelId}>
        {label}
      </span>

      <div className={`select ${dropDown ? "select-open" : ""}`}>
        <button
          type="button"
          className="button input"
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-expanded={dropDown}
          onClick={() => {
            if (dropDown) {
              setDropDown(false);
              return;
            }

            dropDownList.forEach((closeDropdown) =>
              closeDropdown(false)
            );

            setDropDown(true);
          }}
        >
          <span className="select-value">{selected}</span>

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className={`select-arrow ${
              dropDown ? "rotate" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        <div
          id={listId}
          className={`options ${
            dropDown ? "show-options" : ""
          }`}
          role="listbox"
          aria-labelledby={labelId}
          aria-hidden={!dropDown}
          inert={!dropDown}
        >
          {array.map((choice, index) => {
            const disable =
              typeof disabled === "number" &&
              disabled >= 0 &&
              index < disabled - 1;

            const isSelected = String(choice) === String(selected);

            return (
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`option button ${
                  isSelected ? "option-selected" : ""
                } ${disable ? "disabled" : ""}`}
                disabled={disable}
                onClick={() => {
                  if (disable) return;

                  setSelected(choice);
                  setDropDown(false);
                }}
                key={choice}
                tabIndex={dropDown ? 0 : -1}
              >
                <span className="option-label">{choice}</span>

                {isSelected && (
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="option-check"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
