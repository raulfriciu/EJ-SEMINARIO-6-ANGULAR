import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExperienciaService } from '../services/experiencia.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Experiencia } from '../models/experiencia.model';
import { CommonModule } from '@angular/common';  // Asegura importar el módulo necesario para directivas como *ngFor y *ngIf

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  standalone: true,  // Importante para componentes independientes
  imports: [ReactiveFormsModule, FormsModule, CommonModule]  // Asegura importar los módulos necesarios
})
export class BuscadorComponent implements OnInit {
  searchForm: FormGroup;
  userExperiences: Experiencia[] = [];
  userFound: boolean = false;
  userNotFound: boolean = false;
  users: User[] = []; // Lista de todos los usuarios

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private experienciaService: ExperienciaService
  ) {
    this.searchForm = this.fb.group({
      username: [''],  // Inicializa el campo del formulario
    });
  }

  ngOnInit(): void {
    // Cargar todos los usuarios al iniciar el componente
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  searchUser(): void {
    const username = this.searchForm.get('username')?.value;
  
    if (!username) {
      alert('Por favor, introduce un nombre de usuario para buscar.');
      return; // Salir si no hay un nombre de usuario
    }
  
    const user = this.users.find((u) => u.name.toLowerCase() === username.toLowerCase());
  
    if (user) {
      this.experienciaService.getExperiencias().subscribe(
        (experiencias: Experiencia[]) => {
          this.userExperiences = experiencias.filter((exp) => exp.owner === user._id);
  
          // Comprobación de la cantidad de experiencias encontradas
          console.log('Experiencias encontradas:', this.userExperiences);
          this.userFound = this.userExperiences.length > 0;
          this.userNotFound = false;
        },
        (error) => {
          console.error('Error al obtener experiencias:', error);
          this.userFound = false;
          this.userNotFound = true;
        }
      );
    } else {
      this.userFound = false;
      this.userNotFound = true;
      console.log('Usuario no encontrado');
    }
  }
  
}
