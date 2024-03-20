import { useState } from "react";

import axios from "axios";
import cheerio from "cheerio";

//scrape response data from
//https://www.irs.gov/efile-index-taxpayer-search?zip=90021&state=6

const states = [
  //null at index 0 makes states' 'number' correspond to index
  null,
  "Any",
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

//this will always be sorted alphabetically bc the response is always returned alphabetically
const preparers = [];
const sortedPrep = [];

//write a function that takes in state name and zip code and returns HTML

function Form() {
  const [details, setDetails] = useState({
    state: "",
    zip: "",
    sortType: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function getHTML(state, zip) {
    let stateNum = states.indexOf(state);

    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://www.irs.gov/efile-index-taxpayer-search?zip=${zip}&state=${stateNum}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching tax preparers:", error);
      return null;
    }
  }

  function sortByEither(wayToSort) {
    if (wayToSort === "phone") {
      //   console.log("line 103 hit");

      preparers.sort();
    }

    // console.log("line108", preparers);
    for (let i = 0; i < preparers.length; i++) {
      sortedPrep.push(preparers[i][1]);
    }
    //   console.log("line98", sortedPrep);
    return sortedPrep;
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(details);
    getHTML(details.state, details.zip)
      .then((res) => {
        const $ = cheerio.load(res);
        $("tbody>tr").each((i, preparer) => {
          let item = $(preparer)
            .find("td.views-field.views-field-nothing-1")
            .text();

          //phone is just the number value of the phone number for sorting
          let phone = $(preparer)
            .find("td.views-field.views-field-nothing-1 a")
            .text()
            .replace(/\s/g, "")
            .replace("(", "")
            .replace(")", "")
            .replace("-", "");

          preparers.push([phone, item]);
          // console.log('line 135', item, phone);
        });
      })
      .then((res) => {
        sortByEither(details.sortType);
        console.log("line 140", sortedPrep);
      });
  }

  return (
    <div className="Form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="stateDropdown">Select a state:</label>
        <select id="stateDropdown" name="state" onChange={handleChange}>
          <option value="">-- Select a state --</option>
          <option value="Alabama">Alabama</option>
          <option value="Alaska">Alaska</option>
          <option value="Arizona">Arizona</option>
          <option value="Arkansas">Arkansas</option>
          <option value="California">California</option>
          <option value="Colorado">Colorado</option>
          <option value="Connecticut">Connecticut</option>
          <option value="Delaware">Delaware</option>
          <option value="Florida">Florida</option>
          <option value="Georgia">Georgia</option>
          <option value="Hawaii">Hawaii</option>
          <option value="Idaho">Idaho</option>
          <option value="Illinois">Illinois</option>
          <option value="Indiana">Indiana</option>
          <option value="Iowa">Iowa</option>
          <option value="Kansas">Kansas</option>
          <option value="Kentucky">Kentucky</option>
          <option value="Louisiana">Louisiana</option>
          <option value="Maine">Maine</option>
          <option value="Maryland">Maryland</option>
          <option value="Massachusetts">Massachusetts</option>
          <option value="Michigan">Michigan</option>
          <option value="Minnesota">Minnesota</option>
          <option value="Mississippi">Mississippi</option>
          <option value="Missouri">Missouri</option>
          <option value="Montana">Montana</option>
          <option value="Nebraska">Nebraska</option>
          <option value="Nevada">Nevada</option>
          <option value="New Hampshire">New Hampshire</option>
          <option value="New Jersey">New Jersey</option>
          <option value="New Mexico">New Mexico</option>
          <option value="New York">New York</option>
          <option value="North Carolina">North Carolina</option>
          <option value="North Dakota">North Dakota</option>
          <option value="Ohio">Ohio</option>
          <option value="Oklahoma">Oklahoma</option>
          <option value="Oregon">Oregon</option>
          <option value="Pennsylvania">Pennsylvania</option>
          <option value="Rhode Island">Rhode Island</option>
          <option value="South Carolina">South Carolina</option>
          <option value="South Dakota">South Dakota</option>
          <option value="Tennessee">Tennessee</option>
          <option value="Texas">Texas</option>
          <option value="Utah">Utah</option>
          <option value="Vermont">Vermont</option>
          <option value="Virginia">Virginia</option>
          <option value="Washington">Washington</option>
          <option value="West Virginia">West Virginia</option>
          <option value="Wisconsin">Wisconsin</option>
          <option value="Wyoming">Wyoming</option>
        </select>

        <label htmlFor="zipInput">Enter a Zip Code:</label>
        <input
          type="text"
          id="zipInput"
          name="zip"
          placeholder="Enter a zip..."
          onChange={handleChange}
        />

        <label htmlFor="sortDropDown">Sort By:</label>
        <select id="sortDropDown" name="sortType" onChange={handleChange}>
          <option value="">-- Select a way to sort --</option>
          <option value="name">By Name</option>
          <option value="phone">By Number</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;
