import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import 'cardinal-spline-js/src/curve.js'


@Component({
    selector: 'app-referral-guide',
    templateUrl: './referral-guide.component.html',
    styleUrls: ['./referral-guide.component.css']
})
export class ReferralGuideComponent implements OnInit {
    referralObject = {
        "Oral And Maxillofacial Surgeon": [
            "Consultation",
            "Extraction(S)",
            "Orthodontic Exposure",
            "TMJ – Facial Pain",
            "Periapical Surgery",
            "Preprosthetic Surgery/Implants",
            "Incision and Drainage",
            "Surgical Impactions",
            "Pathology/Biopsy",
            "Exposure (s) of Teeth",
            "Ridge Augmentation/Grafting",
            "Oral Pathology",
            "Bone Grafting / Sinus Lift",
        ],
        "Endodontics": [
            "Consultation",
            "Emergency Pain Relief",
            "Endodontic Initial Treatment",
            "Endodontic Re-Treatment  Or Apical Surgery",
            "Periapical Surgery",
            "Endodontic Treatment Initiated Date",
            "Crown/bridge Cemented?",
            "Post Space Required?",
            "Pulp Exposed and Bleeding?",
            "Tooth is open for Drainage?",
            "Patient has Pain?"
        ],
        "Pediatric Dentistry": [
            "Consultation",
            "Complete care Including Hygiene?",
            "Frenectomy?",
            "Specific Treatment",
            "Treatment with Sedation?",
            "Treatment with General Anesthesia?",
            "Orthodontic Consultation Comments"
        ],
        "Periodontics": [
            "Comprehensive Periodontal Consultation",
            "Extraction(S)",
            "Periodontal Disease",
            "Socket Preservation",
            "Functional Crown Lengthening",
            "Preprosthetic Surgery/Implants",
            "Esthetic Crown Lengthening",
            "Surgical Impactions",
            "Pathology/Biopsy",
            "Exposure (s) of Teeth",
            "Ridge Augmentation/Grafting",
            "Oral Pathology",
            "Gingival Recession",
            "Crown Lengthening",
            "Soft Tissue Graft",
            "Bone Grafting / Sinus Lift",
        ],
        "Oral Radiologist": [
            "Referral for Diagnostic Imaging",
            "CBCT",
            "Area of Interest",
            "Measurements",
            "Implant Planning",
            "Patient will bring stent",
            "Hard copy prints",
            "CD with DICOM files",
            "3D Images",
            "Email Images",
            "Panoramic",
            "Uploaded in Dental Live"
        ],
        "TMD/Orofacial Pain & Sleep Apnea": [
            "TMJ Consultation",
            "Headaches/Migraines",
            "Occlusion",
            "TMJ Clicking",
            "TMD/Pain",
            "Locking Jaw (Open or Close)",
            "Limited Mouth Opening",
            "Dizziness",
            "Ear Pain, Ringing or Stuffiness",
            "Facial or Undiagnosed teeth pain",
            "Neck or Shoulder pain or stiffness",
            "Changes in Bite/Occlusion",
            "Sleep Apnea",
            "Uploaded in Dental Live"
        ],
        "Prosthodontist": [
            "Prosthodontic Consultation",
            "Dental Implants",
            "Occlusion",
            "Full Mouth Rehab",
            "TMD/Pain",
            "Removable Prosthodontics",
            "Fixed Prosthodontics",
            "Uploaded in Dental Live"
        ],
        "Orthodonstist": [
            "Orthodontic Consultation",
            "Early and Interceptive Evaluation",
            "Comprehensive Evaluation",
            "Orthognathic Treatment Evaluation",
            "TMD/Pain",
            "Habit Correction",
            "Clear Braces",
            "Crowding",
            "Spacing",
            "Overjet",
            "Overbite",
            "Impacted teeth",
            "Space Maintainer",
            "Molar Up righting",
            "Pre-Prosthetic Planning and implant site development?",
            "Uploaded in Dental Live"
        ]
    }
    @ViewChild('notes')
    notes: ElementRef;
    @Input() readOnly = false


    constructor() { }
    ngOnInit(): void { }

    ngAfterViewInit() {
        this.populateListRecurse(this.referralObject, "tree");

        document.querySelectorAll("#rtooth_map polygon").forEach(item => {
            item.addEventListener('mouseleave', (event: any) => {
                if (event.target.getAttribute('id') && document.getElementsByClassName(event.target.getAttribute('id'))[0]?.tagName == "LI")
                    document.getElementsByClassName(event.target.getAttribute('id'))[0].classList.remove("isOpac")
            });
            item.addEventListener('mouseover', (event: any) => {
                if (event.target.getAttribute('id') && document.getElementsByClassName(event.target.getAttribute('id'))[0]?.tagName == "LI")
                    document.getElementsByClassName(event.target.getAttribute('id'))[0].classList.add("isOpac")
            });
        })
    }
    isChecked(event) {
        this.showLabel = event.target.checked;
    }


