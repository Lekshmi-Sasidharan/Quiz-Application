import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import trophyImage from '../Images/trophy.png';

const quizData = [
  {
    question: "What is React?",
    choices: ["A library for building user interfaces", "A database", "A web server", "A programming language"],
    answer: "A library for building user interfaces"
  },
  {
    question: "Which company developed React?",
    choices: ["Google", "Facebook", "Microsoft", "Twitter"],
    answer: "Facebook"
  },
  {
    question: "In which language is React written?",
    choices: ["Java", "Python", "JavaScript", "C++"],
    answer: "JavaScript"
  },
  {
    question: "What is a component in React?",
    choices: [
      "A reusable piece of UI",
      "A type of function",
      "A server-side script",
      "A database entity"
    ],
    answer: "A reusable piece of UI"
  },
  {
    question: "What is the purpose of the render() method in React?",
    choices: [
      "To initialize state",
      "To update state",
      "To define the UI component",
      "To handle events"
    ],
    answer: "To define the UI component"
  },
  {
    question: "What is JSX?",
    choices: ["A syntax extension for JavaScript", "A new programming language", "A type of database", "A server-side framework"],
    answer: "A syntax extension for JavaScript"
  },
  {
    question: "What is the virtual DOM?",
    choices: [
      "A direct representation of the actual DOM",
      "A copy of the actual DOM kept in memory",
      "A type of web server",
      "A new web browser"
    ],
    answer: "A copy of the actual DOM kept in memory"
  },
  {
    question: "What is the purpose of state in React?",
    choices: [
      "To handle HTTP requests",
      "To manage dynamic data within a component",
      "To style components",
      "To connect to the database"
    ],
    answer: "To manage dynamic data within a component"
  },
  {
    question: "What is a higher-order component in React?",
    choices: [
      "A component that manages state",
      "A component that handles user input",
      "A function that takes a component and returns a new component",
      "A built-in React component"
    ],
    answer: "A function that takes a component and returns a new component"
  },
  {
    question: "What does the useEffect hook do in React?",
    choices: [
      "Manages state in functional components",
      "Performs side effects in functional components",
      "Defines routes in a React application",
      "Styles components"
    ],
    answer: "Performs side effects in functional components"
  }
];

