import { catchError } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { AutenticacaoFirebaseService } from './../servicosInterface/autenticacao-firebase.service';


@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})


export class AppLoginComponent {
  formularioLogin = this.loginBuilder.group({
    email: new FormControl('',[Validators.required, Validators.email]),
    senha: new FormControl('', Validators.required)
  });

  hasUnitNumber=false;

  constructor(
    private loginBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public conteudo:string,
    private toast: HotToastService,
    private rotas: Router,
    private autenticacaoFirebaseService: AutenticacaoFirebaseService,
    private snackBar: MatSnackBar,
    private fecharTela: MatDialog,
    ) {}

    get email(){
      return this.formularioLogin.get('email')
    }

    get senha(){
      return this.formularioLogin.get('senha')
    }
    loginFirebase(){
      if(!this.formularioLogin.valid){
        return;
      }
      const {email, senha} = this.formularioLogin.value;
      this.autenticacaoFirebaseService.loginUsuario(email, senha)
      .pipe(
        this.toast.observe({
          success: 'Login efetuado com sucesso!',
        })
      ).subscribe(()=>{
        this.formularioLogin.reset();
        this.rotas.navigate(['/cdd'])
      })

      this.autenticacaoFirebaseService.loginUsuario(email, senha).subscribe({

        error: (err) => {
          let message = 'Ocorreu um erro'
          switch (err.code) {
            case 'auth/invalid-email':
              message = 'Email inválido';
              break;
            case 'auth/user-not-found':
              message = 'Usuário não encontrado';
              break;
            case 'auth/wrong-password':
              message = 'Senha não confere';
              break
            default:
              message = 'Ocorreu um erro!'
        }
        this.toast.show(message);
      }
    })
  }
  fecharDialogo() {
    this.fecharTela.closeAll();
  }
}
