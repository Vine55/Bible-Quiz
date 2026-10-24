import "../index.css";
import "./Landing.css";
import { Books } from "../Questions/Questions";
import Select from "../Components/Select";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Landing({ QuestionList, setQuestionList }) {
  const [book, setBook] = useState("Select a book");
  const [dropDownBook, setDropDownBook] = useState(false);

  const [chapterFrom, setChapterFrom] = useState("Select Chapter");
  const [dropDownChapterFrom, setDropDownChapterFrom] = useState(false);

  const [chapterTo, setChapterTo] = useState("Select Chapter");
  const [dropDownChapterTo, setDropDownChapterTo] = useState(false);

  const [max, setMax] = useState(0);
  const [amount, setAmount] = useState(20);

  let questions = [];
  let finalList = [];

  useEffect(() => {
    if (chapterFrom > chapterTo) setChapterTo(chapterFrom);
  }, [chapterFrom]);

  useEffect(() => {
    if (chapterTo == "Select Chapter") return;
    questions = [];

    const to = eval(chapterTo);
    const from = eval(chapterFrom);

    for (let i = from; i <= to; i++) {
      Books[book][`${i}`].forEach((question) => {
        questions.push(question);
      });
    }
    setMax(Math.min(100, questions.length));

    for (let i = 0; i < amount; i++) {
      let rand = Math.round(Math.random()* (questions.length - 1));
      finalList.push(questions[rand]);
      questions.pop(rand);
      console.log(questions.length);
    }
    setQuestionList(finalList);
    localStorage.setItem("questions", JSON.stringify(finalList));
    localStorage.setItem("answers", JSON.stringify({}));
    localStorage.setItem("number", 0);
  }, [chapterFrom, chapterTo, amount]);

  return (
    <main className="modal">
      <h1 className="header">Set up Quiz</h1>
      <div className="form">
        <div className="question">
          <Select
            selected={book}
            setSelected={setBook}
            dropDown={dropDownBook}
            setDropDown={setDropDownBook}
            array={Object.keys(Books)}
            label="Select a Book"
            dropDownList={[setDropDownChapterFrom, setDropDownChapterTo]}
          />
          <span
            className={`preview ${book != "" && book != "Select a book" ? "show-preview" : ""}`}
          >
            You will receive questions from the book of {book}
          </span>
        </div>
        <div className="question">
          <div className="select-container">
            <Select
              label="From Chapter"
              selected={chapterFrom}
              setSelected={setChapterFrom}
              dropDown={dropDownChapterFrom}
              setDropDown={setDropDownChapterFrom}
              array={
                book != "" && book != "Select a book"
                  ? Object.keys(Books[book])
                  : ["Select a book First"]
              }
              dropDownList={[setDropDownBook, setDropDownChapterTo]}
            />
            <Select
              label="To Chapter"
              selected={chapterTo}
              setSelected={setChapterTo}
              dropDown={dropDownChapterTo}
              setDropDown={setDropDownChapterTo}
              array={
                book != "" && book != "Select a book"
                  ? Object.keys(Books[book])
                  : ["Select a book First"]
              }
              disabled={
                chapterFrom != "Select Chapter" ? eval(chapterFrom) : 200
              }
              dropDownList={[setDropDownBook, setDropDownChapterFrom]}
            />
          </div>
          <span
            className={`preview ${chapterTo != "Select Chapter" ? "show-preview" : ""}`}
          >
            Questions will come from {book}{" "}
            {chapterFrom == chapterTo
              ? `${chapterFrom}`
              : `${chapterFrom} - ${chapterTo}`}
          </span>
        </div>
        <div className="question">
          <div className="question-header">
            <h2 className="label">Number of Questions</h2>
            <input
              type="number"
              className="amount-input"
              min={1}
              max={max}
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setAmount("");
                  return;
                }

                setAmount(Math.min(max, Math.max(1, Number(value))));
              }}
              onBlur={() => {
                if (amount === "" || max === 0) {
                  setAmount(max > 0 ? 1 : 0);
                }
              }}
              disabled={max === 0}
            />
          </div>

          <input
            type="range"
            min={1}
            max={max}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={max === 0}
          />

          <span
            className={`preview ${
              chapterTo !== "Select Chapter" ? "show-preview" : ""
            }`}
          >
            You will be answering {amount || 0} questions
          </span>
        </div>
        <Link
          to={chapterTo != "Select Chapter" && "/quiz"}
          className="button button-primary start"
        >
          Start Quiz
        </Link>
      </div>
    </main>
  );
}
