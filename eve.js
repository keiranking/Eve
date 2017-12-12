// Eve
// Copyright 2017 Keiran King

// LICENSE --------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// (https://www.apache.org/licenses/LICENSE-2.0)

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// CONSTANTS ------------------------------------------------------------------
let UNKNOWN = "unknown";

// DATA TYPE FUNCTIONS --------------------------------------------------------
String.prototype.toDate = function() { // convert date string to Date
  if (!this) { // empty string is not a date
    return false;
  }
  if (this.trim() == UNKNOWN) { // Unknown date
    return true;
  }
  let arr = this.trim().split(/\s'*|-|\/|\./); // splits on spaces, dots, dashes, slashes, apostrophes
  let day, month, year;
  if (arr.length) {
    year = Number(arr.pop());
    if (isNaN(year)) {
      return true; // Unknown date
    }
    if (year < 1700) {
      year += (year > new Date().getFullYear() - 2000) ? 1900 : 2000; // convert YY to YYYY
    }
  }
  if (arr.length) {
    month = arr.pop();
    if (isNaN(Number(month))) {
      month = month.slice(0,3).toLowerCase();
      switch (month) { // convert Mth to MM
        case "jan":
          month = 0;
          break;
        case "feb":
          month = 1;
          break;
        case "mar":
          month = 2;
          break;
        case "apr":
          month = 3;
          break;
        case "may":
          month = 4;
          break;
        case "jun":
          month = 5;
          break;
        case "jul":
          month = 6;
          break;
        case "aug":
          month = 7;
          break;
        case "sep":
          month = 8;
          break;
        case "oct":
          month = 9;
          break;
        case "nov":
          month = 10;
          break;
        case "dec":
          month = 11;
          break;
        default:
          return true; // month is not a number and not a recognized month
          break;
      }
    } else {
      month = Number(month);
      month--; // JavaScript Date uses 0 to 11 for months
    }
  } else {
    month = 0; // Unknown month becomes January
  }
  if (arr.length) {
    day = Number(arr.pop());
  } else {
    day = 1; // Unknown day becomes 1st of month
  }
  // console.log(this.toString());
  return new Date(year, month, day);
}

Array.prototype.contains = function(obj) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === obj) {
        return true;
    }
  }
  return false;
}

// console.log("unknown ".toDate());
// console.log("1983 ".toDate());
// console.log("05 Aug 1974".toDate());
// console.log("August '74".toDate());
// console.log("9-11-03".toDate());
// console.log("29.11.2017".toDate());
// console.log("4/3/54".toDate());

// CLASSES --------------------------------------------------------------------
class Person {
  constructor(p) {
    this.name = p["name"];
    this.surname = p["name"].split(" ").pop();
    this.birth = p["birth"].toDate();
    this.death = p["death"].toDate();
    this.mother = p["mother"];
    this.father = p["father"];
    this.partners = p["partners"];
    this.children = [];
  }
}

class Family {
  constructor(raw) { // takes tab-separated value data labeled 'name', 'birth', 'death', 'mother', 'father'
    this.dir = {};
    let data = d3.tsvParse(raw);
    for (let i = 0; i < data.length; i++) {
      this.dir[data[i]['name']] = new Person(data[i]);
      // this.addRow();
    }
    this.updateRoster();
    this.generateChildren();
    console.log("New Family.");
  }

  addRow() {
  	let row = document.createElement("TR");
  	row.setAttribute("data-row", treeTable.children.length);
  	treeTable.appendChild(row);

		for (let j = 0; j < 5; j++) {
	    let col = document.createElement("TD");
      col.setAttribute("data-col", j);

      let name = document.createElement("DIV");
      name.setAttribute("class", "name");
      name.appendChild(document.createTextNode(""));

      let dates = document.createElement("DIV");
      dates.setAttribute("class", "dates");
      dates.appendChild(document.createTextNode(""));

      col.appendChild(name);
      col.appendChild(dates);
      row.appendChild(col);
    }
    console.log("New row.");
  }

  generateChildren() {
    console.log("Generating children...");
    let names = Object.keys(this.dir).sort(function(a, b) { // list of names, sorted by age
      return this.dir[a].birth - this.dir[b].birth;
    }.bind(this));
    for (const name of names) {
      for (const candidate of names) {
        if (this.dir[candidate].mother == name || this.dir[candidate].father == name) {
          this.dir[name].children.push(candidate);
          console.log(name + " begat " + candidate + ".");
        }
      }
    }
    console.log("Children generated.");
  }

  updateRoster() {
    let roster = Object.keys(this.dir).sort();
    let r = document.getElementById("roster");
    r.innerHTML = "";
    for (const name of roster) {
      let option = document.createElement("OPTION");
      option.value = name;
      option.innerHTML = name;
      r.appendChild(option);
    }
  }

  plot(name, row, col) {
    // console.log(treeTable.children.length);
    while (treeTable.children.length <= row) {
      this.addRow();
    }
    console.log(name, "at", row, col);
    treeTable.querySelector('[data-row="' + row + '"]').querySelector('[data-col="' + col + '"]').firstChild.innerHTML = name;
    let count = 0;
    if (this.dir[name].children.length) {
      for (let i = 0; i < this.dir[name].children.length; i++) {
        count += this.plot(this.dir[name].children[i], row + count, col + 1);
      }
    } else {
      count++;
    }
    return count;
  }
}

// FUNCTIONS ------------------------------------------------------------------
function openFile(e) {
  let file = e.target.files[0];
  if (!file) {
    return;
  }
  let reader = new FileReader();
  reader.onload = function(e) {
    f = new Family(e.target.result);
    console.log("Opened " + file.name);
    f.plot("Noel King", 0, 0);
  };
  reader.readAsText(file);
}

function updateRoot() {
  treeTable.innerHTML = "";
  let r = document.getElementById("roster").value;
  console.log("Root is now " + r);
  f.plot(r, 0, 0);
}

// MAIN --------------------------------------------------------------------
console.log("D3 v" + d3.version);
let treeTable = document.getElementById("tree-table");
let t;
let f;
