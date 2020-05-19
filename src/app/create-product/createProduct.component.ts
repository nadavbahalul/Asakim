import { Component, OnInit } from "@angular/core";
import { Product } from "./createProduct.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProductService } from "./createProduct.service";
import { mimeType } from "../mime-type.validator";
import { AuthService } from "../auth/auth.service";
import { Router, ParamMap, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import imageCompression from "browser-image-compression";

@Component({
  selector: "product",
  templateUrl: "./createProduct.component.html",
  styleUrls: ["./createProduct.component.css"]
})
export class ProductComponent implements OnInit {
  isLoading = false;
  mode = "create";
  private productId: string;
  product: Product;
  form: FormGroup;
  imagePreview: string;
  measureUnits = [
    { value: "none", viewValue: "יחידה אחת" },
    { value: "kg", viewValue: '1 ק"ג' },
    { value: "gram", viewValue: "100 גרם" },
    { value: "liter", viewValue: "1 ליטר" }
  ];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.formInit();
    this.form.controls["measureUnit"].setValue("none");
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.mode = "edit";
        this.productId = paramMap.get("id");
        this.productService.getProduct(this.productId).subscribe(response => {
          this.form.setValue({
            name: response.product.name,
            content: response.product.content,
            price: response.product.price,
            measureUnit: response.product.measureUnit,
            image: response.product.imagePath
          });
          this.imagePreview = this.form.value.image;
          this.isLoading = false;
        });
      }
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
      price: new FormControl(null, {
        validators: [Validators.required]
      }),
      measureUnit: new FormControl(null, {})
    });
  }

  onSaveProduct(backToStore: boolean) {
    if (this.form.valid) {
      this.isLoading = true;
      if (this.mode === "create") {
        this.productService
          .createProduct(
            this.form.value.name,
            this.form.value.content,
            this.form.value.image,
            this.form.value.price,
            this.form.value.measureUnit,
            this.authService.getUserId()
          )
          .subscribe(response => {
            this.informUserAfterSave(
              response,
              backToStore,
              "המוצר נוצר בהצלחה"
            );
          });
      } else {
        this.productService
          .updateProduct(
            this.productId,
            this.form.value.name,
            this.form.value.content,
            this.form.value.image,
            this.form.value.price,
            this.form.value.measureUnit,
            this.authService.getUserId()
          )
          .subscribe(response => {
            this.informUserAfterSave(
              response,
              backToStore,
              "המוצר עודכן בהצלחה"
            );
          });
      }
    }
  }

  private informUserAfterSave(response, backToStore, message) {
    if (response) {
      this.isLoading = false;
      if (backToStore) {
        this.router.navigate(["/store"], {
          queryParams: { id: localStorage.getItem("storeId") }
        });
        this._snackBar.open(message, null, {
          duration: 2000
        });
      } else {
        this._snackBar.open(message, null, {
          duration: 2000
        });
        this.form.reset();
      }
    }
  }

  async onImageUpload(event: Event) {
    let originImage = (event.target as HTMLInputElement).files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(originImage, options);
    originImage = new File([compressedFile], originImage.name, {
      type: originImage.type
    });
    this.form.patchValue({ image: originImage });
    this.form.get("image").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(originImage);
  }
}
