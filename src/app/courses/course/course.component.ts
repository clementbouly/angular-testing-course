import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { fromEvent, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { LessonsDataSource } from "../services/lessons.datasource";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course;

  dataSource: LessonsDataSource;

  displayedColumns = ["seqNo", "description", "duration"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild("input", { static: true }) input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    console.log("route.snapshot.data", this.route.snapshot.data);

    this.course = this.route.snapshot.data["course"];

    this.dataSource = new LessonsDataSource(this.coursesService);

    this.dataSource.loadLessons(this.course.id, "", "asc", 0, 3);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadLessonsPage();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadLessonsPage()))
      .subscribe();
  }

  loadLessonsPage() {
    this.dataSource.loadLessons(
      this.course.id,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
}
