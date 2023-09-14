import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { useState } from "react";
// import StarRating from './StarRating'

// function Test() {
//   const[movierating, setMovieRating] = useState(0)

//   // const handleMovieRating = function (rating) {
//   //   setMovieRating(rating)
//   // }
//   return <div>
//     <StarRating onMovieRating = {setMovieRating}  />
//     <p>This movies was rated {movierating} </p>
//   </div>
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <TopLevel /> */}
    {/* <StarRating maxRating = {10} defaultRating={10}/>
    <StarRating maxRating = {5}/>
    <StarRating />
    {/* <a  href="#">test</a> */}
    {/* <Test /> */} 
  </React.StrictMode>
);

/*
function TopLevel() {
  const [greet, setGreet] = useState("rey");
  return (
    <h1>
      hello
      <Level1>
        <Level2>
          <Level3>
            <Level4 greet={greet}></Level4>
          </Level3>
        </Level2>
      </Level1>
    </h1>
  );
}

function Level1({children}) {
  return (
    <h1>
      Hi
  {children}
    </h1>
  );
}

function Level2({children}) {
  return (
    <h1>
      hey
      {children}
    </h1>
  );
}

function Level3({ children }) {
  return (
    <h1>
      oy
      {children}
    </h1>
  );
}

function Level4({ greet }) {
  return (
    <h1>
      oye
      <h3>{greet}</h3>
    </h1>
  );
}
*/