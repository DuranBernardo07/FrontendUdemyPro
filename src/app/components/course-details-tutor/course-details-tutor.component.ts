import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CursoService } from 'src/app/services/course.service';
import { LeccionService } from '../../services/leccion.service';
import { PaginadoDto } from '../../models/PaginadoDto';
import { LeccionDto } from '../../models/LeccionDto';

interface Course {
  id: number;
  name: string;
  date: string;
  time: string;
  studentsEnrolled: number;
  image: string;
}

@Component({
  selector: 'app-course-details-tutor',
  templateUrl: './course-details-tutor.component.html',
  styleUrls: ['./course-details-tutor.component.css']
})
export class CourseDetailsTutorComponent implements OnInit {
  course: any;
  isEnrolled: boolean = false;
  lecciones: LeccionDto[] = [];
  paginadoDto: PaginadoDto = {
    page: 0,
    size: 10,
    sortBy: 'idLeccion',
    sortDir: 'asc'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cursoService: CursoService,
    private leccionService: LeccionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.course = {
        id: params['id'],
        name: params['name'],
        date: params['date'],
        time: params['time'],
        studentsEnrolled: params['studentsEnrolled'],
        image: params['image']
      };
    });

    if (this.course) {
      this.loadCourseDetails(this.course.id);
      this.loadLeccionesByCursoId(this.course.id, this.paginadoDto);
    }
  }

  loadCourseDetails(courseId: number): void {
    this.cursoService.getCursoById(courseId).subscribe({
      next: (data) => {
        this.course = data;
        console.log('Detalles del curso cargados:', this.course);
      },
      error: (error) => {
        console.error('Error al cargar los detalles del curso:', error);
      }
    });
  }

  loadLeccionesByCursoId(cursoId: number, paginadoDto: PaginadoDto): void {
    this.leccionService.getLeccionesByCurso(cursoId, paginadoDto).subscribe({
      next: (data) => {
        console.log('Data:', data);
        this.lecciones = data.content;
        console.log('Lecciones del curso cargadas:', this.lecciones);
      },
      error: (error) => {
        console.error('Error al cargar las lecciones del curso:', error);
      }
    });
  }

  enrollInCourse(): void {
    this.isEnrolled = true;
  }

  goBack(): void {
    this.router.navigate(['/my-courses']);
  }

  editCourse(): void {
    if (this.course) {
      this.router.navigate(['/course-edit-tutor'], {
        queryParams: {
          id: this.course.id,
          name: this.course.name,
          date: this.course.date,
          time: this.course.time,
          studentsEnrolled: this.course.studentsEnrolled,
          image: this.course.image
        }
      });
    }
  }

  deleteCourse(id: number): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el curso: ${this.course?.name}?`)) {
      this.cursoService.deleteCurso(id).subscribe({
        next: () => {
          console.log(`Curso con ID ${id} eliminado`);
          this.snackBar.open('Curso eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/my-courses']);
        },
        error: (error) => {
          console.error('Error al eliminar el curso:', error);
        }
      });
    }
  }

  viewSubject(id: number): void {
    this.router.navigate(['/course-lections/', id]);
  }

  addLesson(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/create-lection/', courseId]);
  }

  editLesson(id: number): void {
    console.log('ID de la lección:', id);
    this.router.navigate(['/update-lection/', id]);
  }

  deleteLesson(id: number): void {
    this.leccionService.deleteLeccion(id).subscribe({
      next: () => {
        this.snackBar.open('Lección eliminada con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al eliminar la lección:', error);
      }
    });
  }
}
