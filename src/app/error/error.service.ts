import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ErrorService {
  private isErrorListener = new Subject<boolean>();

  getIsErrorListener() {
    return this.isErrorListener;
  }
}
