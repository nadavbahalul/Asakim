import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { mimeType } from "../mime-type.validator";
import { MatDialog } from "@angular/material/dialog";
import { InfoComponent } from "../info/info.component";
import { AuthService } from "../auth/auth.service";
import { CategoriesService } from "../category/category.service";
import { Subscription } from "rxjs";
import { StoreService } from "../stores/store.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./createStore.component.html",
  styleUrls: ["./createStore.component.css"]
})
export class CreateStoreComponent implements OnInit, OnDestroy {
  isLoading = false;
  private mode: string;
  form: FormGroup;
  imagePreview: string;
  categories;
  private categoryServiceSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private categoryService: CategoriesService,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.categoryServiceSub.unsubscribe();
  }

  ngOnInit() {
    this.formInit();
    this.categoryServiceSub = this.categoryService
      .getCategories()
      .subscribe(response => {
        this.categories = response.categories.categories;
      });
  }

  private formInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      deliveryArea: new FormControl(null, {
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onSaveStore() {
    if (this.form.valid) {
      this.isLoading = true;
      this.storeService
        .createStore(
          this.form.value.name,
          this.form.value.content,
          this.form.value.image,
          this.form.value.category,
          this.form.value.deliveryArea,
          this.authService.getUserId()
        )
        .subscribe(response => {
          if (response) {
            this.isLoading = false;
            this.dialog.open(InfoComponent, {
              data: {
                messageHeader: "בשעה טובה!",
                messageBody: "פתחתם חנות, עכשיו רק נשאר להוסיף מוצרים"
              }
            });
            this.router.navigate(["/"]);
          }
        });
      this.form.reset();
    }
  }

  onImageUpload(event: Event) {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: imageFile });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(imageFile);
  }
}
