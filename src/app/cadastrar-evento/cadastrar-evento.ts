import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface RespostaAdmin {
  message: string;
}

@Component({
  selector: 'app-cadastrar-evento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastrar-evento.html',
  styleUrl: './cadastrar-evento.css'
})
export class CadastrarEvento {
  mensagem: string = '';
  tipoMensagem: 'success' | 'danger' = 'success';

  formularioEvento = new FormGroup({
    titulo: new FormControl('', Validators.required),
    descricao: new FormControl('', Validators.required),
    nomePalestrante: new FormControl('', Validators.required),
    localEvento: new FormControl('', Validators.required),
    dataEvento: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    if (this.formularioEvento.valid) {
      // Ajusta o formato da data para o padrão aceito pelo MySQL
      const dadosForm = { ...this.formularioEvento.value };
      if(dadosForm.dataEvento) {
        dadosForm.dataEvento = dadosForm.dataEvento.replace('T', ' ') + ':00';
      }

      this.http
        .post<RespostaAdmin>(
          'http://localhost:3000/api/admin',
          dadosForm
        )
        .subscribe({
          next: (res) => {
            this.tipoMensagem = 'success';
            this.mensagem = res.message || 'Evento cadastrado com sucesso!';
            this.formularioEvento.reset(); // Limpa o form após salvar
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.tipoMensagem = 'danger';
            this.mensagem = err?.error?.message || 'Erro ao cadastrar evento';
            this.cdr.detectChanges();
          },
        });
    }
  }
}