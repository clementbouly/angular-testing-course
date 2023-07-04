import { HttpErrorResponse } from "@angular/common/http";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

fdescribe("CoursesService", () => {
  let courseService: CoursesService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    courseService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    courseService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "incorrect number of courses");
      const course = courses.find((course) => course.id == 12);
      const mockCourse = COURSES[12];
      expect(course).toEqual(mockCourse);
    });

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    req.flush({
      payload: Object.values(COURSES),
    });
  });

  it("should find a course by id", () => {
    courseService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    courseService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");

    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    const error: HttpErrorResponse = new HttpErrorResponse({
      status: 500,
      statusText: "Internal Server Error",
    });
    courseService.saveCourse(12, changes).subscribe(
      () => fail("the save course operation should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");

    req.flush("Save course failed", error);
  });

  it("should find a list of lessons given parameters", () => {
    courseService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req) =>
        req.url == "/api/lessons" &&
        req.params.get("courseId") == "12" &&
        req.params.get("filter") == "" &&
        req.params.get("sortOrder") == "asc" &&
        req.params.get("pageNumber") == "0" &&
        req.params.get("pageSize") == "3"
    );

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
