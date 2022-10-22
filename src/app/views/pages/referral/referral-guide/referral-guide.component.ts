import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import 'cardinal-spline-js/src/curve.js'


@Component({
  selector: 'app-referral-guide',
  templateUrl: './referral-guide.component.html',
  styleUrls: ['./referral-guide.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReferralGuideComponent implements OnInit {
  referralObject = {
    "Endodontics": {
      "Consultation for": [
        "Pulp Exposure",
        "Vital",
        "Necrotic",
        "Emergency treatment provided",
        "Patient has discomfort please evaluate",
        "Post space required"
      ],
      "Bridge cemented": [
        "Temporary",
        "Permanently"
      ],
      "X-Rays": [
        "Uploaded",
        "E-mailed",
        "Take",
        "Sent with patient",
        "Please send a copy once taken",
        "Upload"
      ],
      "Restorative Treatment": [
        "Planned",
        "Will be Planned",
        "Is not indicated",
        "Will Discuss"
      ]
    },
    "Oral Surgery": {
      "Consultation for": [
        "Extraction",
        "3rd Molar Extractions",
        "Exposure (s) of teeth",
        "Impacted teeth/tooth",
        "Orthognathic surgery",
        "Oral pathology",
        "Biopsy",
        "Dental Implants",
        "Bone grafting",
        "TMJ Assessment/Diagnosis",
        "Socket Grafting",
        "Sinus Grafting",
        "Cone Beam CT",
        "Treatment Planning",
        "Anesthesia and or Sedation",
        "Corrective Jaw Surgery",
        "Trauma",
        "Fracture"
      ],
      "X-Rays": [
        "Uploaded",
        "E-mailed",
        "Take",
        "Sent with patient",
        "Please send a copy once taken",
        "Upload"
      ],
      "Restorative Treatment": [
        "Planned",
        "Will be Planned",
        "Is not indicated",
        "Will Discuss"
      ]
    },
    "Prosthodontist": {
      "Consultation for": [
        "Comprehensive Prosthodontics Evaluation",
        "Complete Dentures",
        "Partial Dentures",
        "Implant supported overdenture",
        "Redo prosthesis: Fixed/Removable",
        "Crowns and Bridges",
        "Dental Implants",
        "Broken Prosthesis",
        "Ill-fitting prosthesis",
        "Fractured implant parts or components",
        "Tooth wear",
        "TMJ Assessment",
        "Esthetic treatment",
        "Smile Make over",
        "Full Mouth Rehabilitation",
        "Congenitally Missing teeth"
      ],
      "X-Rays": [
        "Uploaded",
        "E-mailed",
        "Take",
        "Sent with patient",
        "Please send a copy once taken",
        "Upload"
      ],
      "Restorative Treatment": [
        "Planned",
        "Will be Planned",
        "Is not indicated",
        "Will Discuss"
      ]
    },
    "Orthodontist": {
      "Consultation for": [
        "Comprehensive Prosthodontics Evaluation",
        "Early or Interceptive Orthodontic Treatment",
        "Pre-prosthetic Orthodontic Treatment",
        "Intrusion",
        "Extrusion",
        "Up righting",
        "Implant site development",
        "Lost Retainer",
        "Debonded fixed retainer",
        "Growth cessation Assessment",
        "Crowding",
        "Spaces Issues",
        "Malocclusion",
        "Cephalograms Tracing/Assessment"
      ],
      "X-Rays": [
        "Uploaded",
        "E-mailed",
        "Take",
        "Sent with patient",
        "Please send a copy once taken",
        "Upload"
      ],
      "Restorative Treatment": [
        "Planned",
        "Will be Planned",
        "Is not indicated",
        "Will Discuss"
      ]
    },
    "Periodontist": {
      "Consultation for": [
        "Comprehensive Periodontist Evaluation",
        "Periodontal Disease",
        "Functional crown lengthening",
        "Esthetic crown lengthening",
        "Gingival Recession",
        "Soft tissue Grafting",
        "Hard tissue Grafting",
        "Extraction(s)",
        "Dental Implant(s)",
        "Sinus Grafting",
        "Trauma from Occlusion",
        "Occlusal Trauma"
      ],
      "X-Rays": [
        "Uploaded",
        "E-mailed",
        "Take",
        "Sent with patient",
        "Please send a copy once taken",
        "Upload"
      ],
      "Restorative Treatment": [
        "Planned",
        "Will be Planned",
        "Is not indicated",
        "Will Discuss"
      ]
    },
    "Pediodontist": {
      "Consultation for": [
        "Comprehensive Pedodontic Evaluation",
        " Treatment"
      ],
      "X-Rays": [
        "Uploaded",
        "E-mailed",
        "Take",
        "Sent with patient",
        "Please send a copy once taken",
        "Upload"
      ],
      "Restorative Treatment": [
        "Planned",
        "Will be Planned",
        "Is not indicated",
        "Will Discuss"
      ]
    }
  }
  isFdi = false;
  @ViewChild('notes')
  notes: ElementRef;


  constructor(private location: Location) { }
  ngOnInit(): void { }

  ngAfterViewInit() {
    this.populateListRecurse(this.referralObject, "tree");
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
  selectedTeethsNames: any = [];

  getToothName(tooth) {
    if (document.querySelector("." + tooth.trim() + " label"))
      return document.querySelector("." + tooth.trim() + " label").innerHTML;
    return null;
  }

  getCheckboxName(selection) {
    let loop = "";
    if (document.querySelector("label[for=" + selection + "]")) {
      //@ts-ignore
      loop = document.querySelector("label[for=" + selection + "]").innerHTML;
      let parentElem = document.getElementById(selection);
      while (parentElem.parentNode) {
        if (parentElem.nodeName == "UL") {
          //@ts-ignore
          loop = parentElem.previousSibling.innerHTML + " --> " + loop;
        }
        parentElem = <HTMLElement>parentElem.parentNode;
      }
    }
    return loop;
  }

  clickTeeth(event: any, key = null) {
    if (!key) key = event.target.getAttribute('id');
    this.resetListandTeeths();
    if (this.activeAssignedTeeth)
      this.selectedTeeths = [];
    this.selectedTeethsNames = [];
    if (this.toothGuide[key]) {
      this.selectedTeeths = [];
      this.selectedTeethsNames = [];
      this.activeAssignedTeeth = key;
      this.redrawGuide('rcurrmap', [this.activeAssignedTeeth], "rgba(255, 255, 0, 0.9)");
      this.notes.nativeElement.value = this.toothGuide[key].notes;
      //loop and assign values of selected teeth
      this.toothGuide[key].selections.forEach(selection => {
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
      if (this.selectedTeeths.includes(key))
        this.selectedTeeths = this.selectedTeeths.filter(e => e !== key)
      else
        this.selectedTeeths.push(key)

    }
    this.redrawGuide('rclkmap', this.selectedTeeths, "rgba(0, 0, 0, .9)");
  }

  resetListandTeeths() {
    //@ts-ignore -- clear all selections
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
    document.querySelectorAll('.showNode').forEach(el => el.classList.remove('showNode', 'active'));
    this.redrawGuide('rcurrmap', [], "rgba(255, 255, 0, 0.9)");
    this.notes.nativeElement.value = "";
  }

  toothGuide: any = {};
  toothGuideArray = [];

  getToothGuideAsArray() {
    let array = [];
    Object.entries(this.toothGuide).forEach(
      ([key, value]) => {
        array.push({
          name: this.getToothName(key),
          selctions: value['selections'],
          notes: value['notes'],
          key: key
        });
      }
    );
    this.toothGuideArray = array;
    return array;
  }


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
          this.toothGuide[this.activeAssignedTeeth]['selections'] = this.toothGuide[this.activeAssignedTeeth]['selections'].filter(e => e !== event.target.getAttribute('id'))
          if (this.toothGuide[this.activeAssignedTeeth]['selections'].length == 0)
            delete this.toothGuide[this.activeAssignedTeeth];
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
              this.toothGuide[element]['selections'] = this.toothGuide[element]['selections'].filter(e => e !== event.target.getAttribute('id'));
            if (this.toothGuide[element]['selections'].length == 0)
              delete this.toothGuide[element];
          });
        }
        if (this.selectedTeeths.length == 1) {
          this.activeAssignedTeeth = this.selectedTeeths[0];
          this.redrawGuide('rcurrmap', [this.activeAssignedTeeth], "rgba(255, 255, 0, 0.9)");
        }
        // this.activeAssignedTeeth = this.selectedTeeths[0];
      }
      this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.7)");
    } else {
      var path = event.path || (event.composedPath && event.composedPath());
      let ellm: HTMLElement = path[0].nextSibling;
      //@ts-ignore
      if (ellm?.previousSibling?.localName == "h6") ellm.previousSibling?.classList.toggle("showNode");
      ellm?.classList.toggle("showNode");
    }
  }

  loopSeelctionParent(selection) {
    while (selection.parentNode) {
      if (selection.classList.contains("showNode") || selection.classList.contains("selectionTree")) {
        selection.classList.add('active');
      }
      selection = <HTMLElement>selection.parentNode;
    }
  }

  deleteSelection(key) {
    sweetAlert({
      title: "Do you want to delete this selection?",
      icon: "warning",
      buttons: [`No,don't delete`, 'Yes,delete tooth'],
      dangerMode: true,
    })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result) {
          if (key) {
            delete this.toothGuide[key];
            this.resetListandTeeths();
            this.activeAssignedTeeth = null;
            this.selectedTeeths = [];
            this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.8)");
            this.redrawGuide('rclkmap', this.selectedTeeths, "rgba(0, 0, 0, .9)");
          }
        }
      });
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
    this.getToothGuideAsArray();
  }
}
