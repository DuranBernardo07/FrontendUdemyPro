import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CursoService } from 'src/app/services/course.service';
import { AuthService } from 'src/app/services/auth.service';
import { Categoria } from 'src/app/models/categoriaDto';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css'],
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  selectedFile: File | null = null; // Archivo seleccionado
  fileError: string | null = null; // Error relacionado con el archivo
  previewUrl: string | ArrayBuffer | null = null; // URL de vista previa de la imagen
  categorias: Categoria[] = []; // Almacenar las categorías obtenidas de la API
  userId: number | null = null; // Almacenar el ID del usuario logueado
  isSubmitting = false; // Controlar el estado del botón de envío

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private categoriaService: CategoriaService,
    private cursoService: CursoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario con validaciones
    this.courseForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', [Validators.maxLength(250)]],
      dificultad: ['Beginner', Validators.required],
      estado: [true, Validators.required],
      Categoria_id_categoria: [null, [Validators.required]],
    });

    this.loadCategorias();

    // Obtener el ID del usuario logueado directamente desde localStorage
    const storedUserId = localStorage.getItem('idUsuario');
    if (storedUserId) {
      this.userId = Number(storedUserId);
      console.log('User ID cargado desde localStorage:', this.userId);
    } else {
      console.error('Error: No se encontró el ID del usuario logueado en localStorage.');
      this.snackBar.open('Error al cargar el ID del usuario. Por favor, inicie sesión nuevamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategoryId = Number(selectElement.value);
    this.courseForm.patchValue({ Categoria_id_categoria: selectedCategoryId });
    console.log('Categoría seleccionada - ID:', selectedCategoryId);
  }

  loadCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        console.log('Categorías cargadas exitosamente:', this.categorias);
      },
      error: (error) => {
        console.error('Error al cargar las categorías:', error);
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('Archivo seleccionado:', file);

    if (file) {
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validExtensions.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;

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

  onSubmit(): void {
    if (!this.courseForm.valid || !this.selectedFile || this.userId === null) {
      console.error('Formulario inválido o falta información.');
      this.snackBar.open('Por favor, completa todos los campos y selecciona una imagen de portada.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.isSubmitting = true; // Desactiva el botón

    const formData = new FormData();
    formData.append('nombre', this.courseForm.value.nombre);
    formData.append('descripcion', this.courseForm.value.descripcion);
    formData.append('dificultad', this.courseForm.value.dificultad);
    formData.append('estado', this.courseForm.value.estado.toString());
    formData.append('categoriaId', this.courseForm.value.Categoria_id_categoria.toString());
    formData.append('usuarioCreadorId', this.userId.toString());

    if (this.selectedFile) {
      formData.append('portada', this.selectedFile, this.selectedFile.name);
    }

    formData.forEach((value, key) => {
      console.log(`FormData - ${key}:`, value);
    });

    this.cursoService.createCurso(formData).subscribe({
      next: (response) => {
        console.log('Curso creado:', response);
        this.snackBar.open('¡Curso creado exitosamente!', 'Cerrar', {
          duration: 3000,
        });
        this.isSubmitting = false; // Reactiva el botón después del éxito
        this.router.navigate(['/my-courses']);
      },
      error: (error) => {
        console.error('Error al crear curso:', error);
        this.snackBar.open('Error al crear el curso. Inténtalo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
        this.isSubmitting = false; // Reactiva el botón en caso de error
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/my-courses']);
  }

  getErrorMessage(field: string): string {
    if (this.courseForm.get(field)?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (this.courseForm.get(field)?.hasError('maxlength')) {
      return `Máximo ${this.courseForm.get(field)?.errors?.['maxlength'].requiredLength} caracteres permitidos.`;
    }
    return '';
  }
}
