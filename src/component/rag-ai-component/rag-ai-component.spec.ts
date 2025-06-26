import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagAiComponent } from './rag-ai-component';

describe('RagAiComponent', () => {
  let component: RagAiComponent;
  let fixture: ComponentFixture<RagAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RagAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RagAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
