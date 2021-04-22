import { gql } from "@apollo/client";

const SLIDERS_QUERY = gql`
  query GetSlideImages {
    sliders {
      id
      image {
        id
        url
      }
      caption
    }
  }
`;

export default SLIDERS_QUERY;
