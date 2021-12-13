import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public networkForm: FormGroup;
  public fileSize: number;

  public twoGSpeedProgress: number = 0;
  public threeGSpeedProgress: number = 0;
  public fourGSpeedProgress: number = 0;
  public fiveGSpeedProgress: number = 0;

  public twoGSpeed: number = 0.05;
  public threeGSpeed: number = 1;
  public fourGSpeed: number = 5;
  public fiveGSpeed: number = 100;

  constructor() {}

  public ngOnInit(): void {
    this.networkForm = this.getNetworkForm();
  }

  public getNetworkForm(): FormGroup {
    return new FormGroup({
      fileSize: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(45000),
        this.onlyIntegersValidator()
      ])
    });
  }

  public manageProgress(): void {
    if (this.twoGSpeedProgress !== 100 && this.fileSize < 40) {
      this.twoGSpeedProgress = this.twoGSpeedProgress + 100 / (this.fileSize / this.twoGSpeed) / 10;
    }

    if (this.threeGSpeedProgress !== 100 && this.fileSize < 1500) {
      this.threeGSpeedProgress = this.threeGSpeedProgress + 100 / (this.fileSize / this.threeGSpeed) / 10;
    }

    if (this.fourGSpeedProgress !== 100 && this.fileSize < 5000) {
      this.fourGSpeedProgress = this.fourGSpeedProgress + 100 / (this.fileSize / this.fourGSpeed) / 10;
    }

    if (this.fiveGSpeedProgress !== 100) {
      this.fiveGSpeedProgress = this.fiveGSpeedProgress + 100 / (this.fileSize / this.fiveGSpeed) / 10;
    }
  }

  public onlyIntegersValidator(): ValidatorFn {
    const regExp = new RegExp('^[0-9]+$');

    return (control: AbstractControl): ValidationErrors | null => {
      return !regExp.test(control.value) ? {onlyIntegers: true} : null;
    };
  }

  public getErrorMessage(): string {
    let errorMessage: string;

    if (this.networkForm?.get('fileSize')?.hasError('required')) {
      errorMessage = 'Це поле не може бути пустим';
    } else if (this.networkForm?.get('fileSize')?.hasError('min')) {
      errorMessage = 'Мінімальне значення 1';
    } else if (this.networkForm?.get('fileSize')?.hasError('max')) {
      errorMessage = 'Максимальне значення 45000';
    } else {
      errorMessage = 'Допустимі лише цілі числа';
    }

    return errorMessage;
  }

  public onFormSubmit(form_directive: FormGroupDirective): void {
    if (this.networkForm.valid) {
      this.fileSize = Number(this.networkForm?.get('fileSize')?.value);
      setInterval(() => this.manageProgress(), 100);
      form_directive.resetForm();
    }
  }
}
