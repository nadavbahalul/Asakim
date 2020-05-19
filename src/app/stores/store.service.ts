import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Store } from "./store.model";

@Injectable({ providedIn: "root" })
export class StoreService {
  private API_URL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getStores() {
    return this.http.get<{ stores: Store[] }>(this.API_URL + "/store");
  }

  getStore(id) {
    return this.http.get<{ store: Store }>(this.API_URL + "/store/" + id);
  }

  createStore(name, content, image, category, deliveryArea, ownerId) {
    const storeData = new FormData();
    storeData.append("name", name);
    storeData.append("description", content);
    storeData.append("category", category);
    storeData.append("image", image, name);
    storeData.append("deliveryArea", deliveryArea);
    storeData.append("ownerId", ownerId);
    return this.http.post<{ message: string }>(
      this.API_URL + "/createStore",
      storeData
    );
  }
}
