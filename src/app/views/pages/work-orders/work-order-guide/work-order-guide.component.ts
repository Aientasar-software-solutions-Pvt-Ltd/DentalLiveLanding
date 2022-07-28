import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import 'cardinal-spline-js/src/curve.js'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-work-order-guide',
  templateUrl: './work-order-guide.component.html',
  styleUrls: ['./work-order-guide.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderGuideComponent implements OnInit {


  @ViewChild('notes')
  notes: ElementRef;

  workOrderObject = {
    "Restorative": {
      "Full contour": [
        "Zirconia",
        "Emax",
        "Pekkton",
        "Gold",
        "Non precious",
        "Wax",
        "Pmma",
        "Composite",
        "Shade selection"
      ],
      "Layered": [
        "Zirconia",
        "Emax",
        "Pekkton",
        "Gold",
        "Non precious",
        "Wax",
        "Pmma",
        "Shade selection"
      ],
      "Temporary": {
        "Pmma": [
          "Shade selection"
        ],
        "Composite": [
          "Shade selection"
        ]
      },
      "Veneer": [
        "Emax",
        "Composite",
        "HT zirconia",
        "Pmma",
        "Shade selection"
      ],
      "Inlay/Outlay": [
        "Emax",
        "Composite",
        "HT zirconia",
        "Pmma",
        "Shade selection"
      ],
      "Waxup": [
        "Waxup"
      ]
    },
    "Implant": {
      "Fixed": {
        "Single unit": {
          "Screw retained": {
            "Implant brand": {
              "Restorative material": [
                "Shade"
              ]
            }
          },
          "Cement Retained": {
            "Implant brand": {
              "Restorative material": [
                "Shade"
              ]
            }
          }
        },
        "Multiple unit": {
          "Screw retained": {
            "Implant brand": {
              "Restorative material": [
                "Shade"
              ]
            }
          },
          "Cement retained": {
            "Implant brand": {
              "Restorative material": [
                "Shade"
              ]
            }
          },
          "Bar": [
            "Bar"
          ]
        }
      },
      "Removeable": {
        "Multiple unit": {
          "Screw retained": {
            "Implant brand": {
              "Restorative material": [
                "Shade"
              ]
            }
          },
          "Bar": [
            "Bar"
          ]
        }
      }
    },
    "Ortho": [
      "Wire",
      "Retainer"
    ],
    "Removeable": [
      "Denture",
      "Partial denture"
    ],
    "Sleep": [
      "Types of sleep devices"
    ],
    "Surgical planning": [
      "Surgical plan",
      "Surgical guide"
    ]
  }

  constructor(private location: Location) { }
  ngOnInit(): void { }

  ngAfterViewInit() {
    this.populateListRecurse(this.workOrderObject, "workOrderTree");
  }

  selectionCount = 0;
  liCount = 0;
  showLabel = false;
  activeAssignedTeeth = null;

  populateListRecurse(object: any, ref: string): void {
    for (const key in object) {

      const value = object[key];
      this.selectionCount = this.selectionCount + 1;

      let h6 = document.createElement('h6')
      h6.textContent = key;
      document.getElementById(ref)?.appendChild(h6);

      let ul = document.createElement('ul')
      ul.setAttribute("id", "ul#" + this.selectionCount);
      document.getElementById(ref)?.appendChild(ul);


      if (typeof value === 'object' && !Array.isArray(value))
        this.populateListRecurse(value, 'ul#' + this.selectionCount);
      else {
        for (let index = 0; index < value.length; index++) {
          this.liCount = this.liCount + 1;
          const element = value[index];
          let child = document.createElement('li')

          document.getElementById("ul#" + this.selectionCount)?.appendChild(child);
          child.innerHTML = "<div class='form-check'><input class='form-check-input' type = 'checkbox' value='d" + this.liCount + "' id = 'd" + this.liCount + "'><label class='form-check-label' for= 'd" + this.liCount + "' >" + element + "</label></div>";
        }
      }
    }
  }

  hoverTeeth(event: any, isenter: boolean) {
    let canvas = document.getElementById('rhovmap');
    if (canvas) {
      let cnv = <HTMLCanvasElement>canvas;
      let ctx = cnv.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      if (!isenter) return;
      let coords = event.target.getAttribute('coords').split(',');
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      //@ts-ignore
      ctx.curve(coords, 1);
      ctx.closePath();
      ctx.fill();
    }
  }

  selectedTeeths: any = [];
  clickTeeth(event: any) {
    this.resetListandTeeths();
    if (this.activeAssignedTeeth)
      this.selectedTeeths = [];
    if (this.toothGuide[event.target.getAttribute('id')]) {
      this.selectedTeeths = [];
      this.activeAssignedTeeth = event.target.getAttribute('id');
      this.redrawGuide('rcurrmap', [this.activeAssignedTeeth], "rgba(255, 255, 0, 0.9)");
      this.notes.nativeElement.value = this.toothGuide[event.target.getAttribute('id')].notes;
      //loop and assign values of selected teeth
      this.toothGuide[event.target.getAttribute('id')].selections.forEach(selection => {
        //@ts-ignore
        document.getElementById(selection).checked = true;
        document.getElementById(selection).classList.add('showNode', 'active');
        let parentElem = document.getElementById(selection);
        while (parentElem.parentNode) {
          if (parentElem.nodeName == "UL") {
            parentElem.classList.add('showNode', 'active');
            //@ts-ignore
            parentElem.previousSibling.classList.add('showNode', 'active');
          }
          if (parentElem.classList.contains("selectionTree")) {
            parentElem.classList.add('showNode', 'active');
          }
          parentElem = <HTMLElement>parentElem.parentNode;
        }
      });
    } else {
      this.activeAssignedTeeth = null;
      //toggle from selected teeths
      if (this.selectedTeeths.includes(event.target.getAttribute('id')))
        this.selectedTeeths = this.selectedTeeths.filter(e => e !== event.target.getAttribute('id'))
      else
        this.selectedTeeths.push(event.target.getAttribute('id'))
      this.redrawGuide('rclkmap', this.selectedTeeths, "rgba(0, 0, 0, .9)");
    }
  }

  resetListandTeeths() {
    //@ts-ignore -- clear all selections
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
    document.querySelectorAll('.showNode').forEach(el => el.classList.remove('showNode', 'active'));
    this.redrawGuide('rcurrmap', [], "rgba(255, 255, 0, 0.9)");
    this.notes.nativeElement.value = "";
  }

  toothGuide: any = {};

  getToothGuide() {
    return this.toothGuide;
  }

  setToothGuide(toothGuide: any) {
    this.toothGuide = toothGuide;
    this.resetListandTeeths();
    this.selectedTeeths = [];
    this.activeAssignedTeeth = null;
    this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.7)");
  }

  addNotes(event: any) {
    let text = event.target.value;
    if (this.activeAssignedTeeth && this.toothGuide[this.activeAssignedTeeth]) {
      this.toothGuide[this.activeAssignedTeeth]['notes'] = text;
    } else {
      this.selectedTeeths.forEach(element => {
        if (!this.toothGuide[element])
          this.toothGuide[element] = { "selections": [], "notes": "" };
        this.toothGuide[element]['notes'] = text;
      });
      if (this.selectedTeeths.length == 1)
        this.activeAssignedTeeth = this.selectedTeeths[0];
    }
    this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.7)");
  }

  addSelections(event: any) {
    if (event?.target?.type == "checkbox") {
      if (this.activeAssignedTeeth && this.toothGuide[this.activeAssignedTeeth]) {
        //update of single teeth
        if (event.target.checked) {
          this.toothGuide[this.activeAssignedTeeth]['selections'].push(event.target.value);
          this.loopSeelctionParent(event.target);
        } else {
          this.toothGuide = this.toothGuide[this.activeAssignedTeeth]['selections'].filter(e => e !== event.target.getAttribute('id'))
        }
      } else {
        //assignment
        if (event.target.checked) {
          //@ts-ignore
          this.selectedTeeths.forEach(element => {
            if (!this.toothGuide[element])
              this.toothGuide[element] = { "selections": [], "notes": "" };
            this.toothGuide[element]['selections'].push(event.target.value);
          });
          this.loopSeelctionParent(event.target);
        } else {
          this.selectedTeeths.forEach(element => {
            if (this.toothGuide[element])
              this.toothGuide = this.toothGuide[element]['selections'].filter(e => e !== event.target.getAttribute('id'))
          });
        }
        if (this.selectedTeeths.length == 1) {
          this.activeAssignedTeeth = this.selectedTeeths[0];
          this.redrawGuide('rcurrmap', [this.activeAssignedTeeth], "rgba(255, 255, 0, 0.9)");
        }
        this.activeAssignedTeeth = this.selectedTeeths[0];
      }
      console.log(this.toothGuide);
      this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.7)");
    }
    let ellm: HTMLElement = event.path[0].nextSibling;
    //@ts-ignore
    if (ellm?.previousSibling?.localName == "h6") ellm.previousSibling?.classList.toggle("showNode");
    ellm?.classList.toggle("showNode");
  }

  loopSeelctionParent(selection) {
    while (selection.parentNode) {
      if (selection.classList.contains("showNode") || selection.classList.contains("selectionTree")) {
        selection.classList.add('active');
      }
      selection = <HTMLElement>selection.parentNode;
    }
  }

  deleteSelection() {
    Swal.fire({
      title: 'Do you want to delete this selection?',
      showDenyButton: true,
      confirmButtonText: 'Yes,delete tooth',
      denyButtonText: `No,don't delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.activeAssignedTeeth) {
          delete this.toothGuide[this.activeAssignedTeeth];
          this.resetListandTeeths();
          this.activeAssignedTeeth = null;
          this.selectedTeeths = [];
          this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.8)");
          this.redrawGuide('rclkmap', this.selectedTeeths, "rgba(0, 0, 0, .9)");
        }
      }
    })
  }

  redrawGuide(canvasName: any, teethArray: any, color: any) {

    let canvas = document.getElementById(canvasName);
    let cnv = <HTMLCanvasElement>canvas;
    let ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    teethArray.forEach(element => {
      let coords = document.getElementById(element).getAttribute('coords').split(',');
      ctx.fillStyle = color;
      ctx.beginPath();
      //@ts-ignore
      ctx.curve(coords, 1);
      ctx.closePath();
      ctx.fill();
    });
  }

}




