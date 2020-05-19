import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorService } from "./error.service";

@Component({
  templateUrl: "./error.component.html"
})
export class ErrorComponent {
  constructor(
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    errorService.getIsErrorListener().next(true);
  }
}
