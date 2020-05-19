import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSub: Subscription;
  isInputValid = false;
  constructor(
    public authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe(authData => {
        this.isLoading = false;
      });
  }

  onSignup(signupForm: NgForm) {
    if (
      signupForm.invalid ||
      signupForm.value.password !== signupForm.value.confirmPassword
    ) {
      this._snackBar.open(
        "הסיסמאות אינן תואמות זו את זו, הכניסו בבקשה שוב אימות לסיסמא",
        "OK",
        {
          duration: 5000
        }
      );
    } else {
      this.isLoading = true;
      this.authService.createUser(
        signupForm.value.firstName,
        signupForm.value.lastName,
        signupForm.value.phone,
        signupForm.value.email,
        signupForm.value.password
      );
    }
  }
}
