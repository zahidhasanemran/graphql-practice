import React from "react";

const PetBox = ({ pet }) => {
  console.log(pet);
  return (
    <div className="pet">
      <figure>
        <img src={"https://via.placeholder.com/200"} alt="" />
      </figure>
      <div className="pet-name">{pet.name}</div>
      <div className="pet-type">{pet.type}</div>
    </div>
  );
};

export default PetBox;
