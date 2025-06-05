import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteAnalysisComponent } from './enquete-analysis.component';

describe('EnqueteAnalysisComponent', () => {
  let component: EnqueteAnalysisComponent;
  let fixture: ComponentFixture<EnqueteAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
