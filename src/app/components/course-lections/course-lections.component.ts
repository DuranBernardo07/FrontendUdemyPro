import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeccionDto } from '../../models/LeccionDto';
import {LeccionService} from "../../services/leccion.service";
import {PaginadoDto} from "../../models/PaginadoDto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TemaDto} from "../../models/TemaDto";
import {TemaService} from "../../services/tema.service";


@Component({
  selector: 'app-course-lections',
  templateUrl: './course-lections.component.html',
  styleUrls: ['./course-lections.component.css']
})
export class CourseLectionsComponent implements OnInit {
  lecciones = {} as LeccionDto;
  temasDto : TemaDto[] = [];
  paginadoDto: PaginadoDto = {
    page: 1,
    size: 10,
    sortBy: 'idLeccion',
    sortDir: 'asc'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leccionService: LeccionService,
    private temaService: TemaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const leccionId = Number(this.route.snapshot.paramMap.get('id'));
    if (leccionId) {

      this.leccionService.getLeccion(leccionId).subscribe((data: LeccionDto) => {
        this.lecciones = data;
      }, (error) => {
        console.error(error);
        this.snackBar.open('No se pudieron cargar las lecciones.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      });
    } else {
      console.error('No se pudo obtener el ID de la leccion de la URL.');
      this.snackBar.open('No se pudo obtener el ID de la leccion de la URL.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }

    this.temaService.getTemasByCurso(leccionId, this.paginadoDto).subscribe((data: TemaDto[]) => {
      this.temasDto = data;
    }, (error) => {
      console.error(error);
      this.snackBar.open('No se pudieron cargar los temas.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    });
  }

  navigateToLectionForm(): void {
    this.router.navigate(['/create-subject', this.lecciones.idLeccion]);
  }

}
