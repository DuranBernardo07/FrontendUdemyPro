import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeccionDto } from '../../models/LeccionDto';
import {LeccionService} from "../../services/leccion.service";
import {PaginadoDto} from "../../models/PaginadoDto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TemaDto} from "../../models/TemaDto";
import {TemaService} from "../../services/tema.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit{
  selectedFile: File | null = null; // Archivo seleccionado
  fileError: string | null = null; // Error relacionado con el archivo
  previewUrl: string | ArrayBuffer | null = null; // URL de vista previa de la imagen
  subjectForm!: FormGroup;
  userId: number | null = null; // Almacenar el ID del usuario logueado
  leccionId: number | null = null; // Almacenar el ID de la lección actual

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leccionService: LeccionService,
    private temaService: TemaService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('idUsuario');
    this.leccionId = Number(this.route.snapshot.paramMap.get('id'));
    this.subjectForm = this.fb.group({
      titulo: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      recursoMultimedia: ['', [Validators.required]],
      Leccion_id_leccion: [this.leccionId, [Validators.required]],
    });
  }

  createSubject(): void {
    if (this.subjectForm.valid) {
      this.temaService.createTema(this.subjectForm.value).subscribe(
        (response) => {
          this.snackBar.open('Tema creado con éxito.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/course-lections', this.leccionId]);
        },
        (error) => {
          console.error(error);
          this.snackBar.open('No se pudo crear el tema.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, complete todos los campos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (file) {
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validExtensions.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;

        // Mostrar vista previa de la imagen seleccionada
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
        console.log('Vista previa de la imagen lista');
      } else {
        this.fileError = 'Por favor, selecciona un archivo con formato .jpg, .jpeg o .png';
        this.selectedFile = null;
        this.previewUrl = null;
        console.error('Formato de archivo inválido:', file.type);
      }
    }
  }

}
