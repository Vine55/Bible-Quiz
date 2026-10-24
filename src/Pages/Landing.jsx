
import "../index.css";
import "./Landing.css";
import { Books } from "../Questions/Questions";
import Select from "../Components/Select";
import { useState, useEffect, useMemo } from "react";
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

  const chapterOptions = useMemo(() => {
    if (!Books[book]) return [];
    return Object.keys(Books[book]).sort((a, b) => Number(a) - Number(b));
  }, [book]);

  const isReady =
    book !== "Select a book" &&
    chapterFrom !== "Select Chapter" &&
    chapterTo !== "Select Chapter" &&
    max > 0 &&
    QuestionList?.length > 0;

  useEffect(() => {
    if (
      chapterFrom === "Select Chapter" ||
      chapterTo === "Select Chapter"
    ) {
      return;
    }

    const from = Number(chapterFrom);
    const to = Number(chapterTo);

    if (Number.isNaN(from) || Number.isNaN(to)) return;

    if (from > to) {
      setChapterTo(chapterFrom);
    }
  }, [chapterFrom, chapterTo]);

  useEffect(() => {
    if (!Books[book]) {
      setMax(0);
      setQuestionList([]);
      return;
    }

    if (
      chapterFrom === "Select Chapter" ||
      chapterTo === "Select Chapter"
    ) {
      setMax(0);
      setQuestionList([]);
      return;
    }

    const from = Number(chapterFrom);
    const to = Number(chapterTo);

    if (
      Number.isNaN(from) ||
      Number.isNaN(to) ||
      from > to
    ) {
      return;
    }

    const questions = [];

    for (let chapter = from; chapter <= to; chapter++) {
      const chapterQuestions = Books[book][String(chapter)];

      if (Array.isArray(chapterQuestions)) {
        questions.push(...chapterQuestions);
      }
    }

    const questionLimit = Math.min(100, questions.length);
    setMax(questionLimit);

    if (questionLimit === 0) {
      setQuestionList([]);
      return;
    }

    const requestedAmount = Math.min(
      questionLimit,
      Math.max(1, Number(amount) || 1)
    );

    if (Number(amount) !== requestedAmount) {
      setAmount(requestedAmount);
    }

    const shuffledQuestions = [...questions];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [
        shuffledQuestions[i],
        shuffledQuestions[randomIndex],
      ] = [
        shuffledQuestions[randomIndex],
        shuffledQuestions[i],
      ];
    }

    const finalList = shuffledQuestions.slice(0, requestedAmount);

    setQuestionList(finalList);

    localStorage.setItem("questions", JSON.stringify(finalList));
    localStorage.setItem("answers", JSON.stringify({}));
    localStorage.setItem("number", "0");
  }, [book, chapterFrom, chapterTo, amount, setQuestionList]);

  useEffect(() => {
    if (!Books[book]) return;

    const firstChapter = chapterOptions[0];

    setChapterFrom(firstChapter ?? "Select Chapter");
    setChapterTo(firstChapter ?? "Select Chapter");
    setDropDownBook(false);
    setDropDownChapterFrom(false);
    setDropDownChapterTo(false);
  }, [book, chapterOptions]);

  return (
    <main className="modal landing-modal">
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
            dropDownList={[
              setDropDownChapterFrom,
              setDropDownChapterTo,
            ]}
          />

          <span
            className={`preview ${
              book !== "Select a book" ? "show-preview" : ""
            }`}
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
                Books[book]
                  ? chapterOptions
                  : ["Select a book First"]
              }
              dropDownList={[
                setDropDownBook,
                setDropDownChapterTo,
              ]}
            />

            <Select
              label="To Chapter"
              selected={chapterTo}
              setSelected={setChapterTo}
              dropDown={dropDownChapterTo}
              setDropDown={setDropDownChapterTo}
              array={
                Books[book]
                  ? chapterOptions
                  : ["Select a book First"]
              }
              disabled={
                chapterFrom !== "Select Chapter"
                  ? Number(chapterFrom)
                  : 200
              }
              dropDownList={[
                setDropDownBook,
                setDropDownChapterFrom,
              ]}
            />
          </div>

          <span
            className={`preview ${
              chapterTo !== "Select Chapter" &&
              chapterFrom !== "Select Chapter"
                ? "show-preview"
                : ""
            }`}
          >
            Questions will come from {book}{" "}
            {chapterFrom === chapterTo
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
              min={max > 0 ? 1 : 0}
              max={max}
              value={amount}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setAmount("");
                  return;
                }

                setAmount(
                  Math.min(
                    max,
                    Math.max(1, Number(value) || 1)
                  )
                );
              }}
              onBlur={() => {
                if (amount === "" || max === 0) {
                  setAmount(max > 0 ? 1 : 0);
                }
              }}
              disabled={max === 0}
              aria-label="Number of quiz questions"
            />
          </div>

          <input
            type="range"
            min={1}
            max={Math.max(1, max)}
            value={Math.min(max, Math.max(1, Number(amount) || 1))}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={max === 0}
            aria-label="Adjust number of quiz questions"
          />

          <span
            className={`preview ${
              chapterTo !== "Select Chapter" &&
              chapterFrom !== "Select Chapter" &&
              max > 0
                ? "show-preview"
                : ""
            }`}
          >
            You will be answering {amount || 0} questions
            {max > 0 ? ` out of ${max} available` : ""}
          </span>
        </div>

        <Link
          to={isReady ? "/quiz" : "#"}
          onClick={(e) => {
            if (!isReady) e.preventDefault();
          }}
          aria-disabled={!isReady}
          className={`button button-primary start ${
            isReady ? "" : "start-disabled"
          }`}
        >
          Start Quiz
        </Link>
      </div>
    </main>
  );
}
