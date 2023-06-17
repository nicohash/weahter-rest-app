import React, { useRef } from "react";
import styles from "./CityInputForm.module.css";

/**
 * This is a custom input form that takes the input of the city name from the user which is named inputCity
 * @generator
 * @param {PropertyDefinition} props 
 * @returns {JSX}
 */
const CityInputForm = (props) => {
  const cityInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const inputCity = cityInputRef.current.value;
    props.onSubmitHandler(inputCity);
  };

  return (
    <>
      <form className={styles["form-control"]} onSubmit={submitHandler}>
        <div>
          <label htmlFor="city">Enter a city</label>
          <input
            id="city"
            type="text"
            ref={cityInputRef}
            placeholder="Frankfurt"
          />
        </div>
      </form>
    </>
  );
};

export default CityInputForm;