import {Action, Dispatch} from "redux";
import {GeoNamesResource, GeoNamesResponseData, LocationResource} from "../../lib/types";
import {objectToURLQuery} from "../../lib/helpers";
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
          data: data.records.map((record: GeoNamesResource): LocationResource => ({
            country: record.fields.cou_name_en,
            country_code: record.fields.country_code,
            country_id: record.fields.geoname_id,
            feature_code: record.fields.feature_code,
            id: record.recordid,
            latitude: record.fields.coordinates[0],
            longitude: record.fields.coordinates[1],
            name: record.fields.name,
            population: record.fields.population,
            timezone: record.fields.timezone,
          }))
        });
      })
      .catch((error) => {
        dispatch({type: types.FETCH_REJECTED, data: error});
      });
  };
}