    selectionCount = 0;
    liCount = 0;
    showLabel = false;
    isFdi = false;
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
            if (!event.target.getAttribute('points')) return
            let points = event.target.getAttribute('points').split(',');
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.beginPath();
            //@ts-ignore
            ctx.curve(points, 1);
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
        if (this.readOnly) return;
        if (!event.target.getAttribute('points')) return
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
        document.querySelectorAll('input[type=checkbox]').forEach(el => {
            //@ts-ignore
            if (el.id != "showLabelCheck") el.checked = false;
        });
        document.querySelectorAll('.showNode').forEach(el => el.classList.remove('showNode', 'active'));
        this.redrawGuide('rcurrmap', [], "rgba(255, 255, 0, 0.9)");
        this.notes.nativeElement.value = "";
    }

    toothGuide: any = {};

    getToothGuideAsArray() {
        let array = [];
        Object.entries(this.toothGuide).forEach(
            ([key, value]) => {
                if (value['selections'].length == 0 && value['notes'] == '') return;
                array.push({
                    name: this.getToothName(key),
                    selctions: value['selections'],
                    notes: value['notes'],
                    key: key
                });
            }
        );
        return array;
    }

    getToothGuide() {
        return this.toothGuide;
    }

    clearToothGuide() {
        if (Object.keys(this.toothGuide).length == 0) return
        sweetAlert({
            title: "Are you sure,Do you want to clear all the selection?",
            buttons: [`No`, 'Yes'],
        })
            .then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result) {
                    this.setToothGuide({})
                }
            });
    }

    setToothGuide(toothGuide: any) {
        this.toothGuide = toothGuide;
        this.resetListandTeeths();
        this.selectedTeeths = [];
        this.activeAssignedTeeth = null;
        this.redrawGuide('rassgmap', Object.keys(this.toothGuide), "rgba(0, 255, 0, 0.7)");
        this.redrawGuide('rclkmap', this.selectedTeeths, "rgba(0, 0, 0, .9)");
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
                }
                if (this?.toothGuide[this.activeAssignedTeeth] && this.toothGuide[this.activeAssignedTeeth]['selections'].length == 0) {
                    delete this.toothGuide[this.activeAssignedTeeth]
                    this.activeAssignedTeeth = null;
                    this.resetListandTeeths()
                    this.selectedTeeths = [];
                    this.redrawGuide('rclkmap', this.selectedTeeths, "rgba(0, 0, 0, .9)");
                }
            } else {
                //assignment
                if (event.target.checked) {
                    this.selectedTeeths.forEach(element => {
                        if (!this.toothGuide[element])
                            this.toothGuide[element] = { "selections": [], "notes": "" };
                        this.toothGuide[element]['selections'].push(event.target.value);
                    });
                    this.loopSeelctionParent(event.target);
                } else {
                    this.selectedTeeths.forEach(nestedElement => {
                        if (this.toothGuide[nestedElement]) {
                            this.toothGuide[nestedElement]['selections'] = this.toothGuide[nestedElement]['selections'].filter(e => e !== event.target.getAttribute('id'))
                            if (this.toothGuide[nestedElement] && this.toothGuide[nestedElement]['selections'].length == 0) {
                                delete this.toothGuide[nestedElement]
                            }
                        }
                    });
                }
                if (this.selectedTeeths.length == 1) {
                    this.activeAssignedTeeth = this.selectedTeeths[0];
                    this.redrawGuide('rcurrmap', [this.activeAssignedTeeth], "rgba(255, 255, 0, 0.9)");
                }
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
            buttons: [`No:Go Back`, 'Yes:Delete'],
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
        if (canvasName == "rclkmap") {
            document.querySelectorAll('.activeLabelClick').forEach((element) => {
                element.classList.remove('activeLabelClick');
            });
        }
        if (canvasName == "rassgmap") {
            document.querySelectorAll('.activeLabel').forEach((element) => {
                element.classList.remove('activeLabel');
            });
        }

        teethArray.forEach(element => {
            if (canvasName == "rassgmap")
                document.querySelector('.' + element).classList.add("activeLabel")
            if (canvasName == "rclkmap")
                document.querySelector('.' + element).classList.add("activeLabelClick")
            let points = document.getElementById(element).getAttribute('points').split(',');
            ctx.fillStyle = color;
            ctx.beginPath();
            //@ts-ignore
            ctx.curve(points, 1);
            ctx.closePath();
            ctx.fill();
        });
    }
}