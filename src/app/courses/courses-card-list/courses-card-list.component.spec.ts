import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesCardListComponent } from "./courses-card-list.component";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    component.ngOnInit();
    const cards = el.queryAll(By.css(".course-card"));

    expect(cards.length).toBeGreaterThan(0, "Could not find cards");
    expect(cards.length).toEqual(12, "Unexpected number of courses");
  });

  it("should correctly display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const firstCourse = component.courses[0];
    const firstCard = el.query(By.css(".course-card:first-child"));

    expect(firstCard).toBeTruthy("Could not find course card");

    const title = firstCard.query(By.css("mat-card-title"));
    const image = firstCard.query(By.css("img"));
    const content = firstCard.query(By.css("mat-card-content"));

    expect(title.nativeElement.textContent).toEqual(
      firstCourse.titles.description
    );
    expect(image.nativeElement.src).toEqual(
      firstCourse.iconUrl,
      "Missing image"
    );
    expect(content.nativeElement.textContent).toContain(
      firstCourse.titles.longDescription
    );
    // test display of View course button
    const button = firstCard.query(By.css("mat-card-actions button"));
    expect(button.nativeElement.textContent).toContain("VIEW COURSE");

    // test display of EDIT button
    const editButton = firstCard.query(By.css("#edit-button"));
    if (!editButton) fail("Could not find EDIT button");
    expect(editButton.nativeElement?.textContent.trim()).toBe(
      "EDIT",
      "Wrong label for edit Button"
    );
  });
});
