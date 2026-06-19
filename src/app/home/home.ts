import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Auth } from '../auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  palestras: any[] = [];
  minhasInscricoes: number[] = []; // <-- Nova lista de controle
  mensagem: string = '';
  tipoMensagem: string = 'success';
  usuarioId: number | null = null;

  constructor(
    private http: HttpClient, 
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.usuarioId = user.id;
      this.carregarMinhasInscricoes(); // <-- Busca as inscrições ao carregar a tela
    }
    this.carregarPalestras();
  }

  carregarPalestras() {
    this.http.get<any[]>('http://localhost:3000/api/palestras')
      .subscribe({
        next: (dados) => {
          this.palestras = dados;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao carregar palestras', err)
      });
  }

  carregarMinhasInscricoes() {
    if (!this.usuarioId) return;
    this.http.get<number[]>(`http://localhost:3000/api/inscricoes/${this.usuarioId}`)
      .subscribe({
        next: (ids) => {
          this.minhasInscricoes = ids;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao carregar inscrições do usuário', err)
      });
  }

  inscrever(idPalestra: number, titulo: string) {
    // Pergunta de confirmação
    if (confirm(`Você confirma sua inscrição na palestra: "${titulo}"?`)) {
      this.http.post('http://localhost:3000/api/inscricao', {
        idUsuario: this.usuarioId,
        idPalestra: idPalestra
      }).subscribe({
        next: (res: any) => {
          this.tipoMensagem = 'success';
          this.mensagem = res.message || 'Inscrição realizada!';
          this.minhasInscricoes.push(idPalestra);
          this.cdr.detectChanges();
          window.scrollTo(0, 0); 
        },
        error: (err) => {
          this.tipoMensagem = 'warning';
          this.mensagem = err.error?.message || 'Erro ao realizar inscrição';
          this.cdr.detectChanges();
          window.scrollTo(0, 0);
        }
      });
    }
  }

  cancelarInscricao(idPalestra: number, titulo: string) {
    // Pergunta de confirmação
    if (confirm(`Deseja realmente cancelar sua inscrição na palestra: "${titulo}"?`)) {
      this.http.delete(`http://localhost:3000/api/inscricao/${this.usuarioId}/${idPalestra}`)
        .subscribe({
          next: (res: any) => {
            this.tipoMensagem = 'success';
            this.mensagem = res.message;
            this.minhasInscricoes = this.minhasInscricoes.filter(id => id !== idPalestra);
            this.cdr.detectChanges();
            window.scrollTo(0, 0);
          },
          error: (err) => {
            this.tipoMensagem = 'danger';
            this.mensagem = 'Erro ao cancelar inscrição.';
            this.cdr.detectChanges();
            window.scrollTo(0, 0);
          }
        });
    }
  }
}