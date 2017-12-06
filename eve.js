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

// ----------------------------------------------------------------------------
console.log(d3.version);
let treeTable = document.getElementById("tree-table");
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
    let data = d3.tsvParse(raw);
    this.currentRow = 0;
    this.currentCol = 0;
    this.rows = 0;
    this.generations = 5;
    this.tree = d3.stratify()
    .id(function(d) { return d.name; })
    .parentId(function(d) { return d.father; })
    (data);

    for (let i = 0; i < 50; i++) {
      this.addRow();
    }
    console.log("Created new Tree.");
  }

  addRow() {
  	let row = document.createElement("TR");
  	row.setAttribute("data-row", this.rows);
    this.rows++;
  	treeTable.appendChild(row);

		for (let j = 0; j < this.generations; j++) {
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
  }

  plotTree(person) {
    console.log("Plotting", person.id, "at", this.currentRow, this.currentCol);
    treeTable.querySelector('[data-row="' + this.currentRow + '"]').querySelector('[data-col="' + this.currentCol + '"]').firstChild.innerHTML = person.id;
    if (!person.children) {
      this.currentRow++;
      return;
    } else {
      this.currentCol++;
      for (const child of person.children) {
        this.plotTree(child);
      }
    }
  }

  printify() {
    // let tree = d3.tree();
    // let visualTree = tree(this.tree);
    let root = document.createTextNode(this.tree.id);
    treeTable.querySelector('[data-row="' + 0 + '"]').querySelector('[data-col="' + 0 + '"]').appendChild(root);
    console.log(this.tree);
    console.log(this.tree.id, this.tree.children);
    if (this.tree.children) {
      for (let i = 0; i < this.tree.children.length; i++) {
        let child = document.createTextNode(this.tree.children[i].id);
        document.getElementById("main").appendChild(child);
      }
    }
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
    t.plotTree(t.tree);
  };
  reader.readAsText(file);
}
