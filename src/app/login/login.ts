import { Auth } from '../auth';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface respostaLogin {
  message: string;
  tipoMensagem: string;
  userData: {
    id: number;
    email: string;
    nome: string;
    admin: boolean;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  mensagem: string = '';
  tipoMensagem: string = '';
  userData: { id: number; email: string; nome: string; admin: boolean } = {
    id: 0,
    email: '',
    nome: '',
    admin: false,
  };

  formularioLogin = new FormGroup({
    email: new FormControl('', Validators.required),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: Auth
  ) {}

  onSubmit() {
    if (this.formularioLogin.valid) {
      this.http
        .post<respostaLogin>(
          'http://localhost:3000/api/login',
          this.formularioLogin.value
        )
        .subscribe({
          next: (res) => {
            this.tipoMensagem = res.tipoMensagem || 'success';
            this.mensagem = res.message || 'Login realizado com sucesso!';
            this.cdr.detectChanges();

            if (this.tipoMensagem === 'success') {
              this.authService.login(res.userData); // <-- Salva a sessão
              setTimeout(() => {
                this.router.navigateByUrl('/home', {
                  state: { userData: res.userData },
                });
              }, 1500);
            }
          },
          error: (err) => {
            this.tipoMensagem = err.error?.tipoMensagem || 'danger';
            this.mensagem = err.error?.message || 'Usuário ou senha inválidos';
            this.cdr.detectChanges();
          },
        });
    }
  }
}