import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./authData.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { User } from "./user.model";
import { MatDialog } from "@angular/material/dialog";
import { InfoComponent } from "../info/info.component";

@Injectable({ providedIn: "root" })
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private API_URL = environment.apiURL;
  private isAuth = false;
  private userId: string;
  private tokenTimer;
  private token;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getUserId() {
    return this.userId;
  }

  createUser(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    password: string
  ) {
    const newUser: User = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: password
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.API_URL + "/auth/signup",
        newUser
      )
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            this.isAuth = true;
            this.userId = response.userId;
            const expiresDuration = response.expiresIn;
            this.setAuthTimer(expiresDuration);
            const expirationDate: Date = new Date(
              new Date().getTime() + expiresDuration * 1000
            );

            this.saveAuthData(this.token, expirationDate);
            this.dialog.open(InfoComponent, {
              data: {
                messageHeader: "שמחים שהצטרפת!",
                messageBody: "עכשיו תוכלו לפתוח את החנות שלכם באתר"
              }
            });

            this.router.navigate(["/"]);
          }
        },
        error => {
          this.authStatusListener.next(false);
          this.router.navigate(["/signup"]);
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.API_URL + "/auth/login",
        authData
      )
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            this.isAuth = true;
            this.userId = response.userId;
            console.log(response.userId);
            const expiresDuration = response.expiresIn;
            this.setAuthTimer(expiresDuration);
            const expirationDate: Date = new Date(
              new Date().getTime() + expiresDuration * 1000
            );

            this.saveAuthData(this.token, expirationDate);
            this.router.navigate(["/"]);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", this.userId);
  }

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn =
        (authInformation.expirationDate.getTime() - now.getTime()) / 1000;

      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuth = true;
        this.userId = authInformation.userId;
        this.authStatusListener.next(true);
        this.setAuthTimer(expiresIn);
      }
    }
  }

  setAuthTimer(duration: number) {
    this.authStatusListener.next(true);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  sendGoogleCode(code: any) {
    const googleCode = { code: code };
    console.log(googleCode);
    this.http
      .post(this.API_URL + "/auth/login/google", googleCode)
      .subscribe(response => {});
  }
}