function Home() {
  const [step, setStep] = useState(1);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [minute, setMinute] = useState(1);
  const [second, setSecond] = useState(0);
  const [time, setTime] = useState(60); // Default time in seconds
  const [timeTaken, setTimeTaken] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false); // State to toggle answer view
  const [modals, setModals] = useState(Array.from({ length: quizData.length }, () => false)); // Array to manage modals for each question

  useEffect(() => {
    const newTime = minute * 60 + second;
    setTime(newTime);
  }, [minute, second]);

  useEffect(() => {
    let timer;
    if (step === 2 && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setStep(3);
    }
    return () => clearInterval(timer);
  }, [step, time]);

  const handleQuizStart = () => {
    setStep(2);
    setTime(minute * 60 + second);
    setTimeTaken(0);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers([...answers, selectedAnswer]);
      setSelectedAnswer(null);
      if (activeQuestion + 1 === quizData.length) {
        setStep(3);
        setTimeTaken(minute * 60 + second - time);
      } else {
        setActiveQuestion(activeQuestion + 1);
      }
    }
  };

  const handlePrevQuestion = () => {
    setActiveQuestion(activeQuestion - 1);
    setSelectedAnswer(answers[activeQuestion - 1]);
  };

  const handleOptionSelect = (choice) => {
    setSelectedAnswer(choice);
  };

  const handleQuizReset = () => {
    setStep(1);
    setActiveQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setMinute(1);
    setSecond(0);
    setTime(60);
    setTimeTaken(0);
    setShowAnswers(false);
    setModals(Array.from({ length: quizData.length }, () => false)); // Reset modals state
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === quizData[index]?.answer).length;
  };

  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const toggleModal = (index) => {
    const newModals = [...modals];
    newModals[index] = !newModals[index];
    setModals(newModals);
  };

  const formatAnswers = () => {
    return quizData.map((question, index) => (
      <div key={index} className="mb-3">
        <p>{index + 1}. {question.question}</p>
        <Button variant="primary" onClick={() => toggleModal(index)}>
          View Answer
        </Button>
        <Modal show={modals[index]} onHide={() => toggleModal(index)}>
          <Modal.Header closeButton>
            <Modal.Title>Question {index + 1} Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Your Answer:</strong> {answers[index]}</p>
            <p><strong>Correct Answer:</strong> {question.answer}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => toggleModal(index)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    ));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'skyblue' }}>
      <Card className="text-center" style={{ width: '90%', maxWidth: '800px', backgroundColor: '#343a40', color: 'white' }}>
        <Card.Body>
          <Card.Title style={{ fontSize: '40px' }}>{step === 1 ? 'Start the Quiz' : step === 2 ? 'Quiz in Progress' : 'Quiz Completed'}</Card.Title>
          {step === 1 && (
            <>
              <Card.Text style={{ fontSize: '20px' }}>Good luck!</Card.Text>
              <Card.Text style={{ fontSize: '20px' }}>Time: {time} sec</Card.Text>
              <Row className="mb-3">
                <Col>
                  <div className="text-white bg-purple p-2 rounded d-flex justify-content-center align-items-center">
                    <p style={{ backgroundColor: 'white', color: 'black', width: '50px', textAlign: 'center', margin: '0' }}>{minute}</p>
                    <p style={{ fontSize: '20px', margin: '0', marginRight: '5px' }}>Min</p>
                  </div>
                </Col>
                <Col>
                  <div className="text-white bg-purple p-2 rounded d-flex justify-content-center align-items-center">
                    <p style={{ backgroundColor: 'white', color: 'black', width: '50px', textAlign: 'center', margin: '0' }}>{second}</p>
                    <p style={{ fontSize: '20px', margin: '0', marginRight: '5px' }}>Sec</p>
                  </div>
                </Col>
              </Row>
              <Button variant="purple" style={{ color: 'white', fontSize: '20px', backgroundColor: 'purple', borderColor: 'purple' }} onClick={handleQuizStart}>
                START
              </Button>
            </>
          )}
          {step === 2 && (
            <div>
              <Row>
                <Col xs={12} md={6} className="text-left mt-3">
                  <p>Question {activeQuestion + 1}/{quizData.length}</p>
                  <p>{quizData[activeQuestion].question}</p>
                </Col>
                <Col xs={12} md={6} className="text-right">
                  <p>{time} sec</p>
                </Col>
              </Row>
              <Row>
                <Col></Col>
                <Col md={6} className="d-flex flex-column align-items-start">
                  {quizData[activeQuestion].choices.map((choice, index) => (
                    <Button
                      key={index}
                      className={`mb-2 ${selectedAnswer === choice ? 'active' : ''}`}
                      style={{ width: '100%', textAlign: 'left' }}
                      onClick={() => handleOptionSelect(choice)}
                    >
                      {choice}
                    </Button>
                  ))}
                </Col>
              </Row>
              <div className="mt-3 d-flex justify-content-between">
                {activeQuestion > 0 && (
                  <Button onClick={handlePrevQuestion}>
                    Previous
                  </Button>
                )}
                <Button onClick={handleNextQuestion}>
                  {activeQuestion < quizData.length - 1 ? 'Next' : 'Submit'}
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              {time === 0 && <p>Time is up!</p>}
              <img src={trophyImage} height={50} alt="Trophy" className="mb-3" />
              <p>You answered {calculateScore()}/{quizData.length} questions correctly.</p>
              <p>Your score: {(calculateScore() / quizData.length * 100).toFixed(2)}%</p>
              <p>Time taken: {Math.floor(timeTaken / 60)} min {timeTaken % 60} sec</p>
              <Button onClick={toggleShowAnswers}>Check Answers</Button>
              <Button className="m-5" onClick={handleQuizReset}>Try Again</Button>
              {showAnswers && (
                <div>
                  <Card.Text className='mt-5'>
                    <strong>Your Answers</strong>
                    {formatAnswers()}
                  </Card.Text>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
