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
      imgj
      __typename
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);

  const { data, loading, error } = useQuery(PetQuery);

  const [addPet, newPetRes] = useMutation(NewPet, {
    //! Update function run after the mutation comes back
    update(cache, { data: { addPet } }) {
      const data = cache.readQuery({ query: PetQuery });
      cache.writeQuery({
        query: PetQuery,
        data: { pets: [addPet, ...data.pets] },
      });
    },
  });

  const onSubmit = (input) => {
    setModal(false);
    addPet({
      variables: { newPet: input },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: Math.floor(Math.random() * 10000) + "",
          name: input.name,
          type: input.type,
          img: "https://via.placeholder.com/300",
        },
      },
    });
  };
  // ||
  if (loading) {
    return <Loader />;
  }

  if (error || newPetRes.error) {
    return <h2>Error</h2>;
  }

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
