import {Action, Dispatch} from "redux";
import {GeoNamesResponseData} from "../../lib/types";
import {geoNames2Location, objectToURLQuery} from "../../lib/helpers";
import {types} from "./locations.reducer";

export const fetchLargestCities = (): any => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({type: types.FETCH_START});

    const url = 'https://public.opendatasoft.com/api/records/1.0/search/?' + objectToURLQuery({
      dataset: 'geonames-all-cities-with-a-population-1000',
      rows: 15,
      sort: 'population',
    });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: GeoNamesResponseData) => {
        dispatch({
          type: types.FETCH_FULFILLED,
          data: data.records.map(geoNames2Location)
        });
      })
      .catch((error) => {
        dispatch({type: types.FETCH_REJECTED, data: error});
      });
  };
}
