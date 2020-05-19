import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class CategoriesService {
  private API_URL = environment.apiURL;
  private chosenCategoryListener = new Subject<string>();

  constructor(private http: HttpClient) {}

  getChosenCategoryListener() {
    return this.chosenCategoryListener;
  }

  getCategories() {
    return this.http.get<{ categories: { categories: string[] } }>(
      this.API_URL + "/category"
    );
  }
}
