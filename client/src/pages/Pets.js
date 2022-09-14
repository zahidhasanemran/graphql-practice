import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PetQuery = gql`
  query AllPets {
    pets {
      name
      id
      type
    }
  }
`;

const NewPet = gql`
  mutation CreatePet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);

  const { data, loading, error } = useQuery(PetQuery);

  const [addPet, newPetRes] = useMutation(NewPet);

  const onSubmit = (input) => {
    setModal(false);
    addPet({
      variables: { newPet: input },
    });
  };

  if (loading || newPetRes.loading) {
    return <Loader />;
  }

  if (error || newPetRes.error) {
    return <h2>Error</h2>;
  }

  console.log(data.pets);
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}
