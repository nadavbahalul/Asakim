import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: "./info.component.html"
})
export class InfoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { messageHeader: string; messageBody: string }
  ) {}
}
