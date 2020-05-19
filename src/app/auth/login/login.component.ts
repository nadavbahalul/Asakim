import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import * as queryString from "query-string";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSub: Subscription;
  public googleLoginUrl;

  constructor(public authService: AuthService) {}

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    const stringifiedParams = queryString.stringify({
      client_id:
        "922272879107-ihaoe7jp61l2n0o6616lr7l84uc2ut2v.apps.googleusercontent.com",
      redirect_uri: "http://localhost:4200",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ].join(" "), // space seperated string
      response_type: "code",
      access_type: "offline",
      prompt: "consent"
    });

    this.googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe(authData => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
