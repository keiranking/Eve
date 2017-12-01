// Eve
// ------------------------------------------------------------------------
// Copyright 2017 Keiran King

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// (https://www.apache.org/licenses/LICENSE-2.0)

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ------------------------------------------------------------------------
console.log(d3.version);
let t;

class Person {
  constructor(p) {
    this.name = p["name"];
    this.surname = p["name"];
    this.birth = new Date(p["birth"]);
    this.death = p["death"] == "" ? undefined : new Date(p["death"]);
    this.mother = p["mother"];
    this.father = p["father"];
    this.partners = p["partners"];
  }

  printify() {
    let div = document.createElement("DIV");
    div.appendChild(document.createTextNode(this.name));
    div.appendChild(document.createTextNode("of " + this.mother + " and " + this.father));
    document.getElementById("main").appendChild(div);
  }
}

class Tree {
  constructor(raw) {
    // this.directory = {};
    // console.log(raw);
    let data = d3.tsvParse(raw);
    console.log(data);

    this.tree = d3.stratify()
    .id(function(d) { return d.name; })
    .parentId(function(d) { return d.father; })
    (data);

    // for (const row in data) {
    //   this.directory[row["name"]] = new Person(row);
    // }
    console.log("Created new Tree.");
  }

  printify() {
    console.log(this.tree);
  }
}

function openFile(e) {
  let file = e.target.files[0];
  if (!file) {
    return;
  }
  let reader = new FileReader();
  reader.onload = function(e) {
    const raw = e.target.result;
    t = new Tree(raw);
    console.log("Opened " + file.name);
    t.printify();
  };
  reader.readAsText(file);
}
