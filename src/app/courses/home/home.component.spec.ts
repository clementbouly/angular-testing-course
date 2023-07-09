import { DebugElement } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;
  let mockCoursesService: jasmine.SpyObj<CoursesService>;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    mockCoursesService = jasmine.createSpyObj<CoursesService>(
      "CoursesService",
      ["findAllCourses"]
    );

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: mockCoursesService }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));
  it("should display only beginner courses if it's the only category available", () => {
    mockCoursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses if it's the only category available", () => {
    mockCoursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    mockCoursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(2, "Expected to find 2 tabs");
  });

  it("should display correct labels for tabs", () => {
    mockCoursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    const beginnerLabel = tabs[0].query(By.css(".mdc-tab__text-label"))
      .nativeElement.innerText;
    const advancedLabel = tabs[1].query(By.css(".mdc-tab__text-label"))
      .nativeElement.innerText;
    expect(beginnerLabel).toBe("Beginners");
    expect(advancedLabel).toBe("Advanced");
  });

  it("should display advanced courses when tab clicked ", (done: DoneFn) => {
    mockCoursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    tabs[1].nativeElement.click();
    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = el.queryAll(
        By.css(".mat-mdc-tab-body-active .mat-mdc-card-title")
      );
      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );

      done();
    }, 500);
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    mockCoursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    tabs[1].nativeElement.click();
    fixture.detectChanges();

    tick();

    const cardTitles = el.queryAll(
      By.css(".mat-mdc-tab-body-active .mat-mdc-card-title")
    );
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  }));
});
