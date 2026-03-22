import { ChangeDetectorRef, Component } from '@angular/core';
import { icons } from '../../../shared/constants/iconPaths';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth-service';
import { LoginDTO } from '../../models/login.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  icons = icons;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  passwordType: string = 'password';
  loginError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  togglePasswordType(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }
  onSubmit(): void {
    this.isLoading = true;
    const loginDTO = this.getLoginDTO();
    this.authService.login(loginDTO).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.isLoading = false;
        this.loginError = true;
        this.cdr.detectChanges();
      },
    });
  }

  private getLoginDTO(): LoginDTO {
    const { email, password } = this.loginForm.getRawValue();
    return { email: email!, password: password! };
  }
}
