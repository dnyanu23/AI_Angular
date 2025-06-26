import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenAIComponent } from './gen-ai.component';

describe('GenAIComponent', () => {
  let component: GenAIComponent;
  let fixture: ComponentFixture<GenAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenAIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
