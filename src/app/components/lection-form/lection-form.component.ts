import {Component, OnInit} from '@angular/core';
import { LeccionService } from '../../services/leccion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/course.service';
import { CursoDto } from '../../models/CursoDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeccionDto } from '../../models/LeccionDto';


@Component({
  selector: 'app-lection-form',
  templateUrl: './lection-form.component.html',
  styleUrls: ['./lection-form.component.css']
})
export class LectionFormComponent implements OnInit {

  selectedFile: File | null = null; // Archivo seleccionado
  fileError: string | null = null; // Error relacionado con el archivo
  previewUrl: string | ArrayBuffer | null = null; // URL de vista previa de la imagen
  leccionForm!: FormGroup;
  userId: number | null = null; // Almacenar el ID del usuario logueado
  courseId: number | null = null; // Almacenar el ID del curso actual
  course: CursoDto | null = null; // Almacenar los detalles del curso actual

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private leccionService: LeccionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder

  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('idUsuario');
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.leccionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      duracionEstimada: ['', [Validators.required]],
      contenido: ['', [Validators.required]],
      Curso_id_curso: [this.courseId, [Validators.required]],
    });
  }

  // Crear una nueva lección
  createLeccion(): void {
    if (this.leccionForm.valid) {
      this.leccionService.createLeccion(this.leccionForm.value).subscribe(
        (response) => {
          this.snackBar.open('Lección creada con éxito.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/course-details', this.courseId]);
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Error al crear la lección. Por favor, inténtelo de nuevo.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, complete el formulario correctamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  // Evento cuando se selecciona un archivo
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
